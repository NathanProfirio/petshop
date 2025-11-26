import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import petshopAuthRoutes from "./src/routes/petshopAuthRoutes.js";
import clienteAuthRoutes from "./src/routes/clienteAuthRoutes.js";
import produtoRoutes from "./src/routes/produtoRoutes.js";
import servicoRoutes from "./src/routes/servicoRoutes.js";
import agendamentoRoutes from "./src/routes/agendamentoRoutes.js";
import carrinhoRoutes from "./src/routes/carrinhoRoutes.js";
import pedidoRoutes from "./src/routes/pedidoRoutes.js";
import avaliacaoRoutes from "./src/routes/avaliacaoRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));
app.post("/teste", (req, res) => {
    console.log("BODY RECEBIDO:", req.body);
    res.json({
        mensagem: "Rota de teste funcionando!",
        bodyRecebido: req.body
    });
});



app.get('/', (req, res) => res.json({ ok: true, message: 'API Petshop Marketplace' }));


app.use('/petshop', petshopAuthRoutes);
app.use('/cliente', clienteAuthRoutes);
app.use('/produto', produtoRoutes);
app.use('/servico', servicoRoutes);
app.use('/agendamento', agendamentoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/avaliacao', avaliacaoRoutes);



app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));