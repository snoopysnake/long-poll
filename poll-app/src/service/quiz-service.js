import { URL } from './url';

export async function joinSession(name, id) {
  return await fetch(`${URL}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name, id})
  });
}

export async function leaveSession(name) {
  return await fetch(`${URL}/leave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name})
  });
}

export async function checkIfJoined(name, id) {
  return await fetch(`${URL}/joined`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name, id})
  });
}

export async function sendAnswer(num) {
  const response = await fetch(`${URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({num})
  });
  return response.ok;
}

export async function getGuests() {
  const response = await fetch(`${URL}/guests`);
  return await response.json();
}