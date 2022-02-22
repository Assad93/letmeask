import illustrationImg from "../assets/images/illustration.svg";
import logo from "../assets/images/logo.svg";
import "../styles/auth.scss";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ChangeEvent, FormEvent, useState } from "react";
import { database } from "../services/firebase";
import { push, ref, set } from "firebase/database";

export default function NewRoom() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomName, setRoomName] = useState("");

  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomName.trim() === "") {
      return;
    }

    const roomRef = ref(database, "rooms");
    const newRoomRef = push(roomRef);
    await set(newRoomRef, {
      title: roomName,
      authorId: user?.id,
    });

    navigate(`/room/${newRoomRef.key}`);
  };

  const handleRoomName = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e  respostas"
        />
        <strong>Crie salas de Q&A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="Logo LetMeAsk" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={roomName}
              onChange={handleRoomName}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to={"/"}>clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
