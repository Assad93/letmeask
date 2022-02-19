import illustrationImg from "../assets/images/illustration.svg";
import logo from "../assets/images/logo.svg";
import googleIcon from "../assets/images/google-icon.svg";

import "../styles/auth.scss";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function NewRoom() {
  const { user } = useAuth();

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
          <form action="">
            <input type="text" placeholder="Nome da sala" />
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
