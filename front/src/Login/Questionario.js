import React, { useState } from "react";
import { auth, db } from '../Firebase/FirebaseConfig';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import Input from "../Components/Input";
import Label from "../Components/Label";

function Questionario() {
  const [tipoConta, setTipoConta] = useState('');
  const [nomeCompletoUsuario, setNomeCompletoUsuario] = useState('');
  const [CPFUsuario, setCPFUsuario] = useState('');
  const [dataNascimentoUsuario, setDataNascimentoUsuario] = useState('');
  const [conhecimentoUsuario, setConhecimentoUsuario] = useState('');
  const [experienciasUsuarioA, setExperienciasUsuarioA] = useState('');
  const [listaExperiencias, setListaExperiencias] = useState([]);
  const [listaConhecimentos, setListaConhecimentos] = useState([]);
  const [questionarioEnviado, setQuestionarioEnviado] = useState(false);

  const adicionarExperiencia = () => {
    if (experienciasUsuarioA.trim() !== '') {
      setListaExperiencias([...listaExperiencias, experienciasUsuarioA]);
      setExperienciasUsuarioA('');
    }
  };

  const adicionarConhecimento = () => {
    if (conhecimentoUsuario.trim() !== '') {
      setListaConhecimentos([...listaConhecimentos, conhecimentoUsuario]);
      setConhecimentoUsuario('');
    }
  };

  const corpoQuestionario = async () => {
    try {
      const usuario = auth.currentUser;
      const usuarioRef = doc(db, 'usuarios', usuario.uid);

      await setDoc(usuarioRef, {
        email: usuario.email,
        displayName: usuario.displayName,
        questionarioCompleto: true,
        nomeCompletoUsuario,
        CPFUsuario,
        dataNascimentoUsuario,
        tipoConta,
      });

      await updateDoc(usuarioRef, {
        experienciasUsuario: arrayUnion(...listaExperiencias),
        conhecimentoUsuario: arrayUnion(...listaConhecimentos),
      });

      setQuestionarioEnviado(true);

    } catch (error) {
      console.log("Erro ao enviar questionário:", error);
    }
  };

  return (
    <div>
      {!questionarioEnviado ? (
        <>
          <h1>Aba do Questionário</h1>
          <Label escrita="Tipo de Conta:" />
          <select value={tipoConta} onChange={(e) => setTipoConta(e.target.value)}>
            <option value=''>Selecione</option>
            <option value='cliente'>Cliente</option>
            <option value='vendedor'>Vendedor</option>
          </select>

          <Label escrita="Digite seu nome:" />
          <Input
            type="text"
            placeholder="Nome Completo"
            value={nomeCompletoUsuario}
            onChange={(e) => setNomeCompletoUsuario(e.target.value)}
          />

          <Label escrita="Digite seu CPF:" />
          <Input
            type="text"
            placeholder="Digite seu CPF"
            value={CPFUsuario}
            onChange={(e) => setCPFUsuario(e.target.value)}
          />

          <Label escrita="Qual é a sua data de nascimento:" />
          <Input
            type="date"
            value={dataNascimentoUsuario}
            onChange={(e) => setDataNascimentoUsuario(e.target.value)}
          />

          <Label escrita="Qual o seu nível de conhecimento?" />
          <Input
            type="text"
            placeholder="Nível de Conhecimento"
            value={conhecimentoUsuario}
            onChange={(e) => setConhecimentoUsuario(e.target.value)}
          />

          <Label escrita="Digite suas experiências:" />
          <Input
            type="text"
            placeholder="Experiência"
            value={experienciasUsuarioA}
            onChange={(e) => setExperienciasUsuarioA(e.target.value)}
          />
          <button onClick={adicionarExperiencia}>Adicionar Experiência</button>

          <Label escrita="Digite seus conhecimentos:" />
          <Input
            type="text"
            placeholder="Conhecimentos"
            value={conhecimentoUsuario}
            onChange={(e) => setConhecimentoUsuario(e.target.value)}
          />
          <button onClick={adicionarConhecimento}>Adicionar Conhecimento</button>

          <h3>Experiências Adicionadas:</h3>
          <ul>
            {listaExperiencias.map((exp, index) => (
              <li key={index}>{exp}</li>
            ))}
          </ul>

          <h3>Conhecimentos Adicionados:</h3>
          <ul>
            {listaConhecimentos.map((conhecimento, index) => (
              <li key={index}>{conhecimento}</li>
            ))}
          </ul>

          <button onClick={corpoQuestionario}>Enviar</button>
        </>
      ) : (
        <strong>Questionário enviado com sucesso!</strong>
      )}
    </div>
  );
}

export default Questionario;
