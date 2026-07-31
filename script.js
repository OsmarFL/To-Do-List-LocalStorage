/* Array para almacenar las tareas */
let tareas = [];

/* Elementos del DOM */
const listaTareas = document.getElementById('tareas');
const contadorElement = document.getElementById('contador');
const inputTarea = document.getElementById('inputTarea');
const btnAgregar = document.getElementById('btnAgregar');
const filtros = document.querySelectorAll('.filtro');

/* Filtros */
let filtroActual = 'todas';

filtros.forEach(filtro => {
    filtro.addEventListener('click', () => {
        filtros.forEach(f => f.classList.remove('activo'));
        filtro.classList.add('activo');
        filtroActual = filtro.dataset.filtro;
        renderizarTareas();
    });
});

/* Cargar tareas desde el almacenamiento local al iniciar la aplicación */
cargarTareas();

/* Eventos y funciones para manejar tareas */
btnAgregar.addEventListener('click', agregarTarea);
inputTarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') agregarTarea();
});

function agregarTarea() {

    const texto = inputTarea.value.trim();

    /* Validar que el campo de texto no esté vacío */
    if (texto === '') {
        alert('Por favor, ingresa una tarea.');
        return;
    }

    /* Crear un objeto tarea y agregarlo al array */
    const tarea = { id: Date.now(), texto: texto, completada: false };
    tareas.push(tarea);
    inputTarea.value = '';

    /* Guardar las tareas en el almacenamiento local y renderizar la lista */
    guardarTareas();
    renderizarTareas();
}

function editarTarea(id) {

    const tarea = tareas.find(t => t.id === id);

    if (!tarea) return;

    const nuevoTexto = prompt('Editar tarea:', tarea.texto);
    
    if (nuevoTexto !== null && nuevoTexto.trim() !== '') {
        tarea.texto = nuevoTexto.trim();
        guardarTareas();
        renderizarTareas();
    }
}


function eliminarTarea(id) {

    tareas = tareas.filter(t => t.id !== id);
    guardarTareas();
    renderizarTareas();
    
}

function toggleCompletada(id) {

    const tarea = tareas.find(t => t.id === id);
    
    if (tarea) {
        tarea.completada = !tarea.completada;
        guardarTareas();
        renderizarTareas();
    }
}

/* Función para renderizar las tareas en la lista */
function renderizarTareas() {

    listaTareas.innerHTML = '';

    let tareasFiltradas = tareas;

    if (filtroActual === 'pendientes') {
        tareasFiltradas = tareas.filter(t => !t.completada);
    } 
    else if (filtroActual === 'completadas') {
        tareasFiltradas = tareas.filter(t => t.completada);
    }

    tareasFiltradas.forEach(tarea => {

        const li = document.createElement('li');

        if (tarea.completada) {
            li.classList.add('completada');
        }

        li.innerHTML = `
                <input type="checkbox" ${tarea.completada ? 'checked' : ''} onchange="toggleCompletada(${tarea.id})">
                <span class="textoTarea" ondblclick="editarTarea(${tarea.id})">${tarea.texto}</span>
                <button class="btnEditar" onclick="editarTarea(${tarea.id})">Editar</button>
                <button class="btnEliminar" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
            `;
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