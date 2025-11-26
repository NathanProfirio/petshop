import { pool } from '../config/db.js';


export async function criarAgendamento(req, res) {
try {
const { id_cliente } = req.user;
const { id_servico, data_hora } = req.body; // data_hora ISO string
const q = `INSERT INTO agendamento (id_cliente, id_servico, data_hora) VALUES ($1,$2,$3) RETURNING *`;
const r = await pool.query(q, [id_cliente, id_servico, data_hora]);
res.json(r.rows[0]);
} catch (err) {
console.error(err);
res.status(400).json({ error: 'Erro ao criar agendamento' });
}
}


export async function listarAgendamentosCliente(req, res) {
try {
const { id_cliente } = req.user;
const q = `SELECT a.*, s.nome as servico_nome, s.preco, p.nome as petshop_nome FROM agendamento a JOIN servico s ON a.id_servico = s.id_servico JOIN petshop p ON s.id_petshop = p.id_petshop WHERE a.id_cliente = $1 ORDER BY a.data_hora DESC`;
const r = await pool.query(q, [id_cliente]);
res.json(r.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao listar agendamentos' });
}
}