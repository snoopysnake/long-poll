import { useEffect, useState } from "react";
import { getTimeRemaining } from "../../service/quiz-service";
import './timer.css';

function Timer(props) {
  const { disable } = props;

  const [time, setTime] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getTimeRemaining();
      setTime(res.time);
    })();
  }, []);

  useEffect(() => {
    if (time && time - 100 <= 0) {
      disable();
      return;
    }
    const timer = setTimeout(() => setTime(time - 100), 100);
    return () => clearTimeout(timer);
  }, [time, disable]);

  return (
    <header className="timer">
      <strong>
        {time > 0 ? Math.floor(time / 1000) : time !== null ? 'Time\'s up!' : ''}
      </strong>
    </header>
  );
}

export default Timer;