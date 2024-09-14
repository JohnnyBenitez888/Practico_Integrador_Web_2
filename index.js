const express = require('express');
const path = require('path');
/* Importa el paquete de traducción */
const translate = require('node-google-translate-skidz'); 
const app = express();
const port = 3000;

/* Middleware para analizar el cuerpo de la solicitud JSON */
app.use(express.json());

/* Ruta para traducir texto */
app.post('/translate', (req, res) => {
    const { text, targetLang } = req.body;

    translate({
        text: text,
        source: 'en', /* Idioma de origen (Inglés) */
        target: targetLang, /* Idioma de destino (Español) */
    }, (result) => {
        if (result && result.translation) {
            res.json({ translatedText: result.translation });
        } else {
            res.status(500).json({ error: 'Error al traducir el texto' });
        }
    });
});

/* Middleware para servir archivos estáticos */
app.use(express.static(path.join(__dirname, 'public')));

/* Ruta principal */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`El Servidor está corriendo en http://localhost:${port}`);
});
