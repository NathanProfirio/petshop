// FILE: src/routes/carrinhoRoutes.js
import express from 'express';
import authCliente from '../middlewares/authCliente.js';
import { adicionarItemCarrinho, verCarrinho, removerItemCarrinho } from '../controllers/carrinhoController.js';
const router = express.Router();


router.post('/item', authCliente, adicionarItemCarrinho);
router.get('/', authCliente, verCarrinho);
router.delete('/item/:id_item', authCliente, removerItemCarrinho);


export default router;