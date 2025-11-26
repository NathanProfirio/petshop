import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();


// ---------------------------------------------
// REGISTRAR PETSHOP
// ---------------------------------------------
export async function registrarPetshop(req, res) {
    try {
        const { nome, cnpj, endereco, telefone, email, senha } = req.body;

        if (!nome || !cnpj || !endereco || !telefone || !email || !senha) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const senha_hash = await bcrypt.hash(senha, 10);

        const query = `
            INSERT INTO petshop (nome, cnpj, endereco, telefone, email, senha_hash)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING id_petshop, nome, email
        `;

        const result = await pool.query(query, [
            nome, cnpj, endereco, telefone, email, senha_hash
        ]);

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);

        // erro de chave duplicada (unique)
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email ou CNPJ já cadastrado' });
        }

        res.status(500).json({
            error: 'Erro ao registrar petshop',
            detail: err.message
        });
    }
}

// ---------------------------------------------
// LOGIN PETSHOP
// ---------------------------------------------
export async function loginPetshop(req, res) {
    try {
        const { email, senha } = req.body;

        if (!process.env.JWT_SECRET) {
            console.error("ERRO: JWT_SECRET não definido no .env");
            return res.status(500).json({ error: "Erro interno de configuração" });
        }

        const result = await pool.query(
            'SELECT * FROM petshop WHERE email = $1',
            [email]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Petshop não encontrado' });
        }

        const petshop = result.rows[0];

        const senhaOk = await bcrypt.compare(senha, petshop.senha_hash);
        if (!senhaOk) {
            return res.status(401).json({ error: 'Senha inválida' });
        }

        const token = jwt.sign(
            { id_petshop: petshop.id_petshop },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            petshop: {
                id_petshop: petshop.id_petshop,
                nome: petshop.nome,
                email: petshop.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no login' });
    }
}
