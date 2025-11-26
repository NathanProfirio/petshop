    import { pool } from '../config/db.js';
    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    

    export async function registrarCliente(req, res) {
    try {
    const { nome, email, senha, telefone, endereco } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Dados incompletos' });
    const senha_hash = await bcrypt.hash(senha, 10);
    const query = `INSERT INTO cliente (nome, email, senha_hash, telefone, endereco) VALUES ($1,$2,$3,$4,$5) RETURNING id_cliente, nome, email`;
    const result = await pool.query(query, [nome, email, senha_hash, telefone, endereco]);
    res.json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao registrar cliente', detail: err.message });
    }
    }


    export async function loginCliente(req, res) {
    try {
    const { email, senha } = req.body;
    const result = await pool.query('SELECT * FROM cliente WHERE email = $1', [email]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
    const cliente = result.rows[0];
    const ok = await bcrypt.compare(senha, cliente.senha_hash);
    if (!ok) return res.status(401).json({ error: 'Senha inválida' });
    const token = jwt.sign({ id_cliente: cliente.id_cliente }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, cliente: { id_cliente: cliente.id_cliente, nome: cliente.nome, email: cliente.email } });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login' });
    }
    }