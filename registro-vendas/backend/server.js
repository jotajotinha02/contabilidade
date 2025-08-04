const express = require('express');
const cors = require('cors');
const db = require('./database');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/venda', (req, res) => {
  const { usuario, quantidade, valor } = req.body;
  db.run(
    'INSERT INTO vendas (usuario, quantidade, valor) VALUES (?, ?, ?)',
    [usuario, quantidade, valor],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ sucesso: true, id: this.lastID });
    }
  );
});

app.get('/vendas', (req, res) => {
  const usuario = req.query.usuario;
  const sql = usuario
    ? 'SELECT * FROM vendas WHERE usuario = ?'
    : 'SELECT * FROM vendas';
  const params = usuario ? [usuario] : [];
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.get('/vendas/total', (req, res) => {
  const usuario = req.query.usuario;
  const sql = usuario
    ? 'SELECT usuario, SUM(quantidade) as total FROM vendas WHERE usuario = ?'
    : 'SELECT SUM(quantidade) as total FROM vendas';
  const params = usuario ? [usuario] : [];
  db.get(sql, params, (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});