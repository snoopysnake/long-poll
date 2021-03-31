import { useEffect, useState } from "react";
import { getTimeRemaining, restart } from "../../service/quiz-service";
import './timer.css';

function Timer({ enable, disable, ended }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const restartTimer = async () => {
      try {
        if (await restart()) {
          disable(false);
          setTime(10500);
          enable();
        }
      } finally {
        await restartTimer();
      }
    }
    (async () => {
      const res = await getTimeRemaining();
      setTime(res.time);
      disable(!res.started);
      restartTimer();
    })();
  }, [enable, disable]);

  useEffect(() => {
    if (time && time - 100 <= 0) {
      disable(true);
      return;
    }
    const timer = setTimeout(() => setTime(time - 100), 100);
    return () => clearTimeout(timer);
  }, [time, disable]);

  return (
    <header className="timer">
      {
        !ended &&
        <strong>
          {time > 0 ? Math.floor(time / 1000) : time !== null ? 'Time\'s up!' : ''}
        </strong>
      }
      {
        ended && <strong>Scoring...</strong>
      }
    </header>
  );
}

export default Timer;