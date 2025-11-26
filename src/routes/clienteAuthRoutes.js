// FILE: src/routes/clienteAuthRoutes.js
import express from 'express';
import { registrarCliente, loginCliente } from '../controllers/authClienteController.js';

const router = express.Router();
    
router.post('/registrar', registrarCliente);
router.post('/login', loginCliente);

export default router;
