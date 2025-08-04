const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./vendas.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco:', err.message);
  } else {
    console.log('Conectado ao banco SQLite.');
  }
});

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT,
    quantidade INTEGER,
    valor REAL,
    data TEXT
  )
`);

module.exports = db;
