// FILE: src/routes/carrinhoRoutes.js
import express from 'express';
import authCliente from '../middlewares/authCliente.js';

import {
    adicionarItem,
    listarCarrinho,
    removerItem
} from '../controllers/carrinhoController.js';

const router = express.Router();

router.post('/adicionar', authCliente, adicionarItem);
router.get('/', authCliente, listarCarrinho);
router.delete('/item/:id_item', authCliente, removerItem);

export default router;
