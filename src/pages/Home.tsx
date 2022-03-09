import illustrationImg from "../assets/images/illustration.svg";
import logo from "../assets/images/logo.svg";
import googleIcon from "../assets/images/google-icon.svg";

import "../styles/auth.scss";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ChangeEvent, FormEvent, useState } from "react";
import { child, get, ref } from "firebase/database";
import { database } from "../services/firebase";

export default function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }
    navigate("/room/new");
  };

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const dbRef = ref(database);

    const snapshot = await get(child(dbRef, `rooms/${roomCode}`));

    if (!snapshot.exists()) {
      alert("Sala não existe!");
      return;
    }

    if (snapshot.val().endedAt) {
      alert("Esta sala já foi encerrada!");
      return;
    }

    navigate(`/room/${roomCode}`);
  };

  const handleRoomCode = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomCode(event.target.value);
  };

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e  respostas"
        />
        <strong>Crie salas de Q&A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real!</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="Logo LetMeAsk" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIcon} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={handleRoomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
