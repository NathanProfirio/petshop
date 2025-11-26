import { pool } from '../config/db.js';


export async function criarAvaliacao(req, res) {
try {
const { id_cliente } = req.user;
const { id_petshop, nota, comentario } = req.body;
const q = `INSERT INTO avaliacao (id_cliente, id_petshop, nota, comentario) VALUES ($1,$2,$3,$4) RETURNING *`;
const r = await pool.query(q, [id_cliente, id_petshop, nota, comentario]);
res.json(r.rows[0]);
} catch (err) {
console.error(err);
res.status(400).json({ error: 'Erro ao criar avaliação' });
}
}


export async function listarAvaliacoesPetshop(req, res) {
try {
const { petshopId } = req.params;
const r = await pool.query('SELECT a.*, c.nome as cliente_nome FROM avaliacao a JOIN cliente c ON a.id_cliente = c.id_cliente WHERE a.id_petshop = $1 ORDER BY a.data_avaliacao DESC', [petshopId]);
res.json(r.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao listar avaliações' });
}
}