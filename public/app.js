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
let botones = document.getElementById('botones');
let cartel = document.getElementById('cartel');
let footer = document.getElementById('footer');
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
    botones.innerHTML = '';
    cartel.style.display = 'none';
    /* Para evitar que se recargue la página y se envien los datos */
    e.preventDefault();

    let input = ubicacion.value;

    /* Obtenemos los valores de los inputs */
    let busqueda = [];
    busqueda.push(buscador.value); /* buscador */
    busqueda.push(input.charAt(0).toUpperCase() + input.slice(1)); /* ubicacion */
    busqueda.push(selec.value); /* departamento */

    /* Llamamos a la funcion y le pasamos el arreglo */
    recuperarObras(busqueda);
})


/* Funcion para crear la URL con los datos del formulario */
function recuperarObras(busqueda) {

    /* verificando los datos de los input y el select */
    console.log("Arreglo con los datos del formulario ", busqueda)

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
    } else {
        busqueda[2] = null;
    }

    /* Quitamos todos los valores nulos del arreglo busqueda */
    busqueda = busqueda.filter(element => element !== null);

    /* creacion de la url final con los datos del arreglo*/
    let urlFinal = urlMuseo + 'search' + '?hasImages=true&' + busqueda.join('&');


    /* Si el usuario no ingresa ningun dato y aprieta "Buscar", entonces hacemos que se traigan 
    pocos datos de la API con una url modificada ya que tarda mucho tiempo en traer todos los datos
     y elservidor se podría caer..*/
    if (urlFinal === 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=*') {
        urlFinal = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=*&perPage=50';
    }

    /* Probando como quedó la URL final */
    console.log("URL ARMADA: " + urlFinal);

    mostrarObras(urlFinal);
}


/* Función para traer los datos de la API */
async function mostrarObras(urlFinal) {
    try {
        const respuesta = await fetch(urlFinal);
        const dato = await respuesta.json();
        datos = dato.objectIDs;

        /* Quitamos todos los elementos nulos del arreglo */
        datos = datos.filter(elemento => elemento !== undefined && elemento !== null);

        /* Achicamos la cantidad de datos trayendo solo 60 si es que son muchos*/
        if (datos.length > 60) datos = datos.slice(0, 60);

        /* reseteando datos globales */
        paginaActual = 1;
        totalPaginas = 1;

        /* Calculamos el total de paginas a mostrar ya que cada página muestra 20 objetos */
        totalPaginas = Math.ceil(datos.length / obrasPorPagina);

        /* Probando la cantidad de datos traidos */
        console.log("CANTIDAD DE DATOS TRAIDOS: " + datos.length);

        llenarGaleria();
    } catch (error) {
        cartelError();/* Mostramos el cartel de no disponibles */
        return console.log("NO SE TRAJO NADA " + error);
    }
}


/* función para mostrar el cartel de que no hay datos disponibles con los datos del fomulario */
function cartelError() {
    cartel.innerHTML = '';
    cartel.style.display = 'block';
    let cartelito = document.createElement('p');
    cartelito.classList.add('cartelito');
    cartelito.innerHTML = 'No hay objetos de Arte disponibles con esos datos. Intenta con otros datos.';
    cartel.appendChild(cartelito);
    document.body.insertBefore(cartel, footer);
}


/* Función para traducir texto de la card*/
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

            /* Verificamos que el objeto de arte exista sino se crea una card con datos por defecto */
            if (obra.message == "ObjectID not found" || obra.message == 'Not a valid object') {
                crearCard();
                return;
            }

            /* Probando el objeto de arte traido */
            console.log("DATO TRAIDO: ", obra);

            /* Traducimos los datos del objeto de arte */
            const titulo = await traductor(obra.title || 'Sin título', 'es');
            const cultura = await traductor(obra.culture || 'Desconocida', 'es');
            const dinastia = await traductor(obra.dynasty || 'Desconocida', 'es');

            /* Creacion de elementos HTML y le agregamos los datos del objeto de arte*/
            const div = document.createElement('div');
            div.classList.add('cubos');           
            const img = document.createElement('img');
            img.classList.add('imagen');
            img.src = obra.primaryImage || 'assets/Imagen_no_disponible.png';
            img.onerror = () => {
                img.src = 'assets/Imagen_no_disponible.png'; /* Si la URL es incorrecta o la imagen no carga, se muestra la imagen por defecto */
            };
            img.title = obra.objectDate;
            div.appendChild(img);
            const h3 = document.createElement('h3');
            h3.innerHTML = titulo;
            div.appendChild(h3);
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


/* Funcion para crear una card nueva si el objeto de arte no existe */
function crearCard() {
    /* Creacion de elementos HTML y le agregamos los datos del objeto de arte*/
    const div = document.createElement('div');
    div.classList.add('cubos');   
    const img = document.createElement('img');
    img.classList.add('imagen');
    img.src = 'assets/Imagen_no_disponible.png';
    img.title = 'NADA';
    div.appendChild(img);
    const h3 = document.createElement('h3');
    h3.innerHTML = "Objeto de Arte No Disponible";
    div.appendChild(h3);
    const p1 = document.createElement('p');
    p1.innerHTML = `<p><b>Cultura:</b> Sin Datos</p>`;
    div.appendChild(p1);
    const p2 = document.createElement('p');
    p2.innerHTML = `<p><b>Dinastia:</b> Sin Datos</p>`;
    div.appendChild(p2);
    galeria.appendChild(div);
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
        const divImages = document.createElement('div');
        divImages.classList.add('div-Image');
        const imgElement = document.createElement('img');
        imgElement.src = imagen;
        imgElement.classList.add('imagen-modal');
        divImages.appendChild(imgElement);
        contenedor.appendChild(divImages);
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