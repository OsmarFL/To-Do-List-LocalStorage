/* Array para almacenar las tareas */
let tareas = [];

/* Elementos del DOM */
const listaTareas = document.getElementById('tareas');
const contadorElement = document.getElementById('contador');
const inputTarea = document.getElementById('inputTarea');
const btnAgregar = document.getElementById('btnAgregar');
const filtros = document.querySelectorAll('.filtro');
const btnLimpiar = document.getElementById('btnLimpiar');
btnLimpiar.addEventListener('click', limpiarCompletadas);



/* Filtros */
let filtroActual = 'todas';

/* Maneja el cambio de filtro activo (Todas / Pendientes / Completadas) */
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
btnLimpiar.addEventListener('click', limpiarCompletadas);
inputTarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') agregarTarea();
});

/* Crear una nueva tarea a partir del texto ingresado por el usuario */
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

/* Permite editar una tarea existente */
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

/* Elimina una tarea */
function eliminarTarea(id) {

    tareas = tareas.filter(t => t.id !== id);
    guardarTareas();
    renderizarTareas();
    
}

/* Marca una tarea como completada */
function toggleCompletada(id) {

    const tarea = tareas.find(t => t.id === id);
    
    if (tarea) {
        tarea.completada = !tarea.completada;
        guardarTareas();
        renderizarTareas();
    }
}

function limpiarCompletadas() {
    
    /* hotfix: Validar si hay tareas completadas antes de limpiar */
    const completadas = tareas.filter(t => t.completada).length;
    if (completadas === 0) {
        alert('No hay tareas completadas para limpiar');
        return;
    }
    
    tareas = tareas.filter(t => !t.completada);
    guardarTareas();
    renderizarTareas();
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