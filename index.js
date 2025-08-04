<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Registro de Vendas</title>
  <style>
    body { font-family: Arial; max-width: 600px; margin: 40px auto; }
    input, button { padding: 8px; margin: 4px 0; width: 100%; }
    button { background: #28a745; color: white; border: none; cursor: pointer; }
    button:hover { background: #218838; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f8f9fa; }
  </style>
</head>
<body>

  <h1>Registrar Venda</h1>
  <form id="form-venda">
    <input type="text" id="usuario" placeholder="Usuário" required />
    <input type="number" id="quantidade" placeholder="Quantidade" min="1" required />
    <input type="number" id="valor" step="0.01" placeholder="Valor (R$)" min="0.01" required />
    <button type="submit">Registrar</button>
  </form>

  <h2>Filtro por usuário:</h2>
  <input type="text" id="filtro" placeholder="Nome do usuário" />
  <button onclick="buscarVendas()">Buscar</button>

  <h3>Total vendido: <span id="total">R$ 0,00</span></h3>

  <table>
    <thead>
      <tr>
        <th>Usuário</th>
        <th>Quantidade</th>
        <th>Valor (R$)</th>
        <th>Data</th>
      </tr>
    </thead>
    <tbody id="lista-vendas"></tbody>
  </table>

  <script>
    const api = 'http://localhost:3000';

    document.getElementById('form-venda').addEventListener('submit', async e => {
      e.preventDefault();
      const usuario = document.getElementById('usuario').value.trim();
      const quantidade = +document.getElementById('quantidade').value;
      const valor = +document.getElementById('valor').value;

      if(!usuario || quantidade <= 0 || valor <= 0){
        alert('Preencha todos os campos corretamente.');
        return;
      }

      await fetch(api + '/venda', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ usuario, quantidade, valor }),
      });

      e.target.reset();
      buscarVendas();
    });

    async function buscarVendas(){
      const filtro = document.getElementById('filtro').value.trim();
      const vendasRes = await fetch(api + '/vendas' + (filtro ? '?usuario=' + encodeURIComponent(filtro) : ''));
      const vendas = await vendasRes.json();

      const totalRes = await fetch(api + '/vendas/total' + (filtro ? '?usuario=' + encodeURIComponent(filtro) : ''));
      const total = await totalRes.json();

      const tbody = document.getElementById('lista-vendas');
      tbody.innerHTML = '';

      if(vendas.length === 0){
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: red;">Nenhuma venda encontrada.</td></tr>`;
      } else {
        vendas.forEach(v => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${v.usuario}</td>
            <td>${v.quantidade}</td>
            <td>R$ ${v.valor.toFixed(2)}</td>
            <td>${v.data}</td>
          `;
          tbody.appendChild(tr);
        });
      }

      document.getElementById('total').innerText = `R$ ${total.total.toFixed(2)}`;
    }

    buscarVendas();
  </script>
</body>
</html>
