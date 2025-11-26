import { pool } from '../config/db.js';

// Criar serviço
export async function criarServico(req, res) {
    try {
        const { id_petshop } = req.user;
        const { nome, descricao, preco, duracao_minutos } = req.body;

        const q = `
            INSERT INTO servico (id_petshop, nome, descricao, preco, duracao_minutos)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const r = await pool.query(q, [
            id_petshop,
            nome,
            descricao,
            preco,
            duracao_minutos
        ]);

        res.json(r.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Erro ao criar serviço" });
    }
}

// Listar apenas do petshop logado
export async function listarServicosPetshop(req, res) {
    try {
        const { id_petshop } = req.user;
        
        const r = await pool.query(`
            SELECT * FROM servico 
            WHERE id_petshop = $1
            ORDER BY id_servico DESC
           `, [id_petshop]);


        res.json(r.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar serviços" });
    }
}

// Listar publicamente
export async function listarServicosPublic(req, res) {
    try {
        const { q, petshop } = req.query;
        let query = 'SELECT * FROM servico WHERE ativo = TRUE';
        const params = [];

        if (q) {
            params.push(`%${q}%`);
            query += ` AND nome ILIKE $${params.length}`;
        }

        if (petshop) {
            params.push(petshop);
            query += ` AND id_petshop = $${params.length}`;
        }

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar serviços" });
    }
}

// Atualizar serviço do petshop
export async function atualizarServico(req, res) {
    try {
        const { id_petshop } = req.user;
        const { id } = req.params;
        const { nome, descricao, preco, duracao_minutos, ativo } = req.body;

        // Verifica dono
        const check = await pool.query(
            "SELECT id_petshop FROM servico WHERE id_servico = $1",
            [id]
        );

        if (check.rowCount === 0)
            return res.status(404).json({ error: "Serviço não encontrado" });

        if (check.rows[0].id_petshop !== id_petshop)
            return res.status(403).json({ error: "Não autorizado" });

        const r = await pool.query(
            `UPDATE servico
             SET nome=$1, descricao=$2, preco=$3, duracao_minutos=$4, ativo=$5
             WHERE id_servico=$6
             RETURNING *`,
            [nome, descricao, preco, duracao_minutos, ativo, id]
        );

        res.json(r.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar serviço" });
    }
}

// Remover serviço
export async function removerServico(req, res) {
    try {
        const { id_petshop } = req.user;
        const { id } = req.params;

        const check = await pool.query(
            "SELECT id_petshop FROM servico WHERE id_servico = $1",
            [id]
        );

        if (check.rowCount === 0)
            return res.status(404).json({ error: "Serviço não encontrado" });

        if (check.rows[0].id_petshop !== id_petshop)
            return res.status(403).json({ error: "Não autorizado" });

        await pool.query(
            "DELETE FROM servico WHERE id_servico = $1",
            [id]
        );

        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao remover serviço" });
    }
}

export async function obterServico(req, res) {
    try {
        const { id } = req.params;
        const { id_petshop } = req.user;

        const q = `
            SELECT * FROM servico 
            WHERE id_servico = $1 AND id_petshop = $2
        `;

        const { rows } = await pool.query(q, [id, id_petshop]);

        if (rows.length === 0) {
            return res.status(404).json({ erro: "Serviço não encontrado" });
        }

        res.json(rows[0]);
    } catch (erro) {
        console.error("Erro ao obter serviço:", erro);
        res.status(500).json({ erro: "Erro no servidor" });
    }
}
