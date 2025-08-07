import React from "react";

interface ShortAnswerQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer here..."
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    />
  );
};

export default ShortAnswerQuestion;
