import express from 'express';
import authCliente from '../middlewares/authCliente.js';
import { criarAgendamento, listarAgendamentosCliente } from '../controllers/agendamentoController.js';
const router = express.Router();


router.post('/', authCliente, criarAgendamento);
router.get('/meus', authCliente, listarAgendamentosCliente);


export default router;