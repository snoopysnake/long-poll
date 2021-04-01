import { useEffect, useState, useCallback, useRef } from 'react';
import { active, checkIfJoined } from './service/quiz-service';
import Setup from './components/setup/setup';
import Timer from './components/timer/timer';
import Question from './components/question/question';
import Guests from './components/guests/guests';
import './app.css';

function App() {
  const [submitted, setSubmitted] = useState(0);
  const [isReady, setReady] = useState(null);
  const [ended, setEnd] = useState(null);

  const ref = useRef();

  useEffect(() => {
    (async () => {
      const res = await checkIfJoined(
        sessionStorage.getItem('name'),
        sessionStorage.getItem('id')
      );
      setReady(!!res.status);
      setSubmitted(+res.submitted);
    })();
    return () => clearInterval(ref.current);
  }, []);

  useEffect(() => {
    if (isReady)
      idle();
    else clearInterval(ref.current);
  }, [isReady]);

  const idle = () => {
    ref.current = setInterval(async () => {
      const res = await active(
        sessionStorage.getItem('name'),
        sessionStorage.getItem('id')
      );
      if (!res.active) {
        clearInterval(ref.current);
        setReady(false);
      }
    }, 10000);
  }

  const ready = () => {
    setReady(true);
  }

  const enable = useCallback((status) => {
    setSubmitted(0);
  }, []);

  const disable = useCallback((status) => {
    setEnd(status);
  }, []);

  return (
    <div className="app">
      { isReady === false &&
        <div className="quiz-setup">
          <Setup ready={ready} />
        </div>
      }
      { isReady === true &&
        <div className="quiz">
          <Timer disable={disable} enable={enable} ended={ended} />
          <Question submitted={submitted} ended={ended} />
          <Guests />
        </div>
      }
    </div>
  );
}

export default App;
