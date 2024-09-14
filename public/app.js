/**
 * Autor/a: Jonathan Benitez
 * version: 1.0
 * fecha: 21/08/2024
 * El siguiente script se generan funciones para el funcionamiento de la pagina consummiendo la API del Museo Metropolitano de NY..
 * Este es el proyecto integrador final de la materia Web 2 */


/* Variables */
const ubicacion = document.getElementById('ubicacion');
const buscador = document.getElementById('buscador');
const selec = document.getElementById('depto');
const forma = document.getElementById('forma');
let galeria = document.getElementById('galeria');
const botones = document.getElementById('botones');
let paginaActual = 1;
const obrasPorPagina = 20;
let totalPaginas = 1;
let datos = [];

/* URL de la API */
const urlMuseo = 'https://collectionapi.metmuseum.org/public/collection/v1/';


/* Funcion para llenar el Select con los Departamentos*/
function llenarConDeptos() {
    return fetch(`${urlMuseo}/departments`)
        .then(respuesta => respuesta.json())
        .then(dato => {

            /* llenamos nuestro select con las etiquetas opcion */
            dato.departments.forEach(departamento => {
                const option = document.createElement('option');
                option.value = departamento.departmentId;
                option.textContent = departamento.displayName;
                selec.appendChild(option);
            })
        }
        ).catch(error => console.log("No se cargan los departamentos"));
}
llenarConDeptos();


/* Evento del Formulario al hacer clic en el boton buscar */
forma.addEventListener('submit', (e) => {

    /* Limpiamos la Galeria */
    galeria.innerHTML = '';

    /* Para evitar que se recargue la página y se envien los datos */
    e.preventDefault();

    /* Obtenemos los valores de los inputs */
    let busqueda = [];
    busqueda.push(buscador.value); /* buscador */
    busqueda.push(ubicacion.value); /* ubicacion */
    busqueda.push(selec.value); /* departamento */

    /* Llamamos a la funcion y le pasamos el arreglo */
    recuperarObras(busqueda);
})


/* Funcion para crear la URL con los datos del formulario */
function recuperarObras(busqueda) {
    console.log("Arreglo con los datos del formulario ", busqueda)//probando si trae el objeto

    /* Verificamos la existencia de datos y concatenamos */
    if (busqueda[0]) {
        busqueda[0] = `q=${busqueda[0]}`;
    } else {
        busqueda[0] = 'q=*';
    }
    if (busqueda[1]) {
        busqueda[1] = `geoLocation=${busqueda[1]}`;
    } else {
        busqueda[1] = null;
    }
    if (busqueda[2] != "0") {
        busqueda[2] = `departmentId=${busqueda[2]}`;
    }else{
        busqueda[2] = null;
    }

    /* Quitamos todos los valores nulos del arreglo busqueda */
    busqueda = busqueda.filter(element => element !== null);

    /* creacion de la url final con los datos del arreglo*/
    let urlFinal = urlMuseo + 'search' + '?hasImages=true&' + busqueda.join('&');


    /* Si el usuario no ingresa ningun dato y aprieta "Buscar", entonces se traen todos los datos de la API 
    if (busqueda[0] == 'q=*' && busqueda[1] == '0') {
        urlFinal = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';
    }*/

    console.log("URL ARMADA: " + urlFinal);//probando como quedó la URL final

    mostrarObras(urlFinal);
}


/* Función para traer los datos de la API */
async function mostrarObras(urlFinal) {
    try {
        const respuesta = await fetch(urlFinal);
        const dato = await respuesta.json();
        datos = dato.objectIDs;

        /* Achicamos la cantidad de datos trayendo solo 60 si es que son muchos*/
        if (datos.length > 60) datos = datos.slice(0, 60);

        /* Calculamos el total de paginas a mostrar ya que cada página muestra 20 objetos */
        totalPaginas = Math.ceil(datos.length / obrasPorPagina);

        console.log("CANTIDAD DE DATOS TRAIDOS: " + datos.length); //Probando la cantidad de datos traidos

        llenarGaleria();
    } catch (error) {
        return console.log("NO SE TRAJO NADA " + error);
    }
}

/* Función para traducir texto usando el servidor de Node.js */
async function traductor(text, targetLang) {
    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text, targetLang: targetLang })
        });
        const result = await response.json();
        return result.translatedText;
    } catch (error) {
        console.error('Error al traducir el texto:', error);
        return text; /* Devuelve el texto original si hay un error */
    }
}


