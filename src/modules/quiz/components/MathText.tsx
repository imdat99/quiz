import React from "react";
import { MathJax } from "better-react-mathjax";

interface MathTextProps {
  text: string;
  className?: string;
}

const MathText: React.FC<MathTextProps> = ({ text, className = "" }) => {
  return (
    <MathJax className={className} inline>
      {text}
    </MathJax>
  );
};

export default MathText;
