import { useEffect, useState } from 'react';
import { getGuests, updateGuests } from '../../service/quiz-service';
import './guests.css';

function Guests() {
  const [guests, setGuests] = useState(null);
  // const name = sessionStorage.getItem('name');

  useEffect(() => {
    let unsubscribe;
    const updateGuestList = async () => {
      if (unsubscribe)
        return;
      try {
        const { guests } = await updateGuests();
        setGuests(guests);
      } finally {
        await updateGuestList();
      }
    }

    (async () => {
      const { guests } = await getGuests();
      setGuests(guests);
      await updateGuestList();
    })();
    return () => unsubscribe = true;
  }, []);

  return (
    <footer className="guests">
      <p>
        Guests:&nbsp;
      {guests === null ? '' : guests.length > 0 ? guests?.join(', ') : 'None'}
      </p>
    </footer>
  );
}

export default Guests;