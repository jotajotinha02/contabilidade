const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./vendas.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor REAL NOT NULL,
    data TEXT DEFAULT CURRENT_DATE
  )`);
});

module.exports = db;