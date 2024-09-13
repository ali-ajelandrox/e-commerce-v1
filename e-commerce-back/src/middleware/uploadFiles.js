// middleware/uploadFiles.js

const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

function uploadFiles(req, res, next) {
    const busboy = new Busboy({ headers: req.headers });
    req.files = []; // Inicializa req.files como un array vacío

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const filePath = path.join(__dirname, '../uploads', filename); // Cambia la ruta si es necesario
        file.pipe(fs.createWriteStream(filePath));
        req.files.push({ path: filePath, originalname: filename });
    });

    busboy.on('finish', () => {
        next();
    });

    req.pipe(busboy);
}

module.exports = uploadFiles;
