import { pool } from '../config/db.js';

/* ============================
   📌 CRIAR AGENDAMENTO
============================ */
export async function criarAgendamento(req, res) {
    try {
        const { id_cliente } = req.user;
        const { id_servico, data, hora } = req.body;

        if (!id_servico || !data || !hora) {
            return res.status(400).json({ error: "id_servico, data e hora são obrigatórios" });
        }

        const data_hora = `${data} ${hora}:00`;

        const q = `
            INSERT INTO agendamento (id_cliente, id_servico, data_hora, status)
            VALUES ($1, $2, $3, 'pendente')
            RETURNING *
        `;

        const r = await pool.query(q, [id_cliente, id_servico, data_hora]);

        res.json({ sucesso: true, agendamento: r.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar agendamento" });
    }
}

/* ============================
   📌 HORÁRIOS DISPONÍVEIS
============================ */
export async function horariosDisponiveis(req, res) {
    try {
        const { id_servico } = req.params;
        const { data } = req.query;

        if (!data) {
            return res.status(400).json({ error: "A data é obrigatória ?data=AAAA-MM-DD" });
        }

        // 1️⃣ GERA HORÁRIOS DO DIA
        const horarios = [];
        for (let h = 8; h <= 17; h++) {
            horarios.push(`${String(h).padStart(2, '0')}:00`);
        }

        // 2️⃣ INTERVALO DO DIA PARA CONSULTA
        const inicioDia = `${data} 00:00:00`;
        const fimDia = `${data} 23:59:59`;

        // 3️⃣ BUSCA HORÁRIOS OCUPADOS NO BANCO
        const r = await pool.query(`
            SELECT data_hora 
            FROM agendamento 
            WHERE id_servico = $1
            AND data_hora BETWEEN $2 AND $3
            AND status != 'cancelado'
        `, [id_servico, inicioDia, fimDia]);

        // 4️⃣ EXTRAI APENAS AS HORAS OCUPADAS -> "10:00", "14:00" etc.
        const horariosOcupados = r.rows.map(row => {
            const date = new Date(row.data_hora);
            const h = String(date.getHours()).padStart(2, '0');
            return `${h}:00`;
        });

        // 5️⃣ REMOVE HORÁRIOS OCUPADOS
        const disponiveis = horarios.filter(hora => !horariosOcupados.includes(hora));

        return res.json(disponiveis);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao buscar horários" });
    }
}


/* ============================
   📌 LISTAR AGENDAMENTOS DO CLIENTE
============================ */
export async function listarAgendamentosCliente(req, res) {
    try {
        const { id_cliente } = req.user;

        const q = `
            SELECT a.id_agendamento, a.data_hora, a.status, a.id_servico,
                   s.nome AS servico_nome
            FROM agendamento a
            JOIN servico s ON a.id_servico = s.id_servico
            WHERE a.id_cliente = $1
            ORDER BY a.data_hora DESC
        `;

        const r = await pool.query(q, [id_cliente]);
        res.json(r.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar agendamentos do cliente" });
    }
}

/* ============================
   📌 LISTAR AGENDAMENTOS DO PETSHOP
============================ */
export async function listarAgendamentosPetshop(req, res) {
    try {
        const { id_petshop } = req.user;

        const q = `
            SELECT a.id_agendamento, a.data_hora, a.status,
                   c.nome AS cliente_nome,
                   s.nome AS servico_nome
            FROM agendamento a
            JOIN servico s ON a.id_servico = s.id_servico
            JOIN cliente c ON a.id_cliente = c.id_cliente
            WHERE s.id_petshop = $1
            ORDER BY a.data_hora DESC
        `;

        const r = await pool.query(q, [id_petshop]);
        res.json(r.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar agendamentos do petshop" });
    }
}
