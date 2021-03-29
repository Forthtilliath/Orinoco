const http = require('http');

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    // Code d'état http de la réponse
    res.writeHead(200); // Code = OK
    // Texte renvoyé par le serveur
    res.end('My first server!');
};

// Création du serveur
const server = http.createServer(requestListener);
// Lancement du serveur
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
