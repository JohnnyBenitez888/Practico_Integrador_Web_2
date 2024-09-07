//Variables del Dom
const ubicacion = document.getElementById('ubicacion');
const buscador = document.getElementById('buscador');
const selec = document.getElementById('depto');
const forma = document.getElementById('forma');



//Otras variables
const urlTop = 'https://collectionapi.metmuseum.org/public/collection/v1/';

//Funciones

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
        a: buscadorValor,
        b: ubicacionValor,
        c: deptoValor
    };

    /* Llamamos a la funcion para traer las obras */
    recuperarObras(busqueda);
})

function recuperarObras(busqueda) {
    console.log("desde la funcion", busqueda)//probando si trae el objeto

    const matrizBusqueda = [];

    if (busqueda.a) {
        matrizBusqueda.push(`q=${busqueda.a}`);
    } else {
        matrizBusqueda.push('q=');
    }
    if (busqueda.b) {
        matrizBusqueda.push(`geoLocation=${busqueda.b}`);
    }
    if (busqueda.c != 0) {
        matrizBusqueda.push(`departmentId=${busqueda.c}`);
    }

    console.log(matrizBusqueda);//probando si trae el arreglo

    /* creacion de la url final */
    const urlFinal = urlTop + 'search' + '?hasImages=true&' + matrizBusqueda.join('&');

    console.log(urlFinal);//probando si se arma la url

    mostrarObras(urlFinal);
    //---------------------------------------------------------------------------------------------------------

}


function mostrarObras(urlFinal) {
    return fetch(urlFinal)
        .then(response => response.json())
        .then(response => {
            /* Achicamos la cantidad de datos */
            if (response.objectIDs.length > 80) response.objectIDs = response.objectIDs.slice(0, 80);

            console.log("CANTIDAD DE DATOS: " + response.objectIDs.length);

            response.objectIDs.forEach(dato => {
                //fetch
                fetch(urlTop + 'objects/' + dato)
                    .then(response => response.json())
                    .then(obe => {
                        console.log(obe);
                        //creación 
                        const div = document.createElement('div');
                        div.style.border = '2px solid black';
                        div.style.display = 'flex';
                        document.body.appendChild(div);
                        const h2 = document.createElement('h2');
                        h2.innerHTML = obe.title;
                        div.appendChild(h2);
                        const img = document.createElement('img');
                        img.src = obe.primaryImage;
                        img.style.width = '350px';
                        img.style.height = '383px';
                        div.appendChild(img);
                        const p1 = document.createElement('p');
                        p1.innerHTML = `Departamento: ${obe.department}`;
                        div.appendChild(p1);
                        const p2 = document.createElement('p');
                        p2.innerHTML = `Cultura: ${obe.culture}`;
                        div.appendChild(p2);
                    })
                    .catch(error => console.log("No Funciona NADA"));
            })

        })
        .catch(error => console.log("No se armó el DIV"));
}
