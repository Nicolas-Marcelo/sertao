import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [desafios, setDesafios] = useState([]);
  const [detalhesDesafio, setDetalhesDesafio] = useState(null);
  const [novaSolucao, setNovaSolucao] = useState('');

  useEffect(() => {
    const fetchDesafios = async () => {
      try {
        const response = await axios.get('http://localhost:8080/desafios');
        setDesafios(response.data);
      } catch (error) {
        console.error('Erro ao buscar desafios:', error);
      }
    };

    fetchDesafios();
  }, []);

  const handleExibirDetalhes = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/desafios/${id}`);
      setDetalhesDesafio(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do desafio:', error);
    }
  };

  const handleAdicionarSolucao = async (id) => {
    try {
      await axios.post(`http://localhost:8080/desafios/${id}/solucoes`, {
        solucao: novaSolucao,
      });
      alert('Solução adicionada com sucesso');
      setNovaSolucao('');
      handleExibirDetalhes(id); // Atualiza os detalhes após adicionar
    } catch (error) {
      console.error('Erro ao adicionar solução:', error);
      alert('Erro ao adicionar solução');
    }
  };

  return (
    <div>
      <strong>Lista de Desafios</strong>
      {desafios.map((desafio) => (
        <div key={desafio.id}>
          <h2>Nome: {desafio.desafio}</h2>
          <button onClick={() => handleExibirDetalhes(desafio.id)}>Exibir detalhes</button>
        </div>
      ))}

      {detalhesDesafio && (
        <div>
          <h2>Detalhes do Desafio</h2>
          <p>Descrição: {detalhesDesafio.descricao}</p>
          <p>Recompensa: {detalhesDesafio.recompensa}</p>
          <p>Data Limite: {detalhesDesafio.dataLimite ? new Date(detalhesDesafio.dataLimite).toLocaleDateString('pt-BR') : 'Sem data limite'}</p>
          <p>Autor: {detalhesDesafio.autorId}</p>
          <ul>
            <strong>Soluções:</strong>
            {detalhesDesafio.solucoes?.map((solucao, index) => (
              <li key={index}>{solucao}</li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Adicionar solução"
            value={novaSolucao}
            onChange={(e) => setNovaSolucao(e.target.value)}
          />
          <button onClick={() => handleAdicionarSolucao(detalhesDesafio.id)}>Salvar</button>
        </div>
      )}
    </div>
  );
}

export default Home;
