// Este é o código do seu backend, adaptado para rodar no Vercel como uma Serverless Function.

// Importa os módulos necessários
const express = require('express');
const cors = require('cors');

// Cria a aplicação Express
const app = express();

// Middleware para habilitar o CORS e processar JSON
app.use(cors());
app.use(express.json());

// Array em memória para armazenar as vendas. 
// ATENÇÃO: Em produção real, você usaria um banco de dados.
let vendas = [];
let idAtual = 1;

// Rota para cadastrar uma nova venda
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

// Rota para buscar todas as vendas ou filtrar por usuário
app.get('/vendas', (req, res) => {
  const { usuario } = req.query;
  if (usuario) {
    return res.json(vendas.filter(v => v.usuario.toLowerCase().includes(usuario.toLowerCase())));
  }
  res.json(vendas);
});

// Rota para calcular o total vendido, com filtro opcional
app.get('/vendas/total', (req, res) => {
  const { usuario } = req.query;
  const lista = usuario
    ? vendas.filter(v => v.usuario.toLowerCase().includes(usuario.toLowerCase()))
    : vendas;

  const total = lista.reduce((soma, v) => soma + Number(v.valor), 0);
  res.json({ total });
});

// Rota para excluir uma venda por ID
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

// A PRINCIPAL MUDANÇA: exportar o app em vez de usar app.listen()
// O Vercel irá executar esta aplicação como uma função serverless
module.exports = app;
