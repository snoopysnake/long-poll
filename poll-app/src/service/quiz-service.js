import { URL } from './url';

export async function joinSession(name, id) {
  return await fetch(`${URL}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, id })
  });
}

export async function leaveSession(name) {
  return await fetch(`${URL}/leave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });
}

export async function checkIfJoined(name, id) {
  const res = await fetch(`${URL}/joined`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, id })
  });
  return await res.json();
}

export async function sendAnswer(num) {
  const res = await fetch(`${URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ num })
  });
  return res.ok;
}

export async function getGuests() {
  const res = await fetch(`${URL}/guests`);
  return await res.json();
}

export async function updateGuests() {
  const res = await fetch(`${URL}/update-guests`);
  return await res.json();
}

export async function getTimeRemaining() {
  const res = await fetch(`${URL}/time-left`);
  return await res.json();
}

export async function restart() {
  const res = await fetch(`${URL}/start`);
  return await res.ok;
}
