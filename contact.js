(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const submit = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#contact-status');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(form);
    submit.disabled = true;
    status.textContent = 'Sending…';
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data))
      });
      if (!response.ok) throw new Error('Contact request failed');
      form.reset();
      status.textContent = 'Thank you. Your message has been sent.';
    } catch (error) {
      status.textContent = 'Sorry, your message could not be sent. Please try again shortly.';
    } finally {
      submit.disabled = false;
    }
  });
})();
