/* eslint-disable @typescript-eslint/no-explicit-any */
import { MathJaxContext } from "better-react-mathjax";
import Quiz from "modules/quiz";
import { useEffect, useState } from "react";
import type { QuizData } from "./types/quiz";

const App = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    fetch('/assets/quiz.json')
      .then(response => response.json())
      .then((data) => setQuizData(data))
      .finally(() => setLoading(false));
  }, []);

        // Main Quiz Component

        return loading ? <div>Loading...</div> : quizData ? <MathJaxContext><Quiz quizData={quizData} /></MathJaxContext> : null;
};

export default App;
