import React from "react";
import MathText from "./MathText";
import type { MultipleChoiceQuestion as MultipleChoiceQuestionType } from "../../../types/quiz";

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionType;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple: boolean;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  value,
  onChange,
  multiple,
}) => {
  return (
    <div className="space-y-3">
      
      
      {question.options.map((option, index) => (
        <label
          key={index}
          className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
        >
          <input
            type={multiple ? "checkbox" : "radio"}
            name={`question-${question.id}`}
            value={option}
            checked={multiple ? (value || []).includes(option) : value === option}
            onChange={(e) => {
              if (multiple) {
                const currentValues = (value as string[]) || [];
                if (e.target.checked) {
                  onChange([...currentValues, option]);
                } else {
                  onChange(currentValues.filter((v) => v !== option));
                }
              } else {
                onChange(option);
              }
            }}
            className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500"
          />
          <MathText text={option} className="text-gray-700" />
        </label>
      ))}
    </div>
  );
};

export default MultipleChoiceQuestion;
