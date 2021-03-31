import { useState, useEffect } from 'react';
import { joinSession } from '../../service/quiz-service';
import './setup.css';

function Setup({ ready }) {
  const [name, setName] = useState('');
  const [isSubmitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(sessionStorage.getItem('name') || '');
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    if (name.length > 0) {
      setSubmitted(true);
      const response = await joinSession(name, sessionStorage.getItem('id'));
      if (response.ok) {
        const user = await response.json();
        sessionStorage.setItem('name', user.name);
        sessionStorage.setItem('id', user.id);
        ready();
      }
      else {
        setError(await response.text());
        setSubmitted(false);
      };
    }
  }

  return (
    <div>
      {
        !isSubmitted &&
        <form className="setup" onSubmit={onSubmit}>
          <h1>Enter a name</h1>
          <div style={{ height: '4.5em' }}>
            <input
              className={`name-input ${error ? 'error' : ''}`}
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
            />
            {
              error &&
              <div style={{ color: '#B56B45' }}>{error}</div>
            }
          </div>
          <button
            className="name-submit"
            type="button"
            disabled={name.length === 0}
            onClick={onSubmit}
          >
            OK
      </button>
        </form>
      }
      {
        isSubmitted &&
        <h1>Joining session...</h1>
      }
    </div>
  );
}

export default Setup;