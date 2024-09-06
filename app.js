//Variables del Dom
const ubicacion = document.getElementById('ubicacion');
const buscador = document.getElementById('buscador');
const selec = document.getElementById('depto');
const forma = document.getElementById('forma');



//Otras variables
const urlTop = 'https://collectionapi.metmuseum.org/public/collection/v1/';

//Funciones
/* const opcion1 = { method: 'GET', headers: { accept: 'application/json' } }; */
function llenarConDeptos() {
    return fetch(`${urlTop}/departments`)
        .then(response => response.json())
        .then(response => {

            /* Agregamos el primer option al select */
            let primerOption = document.createElement('option');
            primerOption.value = 0;
            primerOption.textContent = 'Todos los Departamentos';
            selec.appendChild(primerOption);


            /* llenamos nuestro select con los departamentos */
            response.departments.forEach(departamento => {
                const option = document.createElement('option');
                option.value = departamento.departmentId;
                option.textContent = departamento.displayName;
                selec.appendChild(option);
            })
        }
        ).catch(error => console.log("No pasa nada"));
}
llenarConDeptos();

/* Evento del Formulario */
forma.addEventListener('submit', (e) => {
    e.preventDefault();
    const buscadorValor = buscador.value;
    const ubicacionValor = ubicacion.value;
    const deptoValor = selec.value;

    //objeto busqueda
    const busqueda = {
        b: buscadorValor,
        u: ubicacionValor,
        d: deptoValor
    };

    /* Llamamos a la funcion para traer las obras */
    recuperarObras(busqueda);
})

function recuperarObras(busqueda) {
    console.log("desde la funcion", busqueda)//probando si trae el objeto

    const matrizBusqueda = [];

    if (busqueda.b) {
        matrizBusqueda.push(`q=${busqueda.b}`);
    }
    if (busqueda.u) {
        matrizBusqueda.push(`geoLocation=${busqueda.u}`);
    }
    if (busqueda.d!=0) {
        matrizBusqueda.push(`departmentId=${busqueda.d}`);
    }

    console.log(matrizBusqueda);//probando si trae el arreglo

    /* creacion de la url final */
    const urlFinal = urlTop + 'search' + '?' + matrizBusqueda.join('&');
    
    console.log(urlFinal);//probando si se arma la url
}