const express = require('express');
const router = express.Router();
const playersStore = require('../data/players.store');

router.get('/', (req, res) => {
  res.json(playersStore.getAll());
});

router.post('/add', (req, res) => {
  const { name, impostor } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'name es obligatorio' });
  }

  const newPlayer = playersStore.add({ name, impostor: !!impostor });
  return res.status(201).json(newPlayer);
});

router.delete('/delete/:name', (req, res) => {
  const ok = playersStore.deletePlayer(req.params.name);

  if (!ok) {
    return res.status(404).json({ message: 'No se encontró ningún jugador con ese nombre' });
  }

  return res.json({ message: 'Jugador(es) borrado(s)' });
});

router.post('/select-impostors', (req, res) => {
  const { impostorCount } = req.body;

  try {
    // llamamos a la lógica que ya tienes en el store
    const ok = playersStore.selectImpostor(impostorCount);

    if (!ok) {
      return res
        .status(400)
        .json({ message: 'No se han podido seleccionar impostores (¿hay suficientes jugadores?)' });
    }

    // devolvemos los impostores y el estado completo de la lista
    return res.status(200).send();
  } catch (err) {
    console.error('Error al seleccionar impostores:', err);
    return res.status(500).json({ message: 'Error interno al seleccionar impostores' });
  }
});

module.exports = router;
