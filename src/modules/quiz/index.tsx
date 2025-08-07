/* eslint-disable @typescript-eslint/no-explicit-any */
import { MathJaxContext } from "better-react-mathjax";
import { useEffect, useRef, useState } from "react";
import Timer from "./components/Timer";
import QuestionNavigation from "./components/QuestionNavigation";
import MathText from "./components/MathText";
import MultipleChoiceQuestion from "./components/MultipleChoiceQuestion";
import ShortAnswerQuestion from "./components/ShortAnswerQuestion";
import TrueFalseQuestion from "./components/TrueFalseQuestion";
import FillInTheBlankQuestion from "./components/FillInTheBlankQuestion";
import type { QuizData, QuizQuestion } from "types/quiz";

interface QuizProps {
  quizData: QuizData;
}
const Quiz: React.FC<QuizProps> = ({ quizData }) => {
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(quizData!.timeLimit);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const questionContentRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  // Calculate answered questions
  useEffect(() => {
    if (quizData.title) { 
        contentRef.current?.style.setProperty(
            "max-height",
            `calc(100vh - ${headRef.current?.offsetHeight || 0}px - ${
              footerRef.current?.offsetHeight || 0}px - 6rem)`
        )
    }
  }, [quizData.title]);
  const answeredQuestions = Object.keys(answers)
    .filter((key) => {
      const answer = answers[Number(key)];
      if (typeof answer === "object" && answer !== null) {
        // For fill-in-the-blank, check if at least one blank is filled
        return Object.values(answer).some(
          (val) => typeof val === "string" && val.trim() !== ""
        );
      }
      return answer !== undefined && answer !== "";
    })
    .map(Number);

  //   useEffect(() => {
  //     if (!isSubmitted && timeLeft > 0) {
  //       const timer = setInterval(() => {
  //         setTimeLeft((prev) => prev - 1);
  //       }, 1000);
  //       return () => clearInterval(timer);
  //     }
  //   }, [isSubmitted, timeLeft]);

  // Render MathJax when question changes

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    calculateScore();
  };

  const calculateScore = () => {
    if (!quizData) return;
    let correctCount = 0;
    quizData.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (question.type === "multiple-choice" && question.multiple) {
        if (
          Array.isArray(userAnswer) &&
          Array.isArray(question.correctAnswers) &&
          question.correctAnswers.every((ans) => userAnswer.includes(ans)) &&
          userAnswer.length === question.correctAnswers.length
        ) {
          correctCount++;
        }
      } else if (
        question.type === "multiple-choice" ||
        question.type === "audio" ||
        question.type === "video"
      ) {
        if (userAnswer === (question as any).correctAnswer) correctCount++;
      } else if (question.type === "short-answer") {
        if (
          typeof userAnswer === "string" &&
          userAnswer.toLowerCase().trim() ===
            question.correctAnswer.toLowerCase()
        )
          correctCount++;
      } else if (question.type === "true-false") {
        if (userAnswer === question.correctAnswer.toString()) correctCount++;
      } else if (question.type === "fill-in-the-blank") {
        const correctAnswers = question.correctAnswers;
        const userAnswers = userAnswer || {};
        const allBlanksCorrect = question.blanks.every((blankId) => {
          const userValue = (userAnswers[blankId] || "").toLowerCase().trim();
          const correctValue = (correctAnswers[blankId] || "")
            .toLowerCase()
            .trim();
          return userValue === correctValue;
        });
        if (allBlanksCorrect) correctCount++;
      }
    });
    setScore(correctCount);
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(quizData ? quizData.timeLimit : 0);
    setIsSubmitted(false);
    setScore(0);
  };

  const getQuestionComponent = (question: QuizQuestion) => {
    const value = answers[question.id];
    const commonProps = {
      value,
      onChange: (answer: any) => handleAnswerChange(question.id, answer),
    };
    switch (question.type) {
      case "multiple-choice":
        return (
          <MultipleChoiceQuestion
            question={question}
            multiple={question.multiple}
            {...commonProps}
          />
        );
      case "short-answer":
        return <ShortAnswerQuestion {...commonProps} />;
      case "true-false":
        return <TrueFalseQuestion {...commonProps} />;
      case "audio":
        return <AudioQuestion question={question} {...commonProps} />;
      case "video":
        return <VideoQuestion question={question} {...commonProps} />;
      case "fill-in-the-blank":
        return <FillInTheBlankQuestion question={question} {...commonProps} />;
      default:
        return null;
    }
  };

  const getAnswerStatus = (question: QuizQuestion) => {
    if (!isSubmitted) return null;
    const userAnswer = answers[question.id];
    if (question.type === "multiple-choice" && question.multiple) {
      if (
        Array.isArray(userAnswer) &&
        Array.isArray(question.correctAnswers) &&
        question.correctAnswers.every((ans) => userAnswer.includes(ans)) &&
        userAnswer.length === question.correctAnswers.length
      ) {
        return "correct";
      }
      return "incorrect";
    } else if (
      question.type === "multiple-choice" ||
      question.type === "audio" ||
      question.type === "video"
    ) {
      return userAnswer === (question as any).correctAnswer
        ? "correct"
        : "incorrect";
    } else if (question.type === "short-answer") {
      return typeof userAnswer === "string" &&
        userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase()
        ? "correct"
        : "incorrect";
    } else if (question.type === "true-false") {
      return userAnswer === question.correctAnswer.toString()
        ? "correct"
        : "incorrect";
    } else if (question.type === "fill-in-the-blank") {
      const correctAnswers = question.correctAnswers;
      const userAnswers = userAnswer || {};
      const allBlanksCorrect = question.blanks.every((blankId) => {
        const userValue = (userAnswers[blankId] || "").toLowerCase().trim();
        const correctValue = (correctAnswers[blankId] || "")
          .toLowerCase()
          .trim();
        return userValue === correctValue;
      });
      return allBlanksCorrect ? "correct" : "incorrect";
    }
    return null;
  };

  const renderUserAnswer = (question: QuizQuestion) => {
    const userAnswer = answers[question.id];
    if (question.type === "fill-in-the-blank") {
      const userAnswers = userAnswer || {};
      return question.blanks
        .map((blankId) => userAnswers[blankId] || "Not answered")
        .join(", ");
    }
    return userAnswer || "Not answered";
  };

  const renderCorrectAnswer = (question: QuizQuestion) => {
    if (question.type === "fill-in-the-blank") {
      return question.blanks
        .map((blankId) => question.correctAnswers[blankId])
        .join(", ");
    }
    // @ts-expect-error: correctAnswer/correctAnswers are not on all types
    return question.correctAnswer || question.correctAnswers?.join(", ");
  };

  if (isSubmitted && quizData) {
    const percentage = Math.round((score / quizData.questions.length) * 100);
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Quiz Results
            </h1>
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
              <span className="text-4xl font-bold">{percentage}%</span>
            </div>
            <p className="text-xl text-gray-600">
              You scored {score} out of {quizData.questions.length} questions
              correctly
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {quizData.questions.map((question, index) => {
              const status = getAnswerStatus(question);
              let questionText = "";
              if ("question" in question) questionText = question.question;
              else if ("question_template" in question)
                questionText = question.question_template;
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 ${
                    status === "correct"
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        status === "correct"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {status === "correct" ? (
                        <i className="fas fa-check"></i>
                      ) : (
                        <i className="fas fa-times"></i>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">
                        Q{index + 1}. <MathText text={questionText} />
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: {renderUserAnswer(question)}
                      </p>
                      {status === "incorrect" && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer:{" "}
                          <MathText text={renderCorrectAnswer(question)} />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <i className="fas fa-redo mr-2"></i>
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData) return null;
  const currentQ = quizData.questions[currentQuestion];

  return (
    <div className="max-w-screen-2xl mx-auto p-4 md:p-6 h-screen flex flex-col max-h-screen">
      {/* Header */}

      <div className="flex flex-col md:flex-row gap-6 flex-1">
        {/* Main Content */}
        <div className="md:w-3/4 h-full flex flex-col overflow-hidden">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6" ref={headRef}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {quizData.title}
                </h1>
                <p className="text-gray-600 mt-1">{quizData.description}</p>
              </div>
            </div>
          </div>
          <div className="flex-1" >
            <div className="overflow-y-auto custom-scrollbar" ref={contentRef}>
 <MathJaxContext>
              <div
                ref={questionContentRef}
                className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 ease-in-out animate-fade-in"
              >
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
                    Question {currentQuestion + 1} of{" "}
                    {quizData.questions.length}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    <MathText text={currentQ.question} />
                  </h2>
                  {currentQ.type === "multiple-choice" && currentQ.multiple && (
                    <p className="text-sm text-gray-500 mt-2">
                      <i className="fas fa-info-circle mr-1"></i>
                      Select all that apply
                    </p>
                  )}
                </div>
                {currentQ.mediaUrl && currentQ.mediaType && (
                  <div className="media-container">
                    <div className="flex items-center gap-3 mb-3">
                      <i className="fas fa-play-circle text-red-600 text-xl"></i>
                      <span className="font-medium text-gray-700">Player</span>
                    </div>
                    {currentQ.mediaType === "audio" ? (
                      <audio
                        controls
                        className="audio-player"
                        src={currentQ.mediaUrl}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    ) : currentQ.mediaType === "video" ? (
                      <div className="video-container">
                        <iframe
                          src={currentQ.mediaUrl}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Video player"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="image-container">
                        <img src={currentQ.mediaUrl} alt="Question diagram" />
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-6">{getQuestionComponent(currentQ)}</div>

                {/* Navigation Buttons */}
              </div>
            </MathJaxContext>
            </div>
           
          </div>

          <div className="flex justify-between items-center" ref={footerRef}>
            <button
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                currentQuestion === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Previous
            </button>

            <button
              onClick={() => {
                if (currentQuestion < quizData.questions.length - 1) {
                  setCurrentQuestion((prev) => prev + 1);
                  questionContentRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }}
              disabled={currentQuestion === quizData.questions.length - 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                currentQuestion === quizData.questions.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
        {/* Sidebar - Question Navigation */}
        <div className="md:w-1/4">
         
          <QuestionNavigation
            questions={quizData.questions}
            currentQuestion={currentQuestion}
            answeredQuestions={answeredQuestions}
            onQuestionSelect={(index) => {
              setCurrentQuestion(index);
              questionContentRef.current?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;
