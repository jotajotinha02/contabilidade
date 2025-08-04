// index.js
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Inserir venda
app.post('/venda', (req, res) => {
  const { usuario, quantidade, valor } = req.body;
  if (!usuario || !quantidade || !valor) {
    return res.status(400).json({ erro: 'Dados incompletos' });
  }
  db.run(
    'INSERT INTO vendas (usuario, quantidade, valor) VALUES (?, ?, ?)',
    [usuario, quantidade, valor],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ sucesso: true, id: this.lastID });
    }
  );
});

// Listar vendas (com filtro opcional)
app.get('/vendas', (req, res) => {
  const usuario = req.query.usuario;
  const sql = usuario
    ? 'SELECT * FROM vendas WHERE usuario = ? ORDER BY data DESC'
    : 'SELECT * FROM vendas ORDER BY data DESC';
  const params = usuario ? [usuario] : [];
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

// Total vendido (soma quantidade * valor)
app.get('/vendas/total', (req, res) => {
  const usuario = req.query.usuario;
  const sql = usuario
    ? 'SELECT SUM(quantidade * valor) as total FROM vendas WHERE usuario = ?'
    : 'SELECT SUM(quantidade * valor) as total FROM vendas';
  const params = usuario ? [usuario] : [];
  db.get(sql, params, (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ total: row.total || 0 });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
