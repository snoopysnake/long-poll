import { useEffect, useState } from 'react';
import { checkIfJoined } from './service/quiz-service';
import Setup from './components/setup/setup';
import Question from './components/question/question';
import Guests from './components/guests/guests';
import './app.css';

function App() {
  const [isReady, setReady] = useState(null);

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

  return (
    <div className="app">
      { isReady === false &&
        <div className="quiz-setup">
          <Setup ready={ready} />
        </div>
      }
      { isReady === true &&
        <div className="quiz">
          <header>
            Time remaining...
        </header>
          <Question />
          <footer>
            <Guests />
          </footer>
        </div>
      }
    </div>
  );
}

export default App;
