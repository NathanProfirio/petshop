import express from 'express';
import authCliente from '../middlewares/authCliente.js';
import authPetshop from '../middlewares/authPetshop.js';
import { 
    criarAgendamento, 
    listarAgendamentosCliente,
    horariosDisponiveis, 
    listarAgendamentosPetshop 
} from '../controllers/agendamentoController.js';

const router = express.Router();


// 🔹 Criar agendamento (cliente autenticado)
router.post('/', authCliente, criarAgendamento);

// 🔹 Listar agendamentos do cliente autenticado
router.get('/', authCliente, listarAgendamentosCliente);

// 🔹 Horários disponíveis (público)
router.get('/horarios/:id_servico', horariosDisponiveis);

// 🔹 Agendamentos do petshop logado
router.get('/petshop', authPetshop, listarAgendamentosPetshop);

export default router;
