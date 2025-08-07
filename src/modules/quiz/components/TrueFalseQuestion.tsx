import React from "react";

interface TrueFalseQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ value, onChange }) => {
  return (
    <div className="flex gap-4">
      {["True", "False"].map((option) => (
        <label key={option} className="flex-1">
          <input
            type="radio"
            name="true-false"
            value={option.toLowerCase()}
            checked={value === option.toLowerCase()}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only peer"
          />
          <div className="p-4 text-center border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300 transition-all">
            <span className="font-medium text-gray-700">{option}</span>
          </div>
        </label>
      ))}
    </div>
  );
};

export default TrueFalseQuestion;
