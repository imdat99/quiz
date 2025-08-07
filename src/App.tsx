/* eslint-disable @typescript-eslint/no-explicit-any */
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useEffect, useRef, useState } from "react";

const App = () => {
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    fetch('/assets/quiz.json')
      .then(response => response.json())
      .then(setQuizData)
      .finally(() => setLoading(false))
  }, []);
  // Timer component
        const Timer = ({ timeLeft, onTimeUp }) => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const isWarning = timeLeft <= 180; // Warning when 3 minutes or less

            useEffect(() => {
                if (timeLeft === 0) {
                    onTimeUp();
                }
            }, [timeLeft, onTimeUp]);

            return (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isWarning ? 'bg-red-100 text-red-700 animate-pulse duration-150' : 'bg-blue-100 text-blue-700'
                }`}>
                    <i className="fas fa-clock"></i>
                    <span className="font-mono font-semibold">
                        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </span>
                </div>
            );
        };

        // Question Navigation Component
        const QuestionNavigation = ({ 
            questions, 
            currentQuestion, 
            answeredQuestions, 
            onQuestionSelect
        }) => {
            return (
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6 md:mb-0 md:h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <i className="fas fa-list-ol mr-2"></i> Questions
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {questions.map((question, index) => {
                            const isAnswered = answeredQuestions.includes(question.id);
                            const isCurrent = currentQuestion === index;
                            
                            let bgColor = 'bg-gray-100 text-gray-500'; // Unanswered
                            if (isAnswered) bgColor = 'bg-green-100 text-green-700'; // Answered
                            if (isCurrent) bgColor = 'bg-yellow-100 text-yellow-700'; // Current
                            
                            return (
                                <button
                                    key={question.id}
                                    onClick={() => onQuestionSelect(index)}
                                    className={`p-3 cursor-pointer rounded-lg font-medium transition-all duration-300 ease-in-out ${bgColor} hover:(opacity-90 -translate-y-1)`}
                                >
                                    Q{index + 1}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <div className="w-4 h-4 rounded bg-gray-100"></div>
                            <span>Unanswered</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <div className="w-4 h-4 rounded bg-green-100"></div>
                            <span>Answered</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-4 h-4 rounded bg-yellow-100"></div>
                            <span>Current</span>
                        </div>
                    </div>
                </div>
            );
        };

        // MathText component for rendering LaTeX
        const MathText = ({ text, className = "" }) => {
            return (
              <MathJax className={className} inline>
{text}
          
                    </MathJax>
            );
        };

        // Question Components
        const MultipleChoiceQuestion = ({ question, value, onChange, multiple }) => {
            return (
                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <label key={index} className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all">
                            <input
                                type={multiple ? "checkbox" : "radio"}
                                name={`question-${question.id}`}
                                value={option}
                                checked={multiple ? (value || []).includes(option) : value === option}
                                onChange={(e) => {
                                    if (multiple) {
                                        const currentValues = value || [];
                                        if (e.target.checked) {
                                            onChange([...currentValues, option]);
                                        } else {
                                            onChange(currentValues.filter(v => v !== option));
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

        const ShortAnswerQuestion = ({ value, onChange }) => {
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

        const TrueFalseQuestion = ({ value, onChange }) => {
            return (
                <div className="flex gap-4">
                    {['True', 'False'].map((option) => (
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

        const AudioQuestion = ({ question, value, onChange }) => {
            return (
                <div className="space-y-4">
                    <div className="media-container">
                        <div className="flex items-center gap-3 mb-3">
                            <i className="fas fa-headphones text-blue-600 text-xl"></i>
                            <span className="font-medium text-gray-700">Audio Player</span>
                        </div>
                        <audio 
                            controls 
                            className="audio-player"
                            src={question.mediaUrl}
                        >
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <label key={index} className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all">
                                <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={option}
                                    checked={value === option}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        };

        const VideoQuestion = ({ question, value, onChange }) => {
            return (
                <div className="space-y-4">
                    <div className="media-container">
                        <div className="flex items-center gap-3 mb-3">
                            <i className="fas fa-play-circle text-red-600 text-xl"></i>
                            <span className="font-medium text-gray-700">Video Player</span>
                        </div>
                        <div className="video-container">
                            <iframe
                                src={question.mediaUrl}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Video player"
                            ></iframe>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <label key={index} className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all">
                                <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={option}
                                    checked={value === option}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        };

        const FillInTheBlankQuestion = ({ question, value, onChange }) => {
            // Parse the template to find blanks
            const parts = [];
            const regex = /{{(blank\d+)}}/g;
            let lastIndex = 0;
            let match;
            
            while ((match = regex.exec(question.question_template)) !== null) {
                // Add text before the blank
                if (match.index > lastIndex) {
                    parts.push({
                        type: 'text',
                        content: question.question_template.substring(lastIndex, match.index)
                    });
                }
                // Add the blank
                parts.push({
                    type: 'blank',
                    id: match[1]
                });
                lastIndex = match.index + match[0].length;
            }
            
            // Add remaining text
            if (lastIndex < question.question_template.length) {
                parts.push({
                    type: 'text',
                    content: question.question_template.substring(lastIndex)
                });
            }

            const handleBlankInput = (blankId, text) => {
                const currentValue = value || {};
                onChange({
                    ...currentValue,
                    [blankId]: text
                });
            };

            return (
                <div className="question-text">
                    {parts.map((part, index) => {
                        if (part.type === 'text') {
                            return (
                                <MathText 
                                    key={index} 
                                    text={part.content} 
                                    className="inline"
                                />
                            );
                        } else if (part.type === 'blank') {
                            return (
                                <div
                                    key={part.id}
                                    contentEditable
                                    suppressContentEditableWarning={true}
                                    className="blank-input"
                                    onInput={(e) => handleBlankInput(part.id, e.target.textContent)}
                                    onBlur={(e) => {
                                        // Clean up the content
                                        const text = e.target.textContent.trim();
                                        e.target.textContent = text;
                                        handleBlankInput(part.id, text);
                                    }}
                                    data-placeholder="_____"
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            );
        };

        // Main Quiz Component
        const Quiz = () => {
            const [answers, setAnswers] = useState({});
            const [currentQuestion, setCurrentQuestion] = useState(0);
            const [timeLeft, setTimeLeft] = useState(quizData.timeLimit);
            const [isSubmitted, setIsSubmitted] = useState(false);
            const [score, setScore] = useState(0);
            const questionContentRef = useRef(null);

            // Calculate answered questions
            const answeredQuestions = Object.keys(answers)
                .filter(key => {
                    const answer = answers[key];
                    if (typeof answer === 'object' && answer !== null) {
                        // For fill-in-the-blank, check if at least one blank is filled
                        return Object.values(answer).some(val => val && val.trim() !== '');
                    }
                    return answer !== undefined && answer !== '';
                })
                .map(Number);

            useEffect(() => {
                if (!isSubmitted && timeLeft > 0) {
                    const timer = setInterval(() => {
                        setTimeLeft(prev => prev - 1);
                    }, 1000);
                    return () => clearInterval(timer);
                }
            }, [isSubmitted, timeLeft]);

            // Render MathJax when question changes

            const handleAnswerChange = (questionId, answer) => {
                setAnswers(prev => ({
                    ...prev,
                    [questionId]: answer
                }));
            };

            const handleSubmit = () => {
                setIsSubmitted(true);
                calculateScore();
            };

            const calculateScore = () => {
                let correctCount = 0;
                quizData.questions.forEach(question => {
                    const userAnswer = answers[question.id];
                    
                    if (question.type === 'multiple-choice' && question.multiple) {
                        const correct = question.correctAnswers.every(ans => userAnswer?.includes(ans)) && 
                                      userAnswer?.length === question.correctAnswers.length;
                        if (correct) correctCount++;
                    } else if (question.type === 'multiple-choice' || question.type === 'audio' || question.type === 'video') {
                        if (userAnswer === question.correctAnswer) correctCount++;
                    } else if (question.type === 'short-answer') {
                        if (userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase()) correctCount++;
                    } else if (question.type === 'true-false') {
                        if (userAnswer === question.correctAnswer.toString()) correctCount++;
                    } else if (question.type === 'fill-in-the-blank') {
                        const correctAnswers = question.correctAnswers;
                        const userAnswers = userAnswer || {};
                        const allBlanksCorrect = question.blanks.every(blankId => {
                            const userValue = userAnswers[blankId]?.toLowerCase().trim();
                            const correctValue = correctAnswers[blankId]?.toLowerCase().trim();
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
                setTimeLeft(quizData.timeLimit);
                setIsSubmitted(false);
                setScore(0);
            };

            const getQuestionComponent = (question) => {
                const value = answers[question.id];
                const commonProps = {
                    value,
                    onChange: (answer) => handleAnswerChange(question.id, answer)
                };

                switch (question.type) {
                    case 'multiple-choice':
                        return (
                            <MultipleChoiceQuestion
                                question={question}
                                multiple={question.multiple}
                                {...commonProps}
                            />
                        );
                    case 'short-answer':
                        return <ShortAnswerQuestion {...commonProps} />;
                    case 'true-false':
                        return <TrueFalseQuestion {...commonProps} />;
                    case 'audio':
                        return <AudioQuestion question={question} {...commonProps} />;
                    case 'video':
                        return <VideoQuestion question={question} {...commonProps} />;
                    case 'fill-in-the-blank':
                        return <FillInTheBlankQuestion question={question} {...commonProps} />;
                    default:
                        return null;
                }
            };

            const getAnswerStatus = (question) => {
                if (!isSubmitted) return null;
                const userAnswer = answers[question.id];
                
                if (question.type === 'multiple-choice' && question.multiple) {
                    const correct = question.correctAnswers.every(ans => userAnswer?.includes(ans)) && 
                                  userAnswer?.length === question.correctAnswers.length;
                    return correct ? 'correct' : 'incorrect';
                } else if (question.type === 'multiple-choice' || question.type === 'audio' || question.type === 'video') {
                    return userAnswer === question.correctAnswer ? 'correct' : 'incorrect';
                } else if (question.type === 'short-answer') {
                    return userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase() ? 'correct' : 'incorrect';
                } else if (question.type === 'true-false') {
                    return userAnswer === question.correctAnswer.toString() ? 'correct' : 'incorrect';
                } else if (question.type === 'fill-in-the-blank') {
                    const correctAnswers = question.correctAnswers;
                    const userAnswers = userAnswer || {};
                    const allBlanksCorrect = question.blanks.every(blankId => {
                        const userValue = userAnswers[blankId]?.toLowerCase().trim();
                        const correctValue = correctAnswers[blankId]?.toLowerCase().trim();
                        return userValue === correctValue;
                    });
                    return allBlanksCorrect ? 'correct' : 'incorrect';
                }
            };

            const renderUserAnswer = (question) => {
                const userAnswer = answers[question.id];
                
                if (question.type === 'fill-in-the-blank') {
                    const userAnswers = userAnswer || {};
                    return question.blanks.map(blankId => 
                        userAnswers[blankId] || 'Not answered'
                    ).join(', ');
                }
                
                return userAnswer || 'Not answered';
            };

            const renderCorrectAnswer = (question) => {
                if (question.type === 'fill-in-the-blank') {
                    return question.blanks.map(blankId => 
                        question.correctAnswers[blankId]
                    ).join(', ');
                }
                return question.correctAnswer || question.correctAnswers?.join(', ');
            };

            if (isSubmitted) {
                const percentage = Math.round((score / quizData.questions.length) * 100);
                return (
                    <div className="max-w-4xl mx-auto p-6">
                        <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
                                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
                                    <span className="text-4xl font-bold">{percentage}%</span>
                                </div>
                                <p className="text-xl text-gray-600">
                                    You scored {score} out of {quizData.questions.length} questions correctly
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {quizData.questions.map((question, index) => {
                                    const status = getAnswerStatus(question);
                                    return (
                                        <div key={question.id} className={`p-4 rounded-lg border-2 ${
                                            status === 'correct' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                        }`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                    status === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                                }`}>
                                                    {status === 'correct' ? (
                                                        <i className="fas fa-check"></i>
                                                    ) : (
                                                        <i className="fas fa-times"></i>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 mb-2">
                                                        Q{index + 1}. <MathText text={question.question || question.question_template} />
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Your answer: {renderUserAnswer(question)}
                                                    </p>
                                                    {status === 'incorrect' && (
                                                        <p className="text-sm text-green-600 mt-1">
                                                            Correct answer: <MathText text={renderCorrectAnswer(question)} />
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

            const currentQ = quizData.questions[currentQuestion];

            return (
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{quizData.title}</h1>
                                <p className="text-gray-600 mt-1">{quizData.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Timer timeLeft={timeLeft} onTimeUp={handleTimeUp} />
                                <button
                                    onClick={handleSubmit}
                                    disabled={Object.keys(answers).length === 0}
                                    className={`px-6 py-2 rounded-lg font-medium submit-button ${
                                        Object.keys(answers).length === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                    <i className="fas fa-paper-plane mr-2"></i>
                                    Submit Quiz
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar - Question Navigation */}
                        <div className="md:w-1/4">
                            <QuestionNavigation 
                                questions={quizData.questions}
                                currentQuestion={currentQuestion}
                                answeredQuestions={answeredQuestions}
                                onQuestionSelect={(index) => {
                                    setCurrentQuestion(index);
                                    questionContentRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="md:w-3/4">
                            <div ref={questionContentRef} className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 ease-in-out animate-fade-in">
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
                                        Question {currentQuestion + 1} of {quizData.questions.length}
                                    </span>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        <MathText text={currentQ.question || currentQ.question_template} />
                                    </h2>
                                    {currentQ.type === 'multiple-choice' && currentQ.multiple && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            <i className="fas fa-info-circle mr-1"></i>
                                            Select all that apply
                                        </p>
                                    )}
                                </div>

                                {/* Image display if present */}
                                {currentQ.imageUrl && (
                                    <div className="image-container">
                                        <img 
                                            src={currentQ.imageUrl} 
                                            alt="Question diagram" 
                                        />
                                    </div>
                                )}

                                <div className="mb-6">
                                    {getQuestionComponent(currentQ)}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestion === 0}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            currentQuestion === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        <i className="fas fa-arrow-left mr-2"></i>
                                        Previous
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (currentQuestion < quizData.questions.length - 1) {
                                                setCurrentQuestion(prev => prev + 1);
                                                questionContentRef.current?.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                        disabled={currentQuestion === quizData.questions.length - 1}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            currentQuestion === quizData.questions.length - 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        Next
                                        <i className="fas fa-arrow-right ml-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        return loading ? <div>Loading...</div> : <MathJaxContext><Quiz /></MathJaxContext>;
};

export default App;
