// FILE: controllers/carrinhoController.js
import { pool } from '../config/db.js';

// =====================================
// CRIAR OU OBTER CARRINHO DO CLIENTE
// =====================================
async function obterOuCriarCarrinho(id_cliente) {
    const busca = await pool.query(
        `SELECT * FROM carrinho WHERE id_cliente = $1`,
        [id_cliente]
    );

    if (busca.rows.length > 0) return busca.rows[0];

    const novo = await pool.query(
        `INSERT INTO carrinho (id_cliente) VALUES ($1) RETURNING *`,
        [id_cliente]
    );

    return novo.rows[0];
}

// =====================================
// ADICIONAR ITEM AO CARRINHO
// =====================================
export async function adicionarItem(req, res) {
    try {
        const { id_cliente } = req.user;
        const { id_produto, quantidade } = req.body;

        if (!id_produto || !quantidade) {
            return res.status(400).json({ erro: "Produto e quantidade são obrigatórios" });
        }

        const carrinho = await obterOuCriarCarrinho(id_cliente);

        // Verifica se o item já existe
        const itemExistente = await pool.query(
            `SELECT * FROM item_carrinho
             WHERE id_carrinho = $1 AND id_produto = $2`,
            [carrinho.id_carrinho, id_produto]
        );

        if (itemExistente.rows.length > 0) {
            const novaQtd = itemExistente.rows[0].quantidade + quantidade;

            await pool.query(
                `UPDATE item_carrinho 
                 SET quantidade = $1 
                 WHERE id_item = $2`,
                [novaQtd, itemExistente.rows[0].id_item]
            );

            return res.json({ mensagem: "Quantidade atualizada" });
        }

        // Insere item novo
        await pool.query(
            `INSERT INTO item_carrinho (id_carrinho, id_produto, quantidade)
             VALUES ($1, $2, $3)`,
            [carrinho.id_carrinho, id_produto, quantidade]
        );

        res.json({ mensagem: "Item adicionado ao carrinho" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: "Erro no servidor", detalhe: error.message });
    }
}

// =====================================
// LISTAR ITENS DO CARRINHO
// =====================================
export async function listarCarrinho(req, res) {
    try {
        const { id_cliente } = req.user;

        const carrinho = await obterOuCriarCarrinho(id_cliente);

        const itens = await pool.query(
            `SELECT 
                ic.id_item,
                ic.quantidade,
                p.id_produto,
                p.nome,
                p.descricao,
                p.preco,
                p.imagem_url
            FROM item_carrinho ic
            JOIN produto p ON p.id_produto = ic.id_produto
            WHERE ic.id_carrinho = $1`,
            [carrinho.id_carrinho]
        );

        res.json({
            id_carrinho: carrinho.id_carrinho,
            quantidade_itens: itens.rows.length,
            itens: itens.rows
        });

    } catch (error) {
        return res.status(500).json({ erro: "Erro no servidor", detalhe: error.message });
    }
}

// =====================================
// REMOVER ITEM
// =====================================
export async function removerItem(req, res) {
    try {
        const { id_item } = req.params;

        const del = await pool.query(
            `DELETE FROM item_carrinho WHERE id_item = $1`,
            [id_item]
        );

        if (del.rowCount === 0) {
            return res.status(404).json({ erro: "Item não encontrado" });
        }

        res.json({ mensagem: "Item removido com sucesso" });

    } catch (error) {
        res.status(500).json({ erro: "Erro ao remover item", detalhe: error.message });
    }
}
