import React, { useState, useEffect } from "react";
import { db, auth } from "../Firebase/FirebaseConfig";
import { collection, addDoc, doc, updateDoc, arrayUnion, onSnapshot, getDoc, query, where } from "firebase/firestore";

function ExibirDesafiosFalso() {
  const [desafios, setDesafios] = useState([]);
  const [novaSolucao, setNovaSolucao] = useState("");

  useEffect(() => {
    const mostrarDesafios = async () => {
      const usuario = auth.currentUser;
      if (!usuario) {
        setDesafios([]);
        return;
      }

      const colecaoDesafio = query(
        collection(db, 'desafios'),
        where('autorId', '==', usuario.uid)
      );

      const mostrarSolucoes = onSnapshot(colecaoDesafio, async (desafiosSnapShot) => {
        const listaDesafios = await Promise.all(
          desafiosSnapShot.docs.map(async (desafioDoc) => {
            const desafioData = desafioDoc.data();

            const solucaoLista = await Promise.all(
              (desafioData.solucoes || []).map(async (solucaoId) => {
                const solucaoDoc = await getDoc(doc(db, "solucoes", solucaoId));
                return solucaoDoc.exists() ? { id: solucaoDoc.id, ...solucaoDoc.data() } : null;
              })
            );

            const dataLimite = desafioData.dataLimite && desafioData.dataLimite.seconds
              ? new Date(desafioData.dataLimite.seconds * 1000)
              : null;
            
            return {
              id: desafioDoc.id,
              desafio: desafioData.desafio,
              descricao: desafioData.descricao,
              criterios: desafioData.criterios,
              autorId: usuario.uid,
              dataLimite: dataLimite,
              recompensa: desafioData.recompensa,
              solucoes: solucaoLista.filter((solucao) => solucao),
            };
          })
        );

        setDesafios(listaDesafios);
      });

      return () => mostrarSolucoes();
    };

    mostrarDesafios();
  }, []);

  const adicionarSolucao = async (desafioId) => {
    try {
      const solucaoRef = await addDoc(collection(db, "solucoes"), {
        solucao: novaSolucao,
      });

      const desafioRef = doc(db, "desafios", desafioId);
      await updateDoc(desafioRef, {
        solucoes: arrayUnion(solucaoRef.id),
      });

      setNovaSolucao("");
      alert("Solução adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar solução:", error);
    }
  };

  return (
    <div>
      <strong>ESTA PAGINA DEVE MOSTRAR SOMENTE OS DESAFIOS QUE O USUARIO CRIOU, PAGINA PARA O ADM DE DESAFIO</strong>
      {desafios.map((desafio) => (
        <div key={desafio.id}>
          <h1>Meus Desafios</h1>
          <strong>Nome Desafio: {desafio.desafio}</strong>
          <p>Descricao Desafio: {desafio.descricao}</p>
          <p>Data Limite: {desafio.dataLimite ? desafio.dataLimite.toLocaleDateString("pt-BR") : "Sem data limite"}</p>
          <p>Recompensa: {desafio.recompensa}</p>
          <p>Criterios: {desafio.criterios}</p>
          <p>Autor: {desafio.autorId}</p>
          <ul>
            <strong>Soluções:</strong>
            {desafio.solucoes.map((solucao) => (
              <li key={solucao.id}>
                <strong>{solucao.solucao}</strong> <br />
                <strong>{solucao.usuario}</strong>
              </li>
            ))}
          </ul>

          <input
            type="text"
            value={novaSolucao}
            onChange={(e) => setNovaSolucao(e.target.value)}
            placeholder="Adicionar nova solução"
          />
          <button onClick={() => adicionarSolucao(desafio.id)}>
            Adicionar Solução
          </button>
        </div>
      ))}
    </div>
  );
}

export default ExibirDesafiosFalso;
