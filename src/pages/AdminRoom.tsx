import { useNavigate, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import Button from "../components/Button";
import Question from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import useAuth from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";
import deleteImg from "../assets/images/delete.svg";
import { ref, remove, update } from "firebase/database";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const { user } = useAuth();
  const params = useParams() as RoomParams;
  const { title, questions } = useRoom(params.id);
  const navigate = useNavigate();

  async function handleEndRoom() {
    const roomRef = ref(database, `rooms/${params.id}`);
    update(roomRef, {
      endedAt: new Date(),
    });

    navigate("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      const questionRef = ref(
        database,
        `rooms/${params.id}/questions/${questionId}`
      );
      await remove(questionRef);
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo LetMeAsk" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover Pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
