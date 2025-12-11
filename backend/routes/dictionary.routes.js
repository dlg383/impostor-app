const express = require('express');
const router = express.Router();
const dictionaryStore = require('../data/dictionary.store');

router.get('/', (req, res) => {
  res.json(dictionaryStore.getAll());
});

router.get('/tematics', (req, res) => {
  res.json(dictionaryStore.getTematicsSummary());
});

router.post('/tematics', (req, res) => {
  const { label } = req.body;
  try {
    const created = dictionaryStore.createTematic(label);

    if (!created) {
      return res.status(409).json({ message: 'Ya existe una temática con ese id/label' });
    }

    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get('/random-word', (req, res) => {
  const result = dictionaryStore.getRandomWordFromActiveTematics();

  if (!result) {
    return res.status(404).json({ message: 'No hay palabras disponibles en temáticas activas' });
  }

  return res.json(result);
});

module.exports = router;
