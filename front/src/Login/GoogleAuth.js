import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../Firebase/FirebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import Questionario from './Questionario';
import ExibirDesafiosFalso from '../DataManipulation/ExibirDesafiosFalso';

function GoogleAuth() {
  const [usuario, setUsuario] = useState(null);
  const [questionarioCompleto, setQuestionarioCompleto] = useState(false);

  const provedor = new GoogleAuthProvider();

  const Login = async () => {
    try {
      const logar = await signInWithPopup(auth, provedor);
      const usuario = logar.user;
      setUsuario(usuario);

      const usuarioRef = doc(db, 'usuarios', usuario.uid);
      const usuarioDoc = await getDoc(usuarioRef);

      if (usuarioDoc.exists() === false) {
        await setDoc(usuarioRef, { questionarioCompleto: false });
      } else {
        setQuestionarioCompleto(usuarioDoc.data().questionarioCompleto);
      }
    } catch (error) {
      console.error("A 3 passos de saber oque so os loucos sabem", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
      setQuestionarioCompleto(false);
    } catch (error) {
      console.error("Erro ao tirar a conta", error);
    }
  };

  const preencherQuestionario = async () => {
    if (usuario) {
      const usuarioRef = doc(db, 'usuarios', usuario.uid);
      await updateDoc(usuarioRef, { questionarioCompleto: true });
      setQuestionarioCompleto(true);
    }
  };

  useEffect(() => {
    const executarLogica = onAuthStateChanged(auth, async (currentUser) => {
      setUsuario(currentUser);

      if (currentUser) {
        const usuarioRef = doc(db, 'usuarios', currentUser.uid);
        const usuarioDoc = await getDoc(usuarioRef);

        if (usuarioDoc.exists()) {
          setQuestionarioCompleto(usuarioDoc.data().questionarioCompleto);
        }
      } else {
        setQuestionarioCompleto(false);
      }
    });

    return () => executarLogica();
  }, []);

  return (
    <div>
      <strong>ESTÁ PAGINA VAI MOSTRAR AS INFORMAÇÕES DO USUARIO</strong>
      {usuario ? (
        <div>
          <h2>Bem-vindo, {usuario.displayName}</h2>
          <img src={usuario.photoURL} alt="Foto do usuário" />
          <p>Email: {usuario.email}</p>
          <button onClick={logout}>Logout</button>
          {questionarioCompleto ? (
            <ExibirDesafiosFalso />
          ) : (
            <Questionario onComplete={preencherQuestionario} />
          )}
        </div>
      ) : (
        <button onClick={Login}>Login com Google</button>
      )}
    </div>
  );
}

export default GoogleAuth;
