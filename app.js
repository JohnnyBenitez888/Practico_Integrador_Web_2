//Variables del Dom
const ubicacion = document.getElementById('ubicacion');
const buscador = document.getElementById('buscador');
const selec = document.getElementById('depto');
const forma = document.getElementById('forma');



//Otras variables
const urlTop = 'https://collectionapi.metmuseum.org/public/collection/v1';

//Funciones
/* const opcion1 = { method: 'GET', headers: { accept: 'application/json' } }; */
function llenarDeptos() {
    const departamentos = fetch(`${urlTop}/departments`)
        .then(response => response.json())
        .then(response =>{

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
            })}
        ).catch(error => console.log("No pasa nada"));
}
llenarDeptos();

/* Evento del Formulario */
forma.addEventListener('submit', (e) => {
    e.preventDefault();
    const buscadorValor = buscador.value;
    const ubicacionValor = ubicacion.value;
    const deptoValor = selec.value;
    console.log(buscador.value);
    console.log(ubicacion.value);
    console.log(selec.value);
})