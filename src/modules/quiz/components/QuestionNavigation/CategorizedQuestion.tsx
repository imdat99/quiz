import React from "react";
import type { QuizQuestion } from "types/quiz";

interface CategorizedQuestionNavigationProps {
  questions: QuizQuestion[];
  currentQuestion: number;
  answeredQuestions: number[];
  onQuestionSelect: (index: number) => void;
}
const CategorizedQuestionNavigation: React.FC<
  CategorizedQuestionNavigationProps
> = ({
  questions,
  currentQuestion,
  answeredQuestions,
  onQuestionSelect,
}) => {
  // Group questions by category
  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, QuizQuestion[]>);

  return (
    <>
      {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => {
        const categoryAnsweredCount = categoryQuestions.filter((q) =>
          answeredQuestions.includes(q.id)
        ).length;
        const categoryTotalCount = categoryQuestions.length;

        return (
          <div key={category} className="mb-3">
            <div
              className={`category-header bg-gray-50 flex flex-col justify-between p-3 rounded-lg cursor-pointer `}
              
            >
                <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-medium text-gray-700">{category}</span>
              </div>
              <span className="text-sm text-gray-500">
                {categoryAnsweredCount}/{categoryTotalCount}
              </span>
                </div>
              
              <div>
              <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
                {categoryQuestions.map((question) => {
                  const globalIndex = questions.findIndex(
                    (q) => q.id === question.id
                  );
                  const isAnswered = answeredQuestions.includes(question.id);
                  const isCurrent = currentQuestion === globalIndex;

                  let bgColor = "bg-gray-200 text-gray-500";
                  if (isAnswered) bgColor = "bg-green-100 text-green-700";
                  if (isCurrent) bgColor = "bg-yellow-100 text-yellow-700";

                  return (
                    <button
                      key={question.id}
                      onClick={() => onQuestionSelect(globalIndex)}
                      className={`p-2 cursor-pointer rounded-lg font-medium transition-all duration-300 ease-in-out ${bgColor} hover:(opacity-90 -translate-y-1)`}
                    >
                      {globalIndex + 1}
                    </button>
                  );
                })}
              </div>
              
              </div>
            </div>

            
          </div>
        );
      })}
    </>
  );
};

export default CategorizedQuestionNavigation;
