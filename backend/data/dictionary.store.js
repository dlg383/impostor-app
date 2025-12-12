const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'db', 'dictionary.json');

let dictionary = {};

function load() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    dictionary = JSON.parse(data);
  } catch (err) {
    console.error('Error cargando words.json, usando objeto vacío:', err);
    dictionary = {};
  }
}

function save() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dictionary, null, 2), 'utf8');
  } catch (err) {
    console.error('Error guardando words.json:', err);
  }
}

function getAll() {
  return dictionary;
}

function getTematicsSummary() {
  return Object.entries(dictionary).map(([id, value]) => ({
    id: id,
    label: value.label,
    activa: !!value.activa,
    wordsCount: value.words.length
  }));
}

function getTematicWords(tematicId) {
  return dictionary?.[tematicId]?.words ?? [];
}

function createTematic(label) {
  if (!label || typeof label !== 'string') {
    throw new Error('label es obligatorio y debe ser un string');
  }

  const id = label.trim().toLowerCase(); // como pediste

  if (!id) {
    throw new Error('label no puede ser solo espacios en blanco');
  }

  // Si ya existe, devolvemos null para indicar conflicto
  if (dictionary[id]) {
    return null;
  }

  dictionary[id] = {
    activa: true,
    label: label,
    words: []
  };

  save();

  // Devuelvo también el id para que sea cómodo
  return { id, ...dictionary[id] };
}

function toggleActive(tematicKey) {
  if (!tematicKey) return null;
  if (!dictionary[tematicKey]) return null;

  dictionary[tematicKey].activa = !dictionary[tematicKey].activa;

  save();
  return dictionary[tematicKey];
}

function addWord(tematicKey, wordText) {
  if (!tematicKey || !wordText) {
    throw new Error('tematicId y wordText son obligatorios');
  }

  const tematic = dictionary[tematicKey];

  if (!tematic) {
    // temática no encontrada
    return null;
  }

  if (!Array.isArray(tematic.words)) {
    tematic.words = [];
  }

  const normalizedNew = wordText.trim().toLowerCase();

  const alreadyExists = tematic.words.some(w =>
    (w.word || '').trim().toLowerCase() === normalizedNew
  );

  if (alreadyExists) {
    // ya existe la palabra en esa temática
    return null;
  }

  const newWord = {
    word: wordText.trim(),
    uses: 0
  };

  tematic.words.push(newWord);
  save();

  // devuelvo info útil
  return { tematic: tematicKey, ...newWord };
}

function getRandomWordFromActiveTematics() {
  const candidates = [];

  // Recorremos todas las temáticas
  for (const [tematicId, tematic] of Object.entries(dictionary)) {
    if (!tematic.activa || !Array.isArray(tematic.words) || tematic.words.length === 0) {
      continue;
    }

    tematic.words.forEach((wordObj, index) => {
      const uses = Number(wordObj.uses) || 0;
      const weight = 1 / (uses + 1); // menos usos => más peso

      candidates.push({
        tematicId,
        tematicLabel: tematic.label,
        wordIndex: index,
        wordObj,
        weight
      });
    });
  }

  if (candidates.length === 0) {
    return null; // No hay palabras disponibles
  }

  // Selección aleatoria ponderada
  const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
  let r = Math.random() * totalWeight;

  let chosen = candidates[0];
  for (const c of candidates) {
    if (r < c.weight) {
      chosen = c;
      break;
    }
    r -= c.weight;
  }

  // Incrementamos usos en el diccionario real
  const tematic = dictionary[chosen.tematicId];
  const realWordObj = tematic.words[chosen.wordIndex];

  realWordObj.uses = (Number(realWordObj.uses) || 0) + 1;

  // Guardamos los cambios
  save();

  return {
    tematicLabel: chosen.tematicLabel,
    word: realWordObj.word,
    uses: realWordObj.uses
  };
}

module.exports = {
  load,
  save,
  getAll,
  getTematicsSummary,
  getTematicWords,
  createTematic,
  toggleActive,
  addWord,
  getRandomWordFromActiveTematics
};
