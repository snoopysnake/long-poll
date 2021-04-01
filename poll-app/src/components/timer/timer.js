import { useEffect, useRef, useState, useCallback } from "react";
import { getTimeRemaining, restart } from "../../service/quiz-service";
import './timer.css';

function Timer({ enable, disable, ended }) {
  const [time, setTime] = useState(null);

  const ref = useRef();
  const prevRef = useRef();

  const countdown = useCallback(elapsed => {
    if (prevRef.current !== undefined) {
      const delta = elapsed - prevRef.current;
      if (time && time - delta <= 0) {
        disable(true);
        prevRef.current = undefined;
        cancelAnimationFrame(ref.current);
      }
      setTime(time - delta);
    }
    prevRef.current = elapsed;
    ref.current = requestAnimationFrame(countdown);
  }, [disable, time]);

  useEffect(() => {
    ref.current = requestAnimationFrame(countdown);
    return () => cancelAnimationFrame(ref.current);
  }, [countdown]);

  useEffect(() => {
    let unsubscribe;
    const restartTimer = async () => {
      if (unsubscribe)
        return;
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
    return () => unsubscribe = true;
  }, [enable, disable]);

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