const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            message.textContent = data.message;
            message.className = 'error';
            return;
        }
        message.textContent = 'Login exitoso. Redirigiendo...';
        message.className = 'success';
        setTimeout(() => { window.location.href = 'perfil.html'; }, 800);
    } catch (error) {
        console.error(error);
        message.textContent = 'Error de conexión con el servidor';
        message.className = 'error';
    }
});
