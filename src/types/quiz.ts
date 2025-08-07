type BaseQuestion = {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  type: string; // "multiple-choice", "short-answer", "true-false", "audio", "video", or "fill-in-the-blank"
  mediaType?: "image" | "audio" | "video"; // optional for questions that may have images
  mediaUrl?: string; // optional for audio/video questions
  question: string;
}
export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple-choice";
  options: string[];
  multiple: boolean;
};

export type ShortAnswerQuestion = BaseQuestion & {
  type: "short-answer";
  imageUrl?: string;
};


export type FillInTheBlankQuestion = BaseQuestion & {
  type: "fill-in-the-blank";
  question_template: string;
  blanks: string[];
};

export type QuizQuestion =
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | FillInTheBlankQuestion;

export type QuizData = {
  title: string;
  description: string;
  timeLimit: number;
  questions: QuizQuestion[];
};
