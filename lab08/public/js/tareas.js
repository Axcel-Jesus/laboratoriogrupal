// Lógica del Pomodoro (Básica)
let tiempo = 25 * 60;
let timerInterval = null;
let corriendo = false;

document.getElementById('btnStart').addEventListener('click', () => {
    if (corriendo) {
        clearInterval(timerInterval);
    } else {
        timerInterval = setInterval(() => {
            if (tiempo <= 0) { clearInterval(timerInterval); alert("¡Tiempo de descanso!"); return; }
            tiempo--;
            const min = String(Math.floor(tiempo / 60)).padStart(2, '0');
            const seg = String(tiempo % 60).padStart(2, '0');
            document.getElementById('timer').textContent = `${min}:${seg}`;
        }, 1000);
    }
    corriendo = !corriendo;
});

// Lógica del To-Do List (Fetch API)
const formTarea = document.getElementById('formTarea');
const listaTareas = document.getElementById('listaTareas');

async function cargarTareas() {
    try {
        const response = await fetch('/api/tareas', { credentials: 'same-origin' });
        if (response.status === 401) return window.location.href = 'login.html'; // Si no hay sesión

        const tareas = await response.json();
        listaTareas.innerHTML = '';

        if (tareas.length === 0) {
            listaTareas.innerHTML = '<p>No hay tareas pendientes. ¡A trabajar!</p>';
            return;
        }

        tareas.forEach(tarea => {
            const div = document.createElement('div');
            div.className = 'tarea-item';
            div.innerHTML = `
                <span class="${tarea.completada ? 'completada' : ''}">${tarea.titulo}</span>
                <div>
                    <button onclick="completarTarea(${tarea.id}, ${tarea.completada})" style="width:auto; padding: 5px 10px; margin-right:5px; background: ${tarea.completada ? '#64748b' : '#10b981'}">
                        ${tarea.completada ? 'Deshacer' : 'Completar'}
                    </button>
                    <button onclick="eliminarTarea(${tarea.id})" style="width:auto; padding: 5px 10px; background: #ef4444;">X</button>
                </div>
            `;
            listaTareas.appendChild(div);
        });
    } catch (error) {
        console.error(error);
    }
}

// Crear tarea (POST)
formTarea.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    
    await fetch('/api/tareas', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descripcion: '' })
    });
    
    document.getElementById('titulo').value = '';
    cargarTareas(); // Recargar la lista sin refrescar la página
});

// Actualizar tarea (PUT)
async function completarTarea(id, estadoActual) {
    const tareaActual = { titulo: "Tarea", completada: !estadoActual }; // Simplificado para el ejemplo
    // En un caso real, deberías buscar el título original
    const tituloElem = event.target.parentElement.parentElement.querySelector('span').textContent;
    
    await fetch(`/api/tareas/${id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: tituloElem, descripcion: '', completada: !estadoActual })
    });
    cargarTareas();
}

// Eliminar tarea (DELETE)
async function eliminarTarea(id) {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    await fetch(`/api/tareas/${id}`, { method: 'DELETE', credentials: 'same-origin' });
    cargarTareas();
}

// Logout
document.getElementById('btnLogout').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    window.location.href = 'login.html';
});

// Cargar tareas al iniciar
cargarTareas();
