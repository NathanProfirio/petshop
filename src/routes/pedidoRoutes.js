// FILE: src/routes/pedidoRoutes.js
import express from 'express';
import authCliente from '../middlewares/authCliente.js';
import { checkout, listarPedidosCliente } from '../controllers/pedidoController.js';
const router = express.Router();


router.post('/checkout', authCliente, checkout);
router.get('/meus', authCliente, listarPedidosCliente);


export default router;