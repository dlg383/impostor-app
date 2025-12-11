const express = require('express');
const cors = require('cors');

const dictionaryStore = require('./data/dictionary.store');
const playersStore = require('./data/players.store');

const dictionaryRoutes = require('./routes/dictionary.routes');
const playersRoutes = require('./routes/players.routes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

//Palabras de Prueba

// cargar datos al iniciar
dictionaryStore.load();
playersStore.load();

app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de Impostor');
});

// montar rutas
app.use('/dictionary', dictionaryRoutes);      // GET /words, POST /words
app.use('/players', playersRoutes);  // GET /players, POST /players

app.listen(port, () => {
  console.log("Servidor de Impostor corriendo en http://localhost:" + port);
});