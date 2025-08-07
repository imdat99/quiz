import { List } from "lucide-react";
import React from "react";
import type { QuizQuestion } from "types/quiz";
import CategorizedQuestionNavigation from "./CategorizedQuestion";
import Timer from "../Timer";

interface QuestionNavigationProps {
  questions: QuizQuestion[];
  currentQuestion: number;
  answeredQuestions: number[];
  onQuestionSelect: (index: number) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  currentQuestion,
  answeredQuestions,
  onQuestionSelect,
}) => {
  return (
    <div className="bg-white flex flex-col rounded-xl p-4 mb-6 md:mb-0 h-full overflow-y-auto custom-scrollbar">
      <div className="flex-1">
<h3 className="font-semibold text-gray-700 mb-3 flex items-center">
        <List className="mr-2" /> Danh sách câu hỏi
      </h3>
      <CategorizedQuestionNavigation
        questions={questions}
        currentQuestion={currentQuestion}
        answeredQuestions={answeredQuestions}
        onQuestionSelect={onQuestionSelect}
      />
      
 
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {answeredQuestions.length} / {questions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answeredQuestions.length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
       <div className="flex items-center gap-3">
        <div className="mt-3 flex flex-wrap gap-2 justify-between w-full">

                <Timer timeLeft={100} onTimeUp={() => {}} />
        
                <button
                  // onClick={handleSubmit}
                  disabled={Object.keys(answeredQuestions).length === 0}
                  className={`px-6 py-2 w-full rounded-lg font-medium submit-button cursor-pointer ${
                    Object.keys(answeredQuestions).length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Quiz
                </button>
              </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Note: You can navigate through the questions using the list above. Click on a question to jump to it.
        </p>
      </div>
      {/* copyright */}
      <div className="mt-6 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Quiz App. All rights reserved.
      </div>
    </div>
  );
};

export default QuestionNavigation;
