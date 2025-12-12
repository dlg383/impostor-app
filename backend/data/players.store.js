const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'db', 'players.json');

let players = [];

function load() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    players = JSON.parse(data);
  } catch (err) {
    console.error('Error cargando players.json, usando array vacío:', err);
    players = [];
  }
}

function save() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2), 'utf8');
  } catch (err) {
    console.error('Error guardando players.json:', err);
  }
}

function getAll() {
  return players;
}

function add(player) {
  const newPlayer = { ...player };
  players.push(newPlayer);
  save();
  return newPlayer;
}

function selectImpostor(impostorCount) {
  if (!Array.isArray(players) || players.length === 0) {
    return [];
  }

  let count = Number(impostorCount) || 1;

  if (count < 1) count = 1;
  if (count >= players.length) count = players.length - 1;

  players.forEach(p => { p.impostor = false; });

  const chosenIndices = new Set();

  while (chosenIndices.size < count) {
    const idx = Math.floor(Math.random() * players.length);
    chosenIndices.add(idx);
  }

  chosenIndices.forEach(idx => {
    players[idx].impostor = true;
  });
  save();
  return true;
}

function deletePlayer(name) {
  if (!name) return null;

  const before = players.length;
  players = players.filter(p => p.name !== name);

  if (players.length === before) return null; // no encontró nada
  save();
  return true;
}

module.exports = {
  load,
  getAll,
  add,
  selectImpostor,
  deletePlayer
};
