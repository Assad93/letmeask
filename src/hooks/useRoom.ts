import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import useAuth from "./useAuth";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);
    onValue(roomRef, (snapshot) => {
      const room = snapshot.val();
      const firebaseQuestions: FirebaseQuestions = room.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isAnswered: value.isAnswered,
            isHighlighted: value.isHighlighted,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );

      setTitle(room.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      off(roomRef);
    };
  }, [roomId, user?.id]);

  return { questions, title };
}
