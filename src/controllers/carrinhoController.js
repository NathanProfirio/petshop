import { pool } from '../config/db.js';


export async function obterOuCriarCarrinho(id_cliente) {
const r = await pool.query('SELECT * FROM carrinho WHERE id_cliente = $1', [id_cliente]);
if (r.rowCount > 0) return r.rows[0];
const r2 = await pool.query('INSERT INTO carrinho (id_cliente) VALUES ($1) RETURNING *', [id_cliente]);
return r2.rows[0];
}


export async function adicionarItemCarrinho(req, res) {
try {
const { id_cliente } = req.user;
const { id_produto, quantidade } = req.body;
const carrinho = await obterOuCriarCarrinho(id_cliente);
// check existing
const r = await pool.query('SELECT * FROM item_carrinho WHERE id_carrinho=$1 AND id_produto=$2', [carrinho.id_carrinho, id_produto]);
if (r.rowCount > 0) {
await pool.query('UPDATE item_carrinho SET quantidade = quantidade + $1 WHERE id_item = $2', [quantidade || 1, r.rows[0].id_item]);
} else {
await pool.query('INSERT INTO item_carrinho (id_carrinho, id_produto, quantidade) VALUES ($1,$2,$3)', [carrinho.id_carrinho, id_produto, quantidade || 1]);
}
res.json({ ok: true });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao adicionar item' });
}
}


export async function verCarrinho(req, res) {
try {
const { id_cliente } = req.user;
const carrinho = await obterOuCriarCarrinho(id_cliente);
const q = `SELECT ic.id_item, p.*, ic.quantidade FROM item_carrinho ic JOIN produto p ON ic.id_produto = p.id_produto WHERE ic.id_carrinho = $1`;
const r = await pool.query(q, [carrinho.id_carrinho]);
res.json({ carrinho: carrinho, itens: r.rows });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao ver carrinho' });
}
}


export async function removerItemCarrinho(req, res) {
try {
const { id_cliente } = req.user;
const { id_item } = req.params;
const carrinho = await obterOuCriarCarrinho(id_cliente);
await pool.query('DELETE FROM item_carrinho WHERE id_item = $1 AND id_carrinho = $2', [id_item, carrinho.id_carrinho]);
res.json({ ok: true });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao remover item' });
}
}