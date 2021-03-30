import { useEffect, useState } from 'react';
import { checkIfJoined } from './service/quiz-service';
import Setup from './components/setup/setup';
import Timer from './components/timer/timer';
import Question from './components/question/question';
import Guests from './components/guests/guests';
import './app.css';

function App() {
  const [isReady, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await checkIfJoined(
        sessionStorage.getItem('name'),
        sessionStorage.getItem('id')
      );
      if (res.status)
        setReady(true);
      else setReady(false);
    })();
  }, []);

  const ready = () => {
    setReady(true);
  }

  const disable = () => {
    setDisabled(true);
  }

  return (
    <div className="app">
      { isReady === false &&
        <div className="quiz-setup">
          <Setup ready={ready} />
        </div>
      }
      { isReady === true &&
        <div className="quiz">
          <Timer disable={disable} />
          <Question disabled={disabled} />
          <Guests />
        </div>
      }
    </div>
  );
}

export default App;
