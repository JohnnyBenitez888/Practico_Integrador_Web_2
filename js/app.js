/* Variables */
const ubicacion = document.getElementById('ubicacion');
const buscador = document.getElementById('buscador');
const selec = document.getElementById('depto');
const forma = document.getElementById('forma');
let galeria = document.getElementById('galeria');
const botones = document.getElementById('botones');


/* Otras variables */
const urlMuseo = 'https://collectionapi.metmuseum.org/public/collection/v1/';


/* Funcion para llenar el Select con los Departamentos*/
function llenarConDeptos() {
    return fetch(`${urlMuseo}/departments`)
        .then(respuesta => respuesta.json())
        .then(dato => {

            /* llenamos nuestro select con opcion */
            dato.departments.forEach(departamento => {
                const option = document.createElement('option');
                option.value = departamento.departmentId;
                option.textContent = departamento.displayName;
                selec.appendChild(option);
            })
        }
        ).catch(error => console.log("No se llenan los departamentos"));
}
llenarConDeptos();


/* Evento del Formulario al hacer clic en el boton buscar */
forma.addEventListener('submit', (e) => {

    /* Limpiamos la Galeria */
    galeria.innerHTML = '';

    /* Para evitar que se recargue la página y se envien los datos */
    e.preventDefault();

    /* Obtenemos los valores de los inputs */
    const buscadorValor = buscador.value;
    const ubicacionValor = ubicacion.value;
    const deptoValor = selec.value;

    /* Creamos un objeto busqueda con los valores de los inputs */
    const busqueda = {
        a: buscadorValor,
        b: ubicacionValor,
        c: deptoValor
    };

    /* Llamamos a la funcion y le pasamos el objeto */
    recuperarObras(busqueda);
})


/* Funcion para crear la URL con los datos del formulario */
function recuperarObras(busqueda) {
    console.log("Objeto con los datos del formulario ", busqueda)//probando si trae el objeto

    /* creamos la matriz de busqueda con los datos del objeto busqueda */
    const matrizBusqueda = [];

    if (busqueda.a) {
        matrizBusqueda.push(`q=${busqueda.a}`);
    } else {
        matrizBusqueda.push('q=*');
    }
    if (busqueda.b) {
        matrizBusqueda.push(`geoLocation=${busqueda.b}`);
    }
    if (busqueda.c != 0) {
        matrizBusqueda.push(`departmentId=${busqueda.c}`);
    }

    console.log("Arreglo con los datos del Objeto " + matrizBusqueda);//probando si trae el arreglo

    /* creacion de la url final */
    let urlFinal = urlMuseo + 'search' + '?hasImages=true&' + matrizBusqueda.join('&');

    if (busqueda.c == 0 && busqueda.a == "" && busqueda.b == "") {
        urlFinal = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';
    }

    console.log("URL ARMADA: " + urlFinal);//probando si se arma la url

    mostrarObras(urlFinal);
}


/* Función para traer los datos de la API */
function mostrarObras(urlFinal) {
    return fetch(urlFinal)
        .then(respuesta => respuesta.json())
        .then(dato => {

            let datos = dato.objectIDs;

            /* Achicamos la cantidad de datos trayendo solo 60 si es que son muchos*/
            if (datos.length > 60) datos = datos.slice(0, 60);

            console.log("CANTIDAD DE DATOS TRAIDOS: " + datos.length);//Prueba si se traen todos los datos

            llenarGaleria(datos);

        })
        .catch(error => console.log("NO SE TRAJO NADA " + error));
}

/* Funcion para llenar la galeria con los objetos de arte */
function llenarGaleria(datos) {

    /* Iteramos el Arreglo con los Datos traidos de la API*/
    datos.forEach(dato => {
        
        /* Usamos fetch para traer un objeto especifico para agregarlo a la galeria */
        fetch(urlMuseo + 'objects/' + dato)
            .then(respuesta => respuesta.json())
            .then(obra => {

                console.log("Todos los DATOS: " + obra);//--------------------------------------
               
                /* Creacion de elementos HTML y le agregamos los datos de la objeto de arte*/
                const div = document.createElement('div');
                div.classList.add('cubos');
                const h3 = document.createElement('h3');
                h3.innerHTML = obra.title;
                div.appendChild(h3);
                const img = document.createElement('img');
                img.classList.add('imagen');
                img.src = obra.primaryImage;
                div.appendChild(img);
                const p1 = document.createElement('p');

                /* Cultura */
                const cultura = obra.culture;
                if (cultura === "") {
                    p1.innerHTML = `<p><b>Cultura:</b> Desconocida, ID: ${obra.objectID}</p>`;
                } else {
                    p1.innerHTML = `<p><b>Cultura:</b> ${cultura}, ID: ${obra.objectID}</p>`;
                };
                div.appendChild(p1);
                const p2 = document.createElement('p');

                /* Dinastia */
                const dinastia = obra.dynasty;
                if (dinastia === "") {
                    p2.innerHTML = `<p><b>Dinastia: </b> Desconocida</p>`;
                } else {
                    p2.innerHTML = `<p><b>Dinastia: </b> ${dinastia}</p>`;
                };
                div.appendChild(p2);

                /* Botón de ver Imágenes adicionales*/
                if (obra.additionalImages.length > 0) {
                    const botonVerMas = document.createElement('button');
                    botonVerMas.classList.add('btn-ver-mas');
                    botonVerMas.onclick = () => verMasImagenes(obra.additionalImages);
                    botonVerMas.textContent = 'Ver más imágenes';
                    div.appendChild(botonVerMas);
                }

                galeria.appendChild(div);
            })
            .catch(error => console.log("NO TRAJO LA OBRA " + error));
    })
}


/* ---------------------MODAL DE IMAGENES----------------- */
function verMasImagenes(imagenes) {

    const modal = document.getElementById('modal');
    const contenedor = document.getElementById('imagenesAdicionales');

    /* Arreglo de imagenes traidas de la API */
    let imagenesReducidad = imagenes;

    /* Limpiamos las imágenes previas */
    contenedor.innerHTML = '';

    /* Achicamos el arreglo a solo 4 imágenes*/
    if(imagenesReducidad.length > 4) imagenesReducidad = imagenesReducidad.slice(0, 4);

    /* Añadimos las imágenes al modal */
    imagenesReducidad.forEach(imagen => {
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
    modal.style.display = 'none';
}