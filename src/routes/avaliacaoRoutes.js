// FILE: src/routes/avaliacaoRoutes.js
import express from 'express';
import authCliente from '../middlewares/authCliente.js';
import { criarAvaliacao, listarAvaliacoesPetshop } from '../controllers/avaliacaoController.js';
const router = express.Router();


router.post('/', authCliente, criarAvaliacao);
router.get('/:petshopId', listarAvaliacoesPetshop);


export default router;