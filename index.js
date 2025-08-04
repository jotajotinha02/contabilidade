const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let vendas = [];
let idAtual = 1;

// Cadastrar venda
app.post('/venda', (req, res) => {
  const { usuario, quantidade, valor } = req.body;
  const novaVenda = {
    id: idAtual++,
    usuario,
    quantidade,
    valor,
    data: new Date().toLocaleString('pt-BR')
  };
  vendas.push(novaVenda);
  res.status(201).json(novaVenda);
});

// Buscar vendas (com filtro opcional)
app.get('/vendas', (req, res) => {
  const { usuario } = req.query;
  if (usuario) {
    return res.json(vendas.filter(v => v.usuario.toLowerCase().includes(usuario.toLowerCase())));
  }
  res.json(vendas);
});

// Total vendido (com filtro opcional)
app.get('/vendas/total', (req, res) => {
  const { usuario } = req.query;
  const lista = usuario
    ? vendas.filter(v => v.usuario.toLowerCase().includes(usuario.toLowerCase()))
    : vendas;

  const total = lista.reduce((soma, v) => soma + v.valor, 0);
  res.json({ total });
});

// Excluir venda por ID
app.delete('/venda/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = vendas.findIndex(v => v.id === id);
  if (index !== -1) {
    vendas.splice(index, 1);
    return res.status(200).json({ ok: true });
  } else {
    return res.status(404).json({ erro: 'Venda não encontrada' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
