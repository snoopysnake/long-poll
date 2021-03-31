import './question.css'
import { useEffect, useMemo, useState } from 'react';
import { sendAnswer } from '../../service/quiz-service';

function Question({ submitted, ended }) {
  const [selected, setSelected] = useState(null);
  const [isSubmitted, setSubmitted] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isCorrect, setCorrect] = useState(null);
  const [answer, setAnswer] = useState(0);

  const answers = useMemo(() => [
    { num: 1, word: 'one', backgroundColor: '#FFFD82', color: 'black' },
    { num: 2, word: 'two', backgroundColor: '#FF9B71', color: 'black' },
    { num: 3, word: 'three', backgroundColor: '#E84855', color: 'white' },
    { num: 4, word: 'four', backgroundColor: '#E84855', color: 'white' }
  ], []);

  useEffect(() => {
    if (!submitted && !ended) {
      setSelected(null);
      setSubmitted(false);
      setSuccess(false);
      setCorrect(null);
      setAnswer(0);
    }
  }, [submitted, ended]);

  useEffect(() => {
    if (submitted > 0 && submitted <= 4) {
      answerNum(answers.find(ans => ans.num === submitted));
    }
  }, [submitted, answers]);

  const answerNum = async ans => {
    setSelected(ans);
    setSubmitted(true);
    setSuccess(true);
    const { correct, answer } = await sendAnswer(
      ans.num,
      sessionStorage.getItem('id')
    );
    setCorrect(correct);
    setAnswer(answer);
  }

  return (
    <div>
      <form>
        {
          isCorrect === null &&
          <h1>
            {
              isSuccess && `You guessed number ${selected.word}!`
            }
            {
              (!isSuccess && !ended) && `Guess a number from one to four!`
            }
            {
              (!isSuccess && ended) && 'You ran out of time!'
            }
          </h1>
        }
        <h1 style={{ color: `${isCorrect === false ? '#B56B45' : '#FFFD82'}` }}>
          {
            isCorrect === true && `You guessed correctly!`
          }
          {
            isCorrect === false && `The correct answer is ${answer}!`
          }
        </h1>
        <div className="questions">
          {
            answers.map(ans => (
              <div className="button-resize" key={ans.num}>
                <button
                  type="button"
                  className={`${(isSubmitted && selected?.num !== ans.num) || ended !== false ?
                    'button-disabled' : 'button-select'} ${selected?.num === ans.num && isCorrect === null ?
                      'selected' : ''} ${answer === ans.num ? 'correct' : ''}`}
                  disabled={isSubmitted || ended !== false}
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
    </div>
  );
}

export default Question;