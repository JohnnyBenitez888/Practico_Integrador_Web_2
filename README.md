# Trabajo Integrador Final de WEB 2
# Alumno: Jonathan Benitez

## Consigna del trabajo Integrador:

Desarrolle una página que consuma imágenes del museo metropolitano de NY provisto por la API https://collectionapi.metmuseum.org.
La información de los endpoints disponibles y como usarlo se encuentra en https://metmuseum.github.io/

## Requisitos:

**Filtros de búsqueda:**

   - La página debe permitir la búsqueda de imágenes de objetos de arte mediante filtros como:
     - Departamento (ej. American Decorative Arts, Arms and Armor, Asian Art, etc.)
     - Palabra clave (objetos de arte que contengan la palabra en los datos del objeto)
     - Localización (objetos que coincidan con una localización, Ej. Europe, China, Paris)
   - El filtrado puede realizarse de manera individual o combinando varios filtros.

**Visualización de resultados:**

   - Las imágenes de los objetos deben mostrarse en una grilla de 4 columnas.
   - Cada imagen debe presentarse en una tarjeta (card) con la siguiente información:
     - Imagen del objeto.
     - Título.
     - Cultura.
     - Dinastía.
   - Si el objeto tiene imágenes adicionales, debe incluirse un botón que permita verlas en una página diferente.
   - Al pasar el mouse sobre la imagen, debe mostrarse la fecha (o aproximación) en que el objeto fue diseñado o creado.

**Traducción:**

   - El título, cultura y dinastía deben mostrarse en español. Para esto, se utilizará el paquete de Node.js [Google Translate Node JS](https://github.com/statickidz/node-google-translate-skidz).

**Paginación:**

   - La página debe mostrar un máximo de 20 objetos recuperados por búsqueda.
   - Si la búsqueda supera este límite, debe implementarse un sistema de paginación para navegar entre los resultados.

**Despliegue:**
   - El sitio debe estar publicado en un hosting o servidor accesible por internet. Se debe investigar el proceso de despliegue o publicación de la aplicación en el hosting seleccionado.

   
   #### Instrucciones para ejecutar localmente

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/JohnnyBenitez888/Practico_Integrador_Web_2.git
   ```

2. **Acceder a la carpeta:**

   ```bash
   cd Practico_Integrador_Web_2
   ```

3. **Instala las dependencias**

   ```bash
   npm install
   ```

4. **Ejecuta el servidor**:

    ```bash
    npm start
    ```

5. **Abre tu navegador** y ve a `http://localhost:3000`.

