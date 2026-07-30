let tareas = [];

const listaTareas = document.getElementById('tareas');
const contadorElement = document.getElementById('contador');

cargarTareas();

function renderizarTareas() {
    listaTareas.innerHTML = '';
    tareas.forEach(tarea => {
        const li = document.createElement('li');
        li.textContent = tarea.texto;
        listaTareas.appendChild(li);
    });
    actualizarContador();
}

function actualizarContador() {
    const pendientes = tareas.filter(t => !t.completada).length;
    contadorElement.textContent = pendientes;
}

function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function cargarTareas() {
    const tareasGuardadas = localStorage.getItem('tareas');
    if (tareasGuardadas) {
        tareas = JSON.parse(tareasGuardadas);
        renderizarTareas();
    }
}