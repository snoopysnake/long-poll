import './question.css'

function Question() {
  return (
    <form>
      <h1>Guess a number from one to four!</h1>
      <div className="questions">
        <div className="button-resize">
          <button className="button-select" type="button"
            style={{ backgroundColor: '#FFFD82', color: 'black' }}
            
          >
            1
          </button>
        </div>
        <div className="button-resize">
          <button className="button-select" type="button"
            style={{ backgroundColor: '#FF9B71', color: 'black' }}
          >
            2
          </button>
        </div>
        <div className="button-resize">
          <button className="button-select" type="button"
            style={{ backgroundColor: '#E84855', color: 'white' }}
          >
            3
          </button>
        </div>
        <div className="button-resize">
          <button className="button-select" type="button"
            style={{ backgroundColor: '#B56B45', color: 'white' }}
          >
            4
          </button>
        </div>
      </div>
    </form>
  );
}

export default Question;