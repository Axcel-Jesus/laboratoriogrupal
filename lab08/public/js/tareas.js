console.log("tareas.js cargado");

// --- LÓGICA DEL POMODORO CON ALARMA Y TÍTULO DINÁMICO ---
let tiempo = 25 * 60;
let timerInterval = null;
let corriendo = false;
const tituloOriginal = document.title;

function sonarAlarma() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(() => osc.stop(), 800);
}

document.getElementById('btnStart').addEventListener('click', () => {
    if (corriendo) {
        clearInterval(timerInterval);
        document.title = tituloOriginal;
    } else {
        timerInterval = setInterval(() => {
            if (tiempo <= 0) { 
                clearInterval(timerInterval); 
                corriendo = false;
                sonarAlarma();
                alert("¡Tiempo de descanso! Has completado tu Pomodoro.");
                document.title = tituloOriginal;
                tiempo = 25 * 60;
                document.getElementById('timer').textContent = `25:00`;
                return; 
            }
            tiempo--;
            const min = String(Math.floor(tiempo / 60)).padStart(2, '0');
            const seg = String(tiempo % 60).padStart(2, '0');
            document.getElementById('timer').textContent = `${min}:${seg}`;
            document.title = `⏱️ ${min}:${seg} - Enfoque`;
        }, 1000);
    }
    corriendo = !corriendo;
});

// --- LÓGICA DEL TO-DO LIST Y BARRA DE PROGRESO ---
const formTarea = document.getElementById('formTarea');
const listaTareas = document.getElementById('listaTareas');

async function cargarTareas() {
    try {
        const response = await fetch('/api/tareas', { credentials: 'same-origin' });
        
        if (response.status === 401) return window.location.href = 'login.html';
        if (!response.ok) throw new Error('Error en el servidor');

        const tareas = await response.json();
        listaTareas.innerHTML = '';

        // CÁLCULO DE LA BARRA DE PROGRESO
        const total = tareas.length;
        const completadas = tareas.filter(t => t.completada).length;
        const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);
        
        const barra = document.getElementById('barraProgreso');
        const texto = document.getElementById('textoProgreso');
        if(barra && texto) {
            barra.style.width = `${porcentaje}%`;
            texto.textContent = `${porcentaje}% (${completadas}/${total})`;
        }

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
        listaTareas.innerHTML = `<p style="color:red;">Error al cargar: ${error.message}</p>`;
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
            body: JSON.stringify({ titulo: titulo })
        });
        if (response.ok) {
            document.getElementById('titulo').value = '';
            cargarTareas();
            cargarEstadisticas(); // Actualiza el dashboard
        }
    } catch (error) { alert("Error al guardar"); }
});

async function completarTarea(id, titulo, estadoActual) {
    await fetch(`/api/tareas/${id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: titulo, completada: !estadoActual })
    });
    cargarTareas();
    cargarEstadisticas(); // Actualiza el dashboard
}

async function eliminarTarea(id) {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    await fetch(`/api/tareas/${id}`, { method: 'DELETE', credentials: 'same-origin' });
    cargarTareas();
    cargarEstadisticas(); // Actualiza el dashboard
}

document.getElementById('btnLogout').addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    window.location.href = 'login.html';
});

// --- LÓGICA DEL DASHBOARD (CHART.JS) ---
let miGrafico = null; // Variable global para guardar el gráfico

async function cargarEstadisticas() {
    try {
        const response = await fetch('/api/tareas/estadisticas', { credentials: 'same-origin' });
        if (!response.ok) return;
        
        const data = await response.json();

        // Actualizar números
        document.getElementById('statTotal').textContent = data.total;
        document.getElementById('statCompletadas').textContent = data.completadas;
        document.getElementById('statPendientes').textContent = data.total - data.completadas;

        // Datos para el gráfico
        const etiquetas = data.porDia.map(item => item.dia);
        const valores = data.porDia.map(item => item.cantidad);

        // Renderizar gráfico con Chart.js
        const canvas = document.getElementById('graficoTareas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Si ya existe un gráfico, lo destruimos para crear uno nuevo con datos actualizados
        if (miGrafico) {
            miGrafico.destroy();
        }

        miGrafico = new Chart(ctx, {
            type: 'bar', // Gráfico de barras
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'Tareas creadas por día',
                    data: valores,
                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    } catch (error) {
        console.error("Error al cargar estadísticas:", error);
    }
}

// Iniciar todo
cargarTareas();
cargarEstadisticas();
