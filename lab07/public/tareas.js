console.log("tareas.js cargado");

// Pomodoro
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

// To-Do List
const formTarea = document.getElementById('formTarea');
const listaTareas = document.getElementById('listaTareas');

async function cargarTareas() {
    try {
        const response = await fetch('/api/tareas', { credentials: 'same-origin' });
        
        if (response.status === 401) {
            return window.location.href = 'login.html';
        }

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const tareas = await response.json();
        listaTareas.innerHTML = '';

        if (tareas.length === 0) {
            listaTareas.innerHTML = '<p>No hay tareas pendientes. ¡A trabajar!</p>';
            return;
        }

        tareas.forEach(tarea => {
            const div = document.createElement('div');
            div.className = 'tarea-item';
            // Arreglamos el CSS del input y botones
            div.innerHTML = `
                <span class="${tarea.completada ? 'completada' : ''}">${tarea.titulo}</span>
                <div>
                    <button class="btn-accion btn-completar" onclick="completarTarea(${tarea.id}, '${tarea.titulo}', ${tarea.completada})">
                        ${tarea.completada ? 'Deshacer' : 'Completar'}
                    </button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarTarea(${tarea.id})">X</button>
                </div>
            `;
            listaTareas.appendChild(div);
        });
    } catch (error) {
        console.error("Error:", error);
        listaTareas.innerHTML = `<p class="error-msg">Error al cargar: ${error.message}</p>`;
    }
}

formTarea.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;

    try {
        const response = await fetch('/api/tareas', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: titulo, descripcion: '' })
        });
        
        if (!response.ok) throw new Error("No se pudo crear");
        
        document.getElementById('titulo').value = '';
        cargarTareas();
    } catch (error) {
        alert("Error al guardar la tarea");
    }
});

async function completarTarea(id, titulo, estadoActual) {
    await fetch(`/api/tareas/${id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: titulo, descripcion: '', completada: !estadoActual })
    });
    cargarTareas();
}

async function eliminarTarea(id) {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    await fetch(`/api/tareas/${id}`, { method: 'DELETE', credentials: 'same-origin' });
    cargarTareas();
}

document.getElementById('btnLogout').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    window.location.href = 'login.html';
});

cargarTareas();
