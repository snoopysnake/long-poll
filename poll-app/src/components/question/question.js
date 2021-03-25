import './question.css'
import { useEffect, useState } from 'react';
import { sendAnswer } from '../../service/quiz-service';

function Question() {
  const [selected, setSelected] = useState(null);
  const [isSubmitted, setSubmitted] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  useEffect(() => {

  }, []);

  const answers = [
    { num: 1, word: 'one', backgroundColor: '#FFFD82', color: 'black' },
    { num: 2, word: 'two', backgroundColor: '#FF9B71', color: 'black' },
    { num: 3, word: 'three', backgroundColor: '#E84855', color: 'white' },
    { num: 4, word: 'four', backgroundColor: '#E84855', color: 'white' }
  ];

  const answerNum = async answer => {
    setSubmitted(true);
    setSelected(answer);
    if (await sendAnswer(answer.num)) {
      setSuccess(true);
    }
    else {
      setSubmitted(false);
      setSelected(null);
    }
  }

  return (
    <form>
      <h1 style={{marginBottom:'2em'}}>
      {
        !isSuccess ?
        `Guess a number from ${answers[0].word} to ${answers[answers.length-1].word}!` :
        `You guessed number ${selected.word}!`
      }
      </h1>
      <div className="questions">
        {
          answers.map(ans => (
            <div className="button-resize" key={ans.num}>
              <button
                type="button"
                className={`${isSubmitted && selected?.num !== ans.num ? 'button-disabled' : 'button-select'} ${selected?.num === ans.num ? 'selected' : ''}`}
                disabled={isSubmitted}
                value={ans.num}
                style={{ backgroundColor: ans.backgroundColor, color: ans.color }}
                onClick={e => answerNum(ans)}
              >
                {ans.num}
              </button>
            </div>
          ))
        }
      </div>
    </form>
  );
}

export default Question;