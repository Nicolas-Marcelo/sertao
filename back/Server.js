const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./correcttask-firebase-adminsdk-99r4a-9562605ff8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const porta = 8080;

app.use(cors());
app.use(express.json());

// Endpoint para obter todos os desafios com as soluções expandidas
app.get('/desafios', async (req, res) => {
  try {
    const desafiosRef = db.collection('desafios');
    const desafiosSnapshot = await desafiosRef.get();

    const desafios = await Promise.all(
      desafiosSnapshot.docs.map(async (doc) => {
        const desafioData = doc.data();

        // Buscar as soluções detalhadas com base nos IDs no array `solucoes`
        const solucoesDetalhadas = [];
        if (desafioData.solucoes && Array.isArray(desafioData.solucoes)) {
          for (const solucaoId of desafioData.solucoes) {
            const solucaoDoc = await db.collection('solucoes').doc(solucaoId).get();
            if (solucaoDoc.exists) {
              solucoesDetalhadas.push({ id: solucaoDoc.id, ...solucaoDoc.data() });
            }
          }
        }

        return {
          id: doc.id,
          ...desafioData,
          dataLimite: desafioData.dataLimite?.toDate ? desafioData.dataLimite.toDate() : null,
          solucoes: solucoesDetalhadas,
        };
      })
    );

    res.status(200).json(desafios);
  } catch (error) {
    console.error('Erro ao obter desafios:', error);
    res.status(500).json({ message: 'Erro ao obter desafios' });
  }
});

app.get('/desafios/:id', async (req, res) => {
  try {
    const desafioId = req.params.id;
    const desafioDoc = await db.collection('desafios').doc(desafioId).get();

    if (!desafioDoc.exists) {
      return res.status(404).json({ message: 'Desafio não encontrado' });
    }

    const desafioData = desafioDoc.data();
    desafioData.dataLimite = desafioData.dataLimite?.toDate ? desafioData.dataLimite.toDate() : null;

    res.status(200).json({ id: desafioDoc.id, ...desafioData });
  } catch (error) {
    console.error('Erro ao obter detalhes do desafio:', error);
    res.status(500).json({ message: 'Erro ao obter detalhes do desafio' });
  }
});

// Endpoint para adicionar uma solução a um desafio
app.post('/desafios/:id/solucoes', async (req, res) => {
  try {
    const desafioId = req.params.id;
    const { solucao } = req.body;

    if (!solucao) {
      return res.status(400).json({ message: 'A solução é obrigatória' });
    }

    const desafioRef = db.collection('desafios').doc(desafioId);
    await desafioRef.update({
      solucoes: admin.firestore.FieldValue.arrayUnion(solucao),
    });

    res.status(200).json({ message: 'Solução adicionada com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar solução:', error);
    res.status(500).json({ message: 'Erro ao adicionar solução' });
  }
});

app.post('/apidesafios', async (req, res) => {
  try {
    const { desafio, recompensa, dataLimite, descricao, comunicacao, criterios, autorId } = req.body;

    if (!autorId || !desafio) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    const novoDesafio = {
      desafio,
      recompensa,
      dataLimite: dataLimite ? new Date(dataLimite) : null,
      descricao,
      comunicacao,
      criterios: Array.isArray(criterios) ? criterios : [],
      autorId,
    };

    await db.collection('desafios').add(novoDesafio);

    res.status(200).json({ message: 'Desafio adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar desafio:', error);
    res.status(500).json({ message: 'Erro ao adicionar desafio' });
  }
});

app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
