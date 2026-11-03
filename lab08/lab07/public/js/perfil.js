const userId = document.getElementById('userId');
const userEmail = document.getElementById('userEmail');
const message = document.getElementById('message');
const logoutButton = document.getElementById('logoutButton');

async function loadProfile() {
    try {
        const response = await fetch('/api/perfil', {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        if (!response.ok) {
            message.textContent = data.message;
            message.className = 'error';
            return;
        }
        userId.textContent = data.data.id;
        userEmail.textContent = data.data.email;
    } catch (error) {
        console.error(error);
        message.textContent = 'Error de conexión con el servidor';
        message.className = 'error';
    }
}

logoutButton.addEventListener('click', async () => {
    await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
    });
    window.location.href = 'login.html';
});

loadProfile();
