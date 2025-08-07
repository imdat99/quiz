import React, { useEffect } from "react";
import MathText from "./MathText";
import type { FillInTheBlankQuestion } from "types/quiz";

interface FillInTheBlankQuestionProps {
  question: FillInTheBlankQuestion;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

const FillInTheBlankQuestion: React.FC<FillInTheBlankQuestionProps> = ({
  question,
  value,
  onChange,
}) => {
  const inputRef = React.useRef<HTMLDivElement>(null);
  // Parse the template to find blanks
  const parts: Array<
    { type: "text"; content: string } | { type: "blank"; id: string }
  > = [];
  const regex = /{{(blank\d+)}}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(question.question_template)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: question.question_template.substring(lastIndex, match.index),
      });
    }
    parts.push({ type: "blank", id: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < question.question_template.length) {
    parts.push({
      type: "text",
      content: question.question_template.substring(lastIndex),
    });
  }

  const handleBlankInput = (blankId: string, text: string) => {
    const currentValue = value || {};
    onChange({
      ...currentValue,
      [blankId]: text,
    });
  };

  return (
    <div className="question-text">
      {parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <MathText key={index} text={part.content} className="inline" />
          );
        } else if (part.type === "blank") {
          return (
            // <input
            //   key={part.id}
            //   type="text"
            //   className="blank-input"
            //   value={value?.[part.id] || ''}
            //   onChange={(e) => handleBlankInput(part.id, e.target.value)}
            //   placeholder="_____"
            // />
            <DivInput
              key={`${question.id}-${part.id}`}
              data-name={`${question.id}-${part.id}`}
              contentEditable
              suppressContentEditableWarning={true}
              ref={inputRef}
              className="blank-input"
              role="textbox"
              onChangeContent={(v) => handleBlankInput(part.id, v)}
              onBlur={(e) => {
                const textContent = e.target.textContent;
                const text = textContent ? textContent.trim() : "";
                e.target.textContent = text;
                handleBlankInput(part.id, text);
              }}
              value={value?.[part.id] || ""}
              data-placeholder="_____"
            />
          );
        }
        return null;
      })}
    </div>
  );
};

const DivInput: React.FC<
  React.HTMLProps<HTMLDivElement> & {
    value: string;
    onChangeContent: (value: string) => void;
  }
> = (props) => {
  const inputRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.textContent = props.value || "";
    }
  }, []);
  return (
    <div
      {...props}
      onInput={(e) =>
        props.onChangeContent((e.target as HTMLDivElement).textContent || "")
      }
      ref={inputRef}
    />
  );
};
export default FillInTheBlankQuestion;
