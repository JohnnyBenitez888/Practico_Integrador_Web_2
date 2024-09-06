//Variables del Dom
const ubicacion = document.getElementById('ubicacion');
const buscador = document.getElementById('buscador');
const selec = document.getElementById('depto');



//Otras variables
const urlTop = 'https://collectionapi.metmuseum.org/public/collection/v1';

//Funciones
/* const opcion1 = { method: 'GET', headers: { accept: 'application/json' } }; */
function llenarDeptos() {
    const departamentos = fetch(`${urlTop}/departments`)
        .then(response => response.json())
        .then(response =>
            //console.log(response),
            response.departments.forEach(departamento => {
                const option = document.createElement('option');
                option.innerHTML = departamento.displayName;
                selec.appendChild(option);
            })
        ).catch(error => console.log("No pasa nada"));
}

llenarDeptos();