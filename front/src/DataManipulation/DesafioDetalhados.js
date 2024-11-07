import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/FirebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';

const DetalhesDesafio = ({ desafioId }) => {
  const [desafio, setDesafio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesafio = async () => {
      try {
        const docRef = doc(db, 'desafios', desafioId); 
        const docSnap = await getDoc(docRef); 
        
        if (docSnap.exists()) {
          setDesafio(docSnap.data()); 
        } else {
          setError('Desafio não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar detalhes do desafio: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDesafio();
  }, [desafioId]);

  if (loading) return <div>Carregando detalhes do desafio...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <strong> ESTA PÁGINA DEVE MOSTRAR PARA O USUARIO OS DETALHES DO DESAFIO QUE ELE CLICOU E AQUI DEVE TER A OPÇÃO DE ADICIONAR SOLUÇÃO</strong>
      <h1>Detalhes do Desafio</h1>
      
      {desafio ? (
        <>
          <h2>Título: {desafio.desafio || 'Título não disponível'}</h2>
          <p><strong>Recompensa:</strong> {desafio.recompensa || 'Não especificado'}</p>
          <p><strong>Data Limite:</strong> {desafio.dataLimite ? new Date(desafio.dataLimite.seconds * 1000).toLocaleDateString() : 'Data não disponível'}</p>
          <p><strong>Descrição:</strong> {desafio.descricao || 'Descrição não disponível'}</p>
          <p><strong>Comunicação:</strong> {desafio.comunicacao || 'Comunicação não disponível'}</p>
          
          <h3>Critérios:</h3>
          <ul>
            {(desafio.criterios || []).map((criterio, index) => (
              <li key={index}>{criterio}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Os detalhes do desafio não estão disponíveis.</p>
      )}
    </div>
  );
};

export default DetalhesDesafio;
