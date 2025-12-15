export async function submitRequestCallback(payload) {
  const res = await fetch('/api/request-callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    let message = 'Failed to submit request';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch (_) {}
    throw new Error(message);
  }
  return res.json();
}


