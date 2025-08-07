import React from "react";

interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
}


const Timer: React.FC<TimerProps> = React.memo(({ timeLeft, onTimeUp }) => {
  // Calculate minutes and seconds only when timeLeft changes
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 180;

  React.useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-150 ${
        isWarning
          ? "bg-red-100 text-red-700 animate-pulse" // removed duplicate duration-150
          : "bg-blue-100 text-blue-700"
      }`}
      aria-label={`Time left: ${formattedTime}`}
    >
      <i className="fas fa-clock" aria-hidden="true"></i>
      <span className="font-mono font-semibold" data-testid="timer-value">
        {formattedTime}
      </span>
    </div>
  );
});

export default Timer;
