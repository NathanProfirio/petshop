import { pool } from '../config/db.js';


export async function checkout(req, res) {
try {
const { id_cliente } = req.user;
const { forma_pagamento } = req.body;


const carrinho = await pool.query('SELECT * FROM carrinho WHERE id_cliente = $1', [id_cliente]);
if (carrinho.rowCount === 0) return res.status(400).json({ error: 'Carrinho vazio' });
const id_carrinho = carrinho.rows[0].id_carrinho;


const itens = await pool.query('SELECT ic.*, p.preco FROM item_carrinho ic JOIN produto p ON ic.id_produto = p.id_produto WHERE ic.id_carrinho = $1', [id_carrinho]);
if (itens.rowCount === 0) return res.status(400).json({ error: 'Carrinho vazio' });


// calcular total
let total = 0;
itens.rows.forEach(i => total += parseFloat(i.preco) * i.quantidade);


// criar pedido
const rPedido = await pool.query('INSERT INTO pedido (id_cliente, valor_total, forma_pagamento) VALUES ($1,$2,$3) RETURNING *', [id_cliente, total, forma_pagamento]);
const id_pedido = rPedido.rows[0].id_pedido;


// inserir itens
for (const it of itens.rows) {
await pool.query('INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario) VALUES ($1,$2,$3,$4)', [id_pedido, it.id_produto, it.quantidade, it.preco]);
}


// esvaziar carrinho
await pool.query('DELETE FROM item_carrinho WHERE id_carrinho = $1', [id_carrinho]);


res.json({ pedido: rPedido.rows[0] });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro no checkout' });
}
}


export async function listarPedidosCliente(req, res) {
try {
const { id_cliente } = req.user;
const r = await pool.query('SELECT * FROM pedido WHERE id_cliente = $1 ORDER BY data_pedido DESC', [id_cliente]);
res.json(r.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao listar pedidos' });
}
}