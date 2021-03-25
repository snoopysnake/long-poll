import { useEffect, useState } from 'react';
import { getGuests } from '../../service/quiz-service';
import './guests.css';

function Guests() {
  const [guests, setGuests] = useState([]);
  const name = sessionStorage.getItem('name');

  useEffect(() => {
    (async () => {
      const { guests } = await getGuests();
      setGuests(guests);
    })();
  }, []);

  return (
    <div className="guests">
      Guests:&nbsp;{guests
        .map(g => g === name ? <strong key={g}>{g} (you)</strong> : <span key={g}>{g}</span>)
        .map((g, i) => i < guests.length - 1 ? <span key={i}>{g},&nbsp;</span> : g)
      }
    </div>
  );
}

export default Guests;