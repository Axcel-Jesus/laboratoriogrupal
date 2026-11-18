const registerForm = document.getElementById('registerForm');
const message = document.getElementById('message');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!nombres || !apellidos || !email || !password) {
        message.textContent = 'Todos los campos son obligatorios';
        message.className = 'error';
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombres, apellidos, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            message.className = 'error';
            return;
        }

        message.textContent = 'Registro exitoso. Redirigiendo al login...';
        message.className = 'success';
        setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    } catch (error) {
        console.error(error);
        message.textContent = 'Error de conexión con el servidor';
        message.className = 'error';
    }
});