/* Funcion para llenar la galeria con los objetos de arte */
function llenarGaleria() {

    /* Limpiar la galería antes de llenarla */
    galeria.innerHTML = '';

    /* Calcular los índices para los objetos de la página actual */
    const inicio = (paginaActual - 1) * obrasPorPagina;
    const final = inicio + obrasPorPagina;
    const objetosPagina = datos.slice(inicio, final);

    /* Iteramos el Arreglo con los Datos traidos de la API*/
    objetosPagina.forEach(async dato => {
        try {
            /* Usamos fetch para traer un objeto especifico para agregarlo a la galeria */
            const respuesta = await fetch(urlMuseo + 'objects/' + dato);
            const obra = await respuesta.json();

            console.log("DATO TRAIDO: " + obra);//Probando el objeto de arte traido

            /* Traducimos los datos del objeto de arte */
            const titulo = await traductor(obra.title || 'Sin título', 'es');
            const cultura = await traductor(obra.culture, 'es');
            const dinastia = await traductor(obra.dynasty, 'es');

            /* Creacion de elementos HTML y le agregamos los datos del objeto de arte*/
            const div = document.createElement('div');
            div.classList.add('cubos');
            const h3 = document.createElement('h3');
            h3.innerHTML = titulo;
            div.appendChild(h3);
            const img = document.createElement('img');
            img.classList.add('imagen');
            img.src = obra.primaryImage || 'assets/Imagen_no_disponible.png';
            img.onerror = () => {
                img.src = 'assets/Imagen_no_disponible.png'; /* Si la URL es incorrecta o la imagen no carga, se muestra la imagen por defecto */
            };
            img.title = obra.objectDate;
            div.appendChild(img);
            const p1 = document.createElement('p');

            /* Cultura */
            if (cultura === "") {
                p1.innerHTML = `<p><b>Cultura:</b> Desconocida</p>`;
            } else {
                p1.innerHTML = `<p><b>Cultura:</b> ${cultura}</p>`;
            };
            div.appendChild(p1);
            const p2 = document.createElement('p');

            /* Dinastia */
            if (dinastia === "") {
                p2.innerHTML = `<p><b>Dinastia:</b> Desconocida</p>`;
            } else {
                p2.innerHTML = `<p><b>Dinastia:</b> ${dinastia}</p>`;
            };
            div.appendChild(p2);

            /* Botón para ver Imágenes adicionales*/
            if (obra.additionalImages.length > 0) {
                const botonVerMas = document.createElement('button');
                botonVerMas.classList.add('btn-ver-mas');
                botonVerMas.onclick = () => verMasImagenes(obra.additionalImages);
                botonVerMas.textContent = 'Ver más imágenes';
                div.appendChild(botonVerMas);
            }

            galeria.appendChild(div);
        } catch (error) {
            console.error("NO TRAJO LA OBRA " + error);
        }
    });

    mostrarBotonesPaginacion();
}


/* ---------------------MODAL DE IMAGENES----------------- */
function verMasImagenes(imagenes) {
    const modal = document.getElementById('modal');
    const contenedor = document.getElementById('imagenesAdicionales');

    /* Limpiamos las imágenes previas */
    contenedor.innerHTML = '';

    /* Achicamos el arreglo a solo 4 imágenes*/
    if (imagenes.length > 4) imagenes = imagenes.slice(0, 4);

    /* Añadimos las imágenes al modal */
    imagenes.forEach(imagen => {
        const imgElement = document.createElement('img');
        imgElement.src = imagen;
        imgElement.classList.add('imagen-modal');
        contenedor.appendChild(imgElement);
    });

    /* Mostramos el modal ya que está oculto*/
    modal.style.display = 'flex';
}


/* Funcion para CERRAR EL MODAL */
function cerrarModal() {
    const modal = document.getElementById('modal');
    /* Ocultamos el modal */
    modal.style.display = 'none';
}


/* ---------------------PAGINACIÓN----------------- */
function mostrarBotonesPaginacion() {

    /* Limpiar los botones previos */
    botones.innerHTML = '';

    /* Creamos el Botón de anterior */
    const botonAnterior = document.createElement('button');
    botonAnterior.classList.add('botonP');
    botonAnterior.textContent = 'Anterior';

    /* agregamos un evento al Botón para ir a la página anterior */
    botonAnterior.onclick = () => {
        if (paginaActual > 1) {
            paginaActual--;
            llenarGaleria();
        }
    };
    if (paginaActual !== 1) botones.appendChild(botonAnterior);

    /* Creamos el Botón de siguiente */
    const botonSiguiente = document.createElement('button');
    botonSiguiente.classList.add('botonP');
    botonSiguiente.textContent = 'Siguiente';

    /* agregamos un evento al Botón para ir a la página siguiente */
    botonSiguiente.onclick = () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            llenarGaleria();
        }
    };
    if (paginaActual !== totalPaginas) botones.appendChild(botonSiguiente);
}