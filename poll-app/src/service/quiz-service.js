import { URL } from './url';

export async function sendAnswer(num) {
  const response = await fetch(`${URL}/sendAnswer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({num})
  });
  return response.status === 200;
}