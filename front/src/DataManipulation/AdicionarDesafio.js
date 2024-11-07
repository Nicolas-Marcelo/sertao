import React, { useState } from 'react';
import axios from 'axios';
import Input from '../Components/Input';
import { auth } from '../Firebase/FirebaseConfig';

function AdicionarDesafio() {
  const [desafio, setDesafio] = useState('');
  const [recompensa, setRecompensa] = useState('');
  const [dataLimite, setDataLimite] = useState('');
  const [descricao, setDescricao] = useState('');
  const [comunicacao, setComunicacao] = useState('');
  const [criterios, setCriterios] = useState('');
  const [listaCriterios, setListaCriterios] = useState([]);

  const adicionarCriterio = () => {
    if (criterios.trim() !== '') {
      setListaCriterios([...listaCriterios, criterios]);
      setCriterios('');
    }
  };

  const handleAdicionarDesafio = async () => {
    try {
      const autorId = auth.currentUser.uid; // Substitua pelo ID do usuário atual

      const novoDesafio = {
        desafio,
        recompensa,
        dataLimite,
        descricao,
        comunicacao,
        criterios: listaCriterios,
        autorId,
      };

      await axios.post('http://localhost:8080/apidesafios', novoDesafio);

      setDesafio('');
      setRecompensa('');
      setDataLimite('');
      setDescricao('');
      setComunicacao('');
      setListaCriterios([]);

      console.log('Desafio adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar desafio:', error);
    }
  };

  return (
    <div>
      <strong>ESTA PÁGINA DEVE DEIXAR O USUÁRIO ADICIONAR UM DESAFIO</strong>
      <Input
        type="text"
        value={desafio}
        onChange={(e) => setDesafio(e.target.value)}
        placeholder="Título do Desafio"
      />
      <Input
        type="text"
        value={recompensa}
        onChange={(e) => setRecompensa(e.target.value)}
        placeholder="Valor da recompensa"
      />
      <Input
        type="date"
        value={dataLimite}
        onChange={(e) => setDataLimite(e.target.value)}
        placeholder="Data limite do desafio"
      />
      <Input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição do Desafio"
      />
      <Input
        type="text"
        value={comunicacao}
        onChange={(e) => setComunicacao(e.target.value)}
        placeholder="Contato (telefone ou email)"
      />
      <Input
        type="text"
        value={criterios}
        onChange={(e) => setCriterios(e.target.value)}
        placeholder="Critérios para o desafio"
      />
      <button onClick={adicionarCriterio}>Adicionar Critério</button>

      <ul>
        {listaCriterios.map((criterio, index) => (
          <li key={index}>{criterio}</li>
        ))}
      </ul>

      <button onClick={handleAdicionarDesafio}>Salvar Desafio</button>
    </div>
  );
}

export default AdicionarDesafio;
