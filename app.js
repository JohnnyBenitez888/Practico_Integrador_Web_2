//Variables
const ubicacion = document.getElementById('ubicacion');
const buscador = document.getElementById('buscador');
const selec = document.getElementById('depto');
const forma = document.getElementById('forma');
let galeria = document.getElementById('galeria');
const botones = document.getElementById('botones');



//Otras variables
const urlMuseo = 'https://collectionapi.metmuseum.org/public/collection/v1/';

//Funciones
function llenarConDeptos() {
    return fetch(`${urlMuseo}/departments`)
        .then(respuesta => respuesta.json())
        .then(dato => {

            /*  // Agregamos el primer option al select 
             let primerOption = document.createElement('option');
             primerOption.value = 0;
             primerOption.textContent = 'Todos los Departamentos';
             selec.appendChild(primerOption); */


            /* llenamos nuestro select con los departamentos */
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

/* Evento del Formulario */
forma.addEventListener('submit', (e) => {
    galeria.innerHTML = '';  // Limpiar la galería para cada nueva página
    e.preventDefault();
    const buscadorValor = buscador.value;
    const ubicacionValor = ubicacion.value;
    const deptoValor = selec.value;

    //objeto busqueda
    const busqueda = {
        a: buscadorValor,
        b: ubicacionValor,
        c: deptoValor
    };

    /* Llamamos a la funcion para traer las obras */
    recuperarObras(busqueda);
})

function recuperarObras(busqueda) {
    console.log("Objeto con los datos del formulario ", busqueda)//probando si trae el objeto

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
    //---------------------------------------------------------------------------------------------------------

}


function mostrarObras(urlFinal) {
    return fetch(urlFinal)
        .then(respuesta => respuesta.json())
        .then(dato => {
            let datos = dato.objectIDs;
            /* Achicamos la cantidad de datos */
            if (datos.length > 60) datos = datos.slice(0, 60);

            console.log("CANTIDAD DE DATOS TRAIDOS: " + datos.length);//--------------------------------------

            llenarGaleria(datos);

        })
        .catch(error => console.log("NO SE TRAJO NADA " + error));
}

function llenarGaleria(datos) {



    //Arreglo con los Datos
    datos.forEach(dato => {
        //fetch
        fetch(urlMuseo + 'objects/' + dato)
            .then(respuesta => respuesta.json())
            .then(obra => {
                console.log("Todos los DATOS: " + obra);//--------------------------------------
                //creación 
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

                //Cultura
                const cultura = obra.culture;
                if (cultura === "") {
                    p1.innerHTML = `Cultura: Desconocida, ID: ${obra.objectID}`;
                } else {
                    p1.innerHTML = `Cultura: ${cultura}, ID: ${obra.objectID}`;
                };
                div.appendChild(p1);
                const p2 = document.createElement('p');

                //Dinastia
                const dinastia = obra.dynasty;
                if (dinastia === "") {
                    p2.innerHTML = `Dinastia: Desconocida`;
                } else {
                    p2.innerHTML = `Dinastia: ${dinastia}`;
                };
                div.appendChild(p2);

                //Botón de ver mas Imágenes
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
    let imagenesReducidad = imagenes;

    // Limpiamos las imágenes previas
    contenedor.innerHTML = '';

    //Achicamos el arreglo
    if(imagenesReducidad.length > 4) imagenesReducidad = imagenesReducidad.slice(0, 4);

    /* Añadimos las imágenes al modal */
    imagenesReducidad.forEach(imagen => {
        const imgElement = document.createElement('img');
        imgElement.src = imagen;
        imgElement.classList.add('imagen-modal');
        contenedor.appendChild(imgElement);
    });

    /* Mostramos el modal */
    modal.style.display = 'flex';
}

/* ---------------------CERRAR MODAL----------------- */
function cerrarModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}