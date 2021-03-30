import { useEffect, useState, useCallback } from 'react';
import { checkIfJoined } from './service/quiz-service';
import Setup from './components/setup/setup';
import Timer from './components/timer/timer';
import Question from './components/question/question';
import Guests from './components/guests/guests';
import './app.css';

function App() {
  const [isReady, setReady] = useState(null);
  const [ended, setEnd] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await checkIfJoined(
        sessionStorage.getItem('name'),
        sessionStorage.getItem('id')
      );
      setReady(!!res.status);
    })();
  }, []);

  const ready = () => {
    setReady(true);
  }

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
          <Timer disable={disable} ended={ended} />
          <Question ended={ended} />
          <Guests />
        </div>
      }
    </div>
  );
}

export default App;
