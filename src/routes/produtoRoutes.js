// FILE: src/routes/produtoRoutes.js
import express from 'express';
import authPetshop from '../middlewares/authPetshop.js';
import multer from '../config/multer.js';
import { pool } from '../config/db.js';

import {
    criarProduto,
    listarProdutos,
    atualizarProduto,
    removerProduto,
    listarProdutosDoPetshop
} from '../controllers/produtoController.js';

const router = express.Router();

// LISTAR TODOS OS PRODUTOS (público)
router.get('/', listarProdutos);

// LISTAR APENAS OS PRODUTOS DO PETSHOP LOGADO
router.get('/meus', authPetshop, listarProdutosDoPetshop);

// PEGAR PRODUTO ESPECÍFICO POR ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM produto WHERE id_produto = $1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error("Erro ao buscar produto:", err);
        res.status(500).json({ error: "Erro ao buscar produto" });
    }
});

// CRIAR PRODUTO (somente petshop autenticado)
router.post('/', authPetshop, multer.single('imagem'), criarProduto);

// ATUALIZAR PRODUTO (somente o dono do produto)
router.put('/:id', authPetshop, multer.single('imagem'), atualizarProduto);


// DELETAR PRODUTO (somente o dono)
router.delete('/:id', authPetshop, removerProduto);

export default router;
