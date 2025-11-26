import express from "express";
import authPetshop from "../middlewares/authPetshop.js";

import {
    criarServico,
    listarServicosPetshop,
    listarServicosPublic,
    atualizarServico,
    removerServico,
    obterServico   // <-- IMPORTANTE
} from "../controllers/servicoController.js";

const router = express.Router();

// 📌 Lista pública (todos podem ver)
router.get("/", listarServicosPublic);

// 📌 Lista apenas do petshop autenticado
router.get("/meus", authPetshop, listarServicosPetshop);

// 📌 Obter 1 serviço específico (necessário para tela de edição)
router.get("/:id", authPetshop, obterServico);  // <-- ROTA QUE FALTAVA

// 📌 Criar serviço
router.post("/", authPetshop, criarServico);

// 📌 Atualizar serviço
router.put("/:id", authPetshop, atualizarServico);

// 📌 Remover serviço
router.delete("/:id", authPetshop, removerServico);

export default router;

