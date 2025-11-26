import { pool } from '../config/db.js';


export async function criarProduto(req, res) {
try {
const { id_petshop } = req.user;
const { nome, descricao, preco, categoria } = req.body;
const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;
const q = `INSERT INTO produto (id_petshop, nome, descricao, preco, categoria, imagem_url, ativo) VALUES ($1,$2,$3,$4,$5,$6, TRUE) RETURNING *`;
const r = await pool.query(q, [id_petshop, nome, descricao, preco, categoria, imagem_url]);
res.json(r.rows[0]);
} catch (err) {
console.error(err);
res.status(400).json({ error: 'Erro ao criar produto' });
}
}


export async function listarProdutos(req, res) {
try {
const { q, categoria, petshop } = req.query;
let query = 'SELECT * FROM produto WHERE ativo = TRUE';
const params = [];
if (q) { params.push(`%${q}%`); query += ` AND nome ILIKE $${params.length}`; }
if (categoria) { params.push(categoria); query += ` AND categoria = $${params.length}`; }
if (petshop) { params.push(petshop); query += ` AND id_petshop = $${params.length}`; }
const result = await pool.query(query, params);
res.json(result.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao listar produtos' });
}
}


export async function atualizarProduto(req, res) {
    try {
        const { id_petshop } = req.user;
        const { id } = req.params;
        const { nome, descricao, preco, categoria, ativo } = req.body;

        // Verificar dono do produto
        const r0 = await pool.query(
            'SELECT * FROM produto WHERE id_produto = $1',
            [id]
        );

        if (r0.rowCount === 0)
            return res.status(404).json({ error: 'Produto não encontrado' });

        if (r0.rows[0].id_petshop !== id_petshop)
            return res.status(403).json({ error: 'Não autorizado' });

        // Se enviou nova imagem
        let imagem_url = r0.rows[0].imagem_url;
        if (req.file) {
            imagem_url = `/uploads/${req.file.filename}`;
        }

        // Atualizar tudo
        const r = await pool.query(
            `UPDATE produto 
             SET nome=$1, descricao=$2, preco=$3, categoria=$4, ativo=$5, imagem_url=$6 
             WHERE id_produto=$7 
             RETURNING *`,
            [nome, descricao, preco, categoria, ativo, imagem_url, id]
        );

        res.json(r.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
}



export async function removerProduto(req, res) {
try {
const { id_petshop } = req.user;
const { id } = req.params;
const r0 = await pool.query('SELECT id_petshop FROM produto WHERE id_produto = $1', [id]);
if (r0.rowCount === 0) return res.status(404).json({ error: 'Produto não encontrado' });
if (r0.rows[0].id_petshop !== id_petshop) return res.status(403).json({ error: 'Não autorizado' });
await pool.query('DELETE FROM produto WHERE id_produto = $1', [id]);
res.json({ ok: true });
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Erro ao remover produto' });
}
}

export async function listarProdutosDoPetshop(req, res) {
    try {
        const { id_petshop } = req.user;

        const result = await pool.query(
            "SELECT * FROM produto WHERE id_petshop = $1",
            [id_petshop]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
}
