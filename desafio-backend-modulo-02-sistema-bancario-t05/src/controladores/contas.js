let { contas, depositos, saques, transferencias } = require('../bancodedados');
const { format } = require('date-fns');

const listagemContas = (req, res) => {
    res.status(200).json(contas);
}

let novoNumero = 1;
const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O nome é obrigatório" });
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: "O CPF é obrigatório" });
    }

    for (let item of contas) {
        if (item.usuario.cpf === cpf) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o CPF informado." })

        }
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "A data de nascimento é obrigatória" });
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: "O telefone é obrigatório" });
    }
    if (!email) {
        return res.status(400).json({ mensagem: "O email é obrigatório" });
    }

    for (let item of contas) {
        if (item.usuario.email === email) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o email informado." })
        }
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "A senha é obrigatória" });
    }

    const novaConta = {
        numero: novoNumero++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }
    contas.push(novaConta);
    return res.status(201).send();
}

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O nome é obrigatório" });
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: "O CPF é obrigatório" });
    }

    for (let item of contas) {
        if (item.usuario.cpf === cpf) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o CPF informado." })

        }
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "A data de nascimento é obrigatória" });
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: "O telefone é obrigatório" });
    }
    if (!email) {
        return res.status(400).json({ mensagem: "O email é obrigatório" });
    }

    for (let item of contas) {
        if (item.usuario.email === email) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o email informado." })
        }
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "A senha é obrigatória" });
    }

    const contaModificada = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!contaModificada) {
        return res.status(400).json({ mensagem: "O número da conta é inválido" });
    }


    contaModificada.usuario.nome = nome;
    contaModificada.usuario.cpf = cpf;
    contaModificada.usuario.data_nascimento = data_nascimento;
    contaModificada.usuario.telefone = telefone;
    contaModificada.usuario.email = email;
    contaModificada.usuario.senha = senha;

    return res.status(204).send();
}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (!conta) {
        return res.status(404).json({ mensagem: "O número da conta é inválido" });
    }

    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta possui saldo, portanto não poderá ser deletada" });
    }


    contas = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta);
    })

    return res.status(200).send();
}

const depositoConta = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!conta) {
        return res.status(404).json({ mensagem: "O número da conta é inválido" });
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "O valor precisa ser maior que zero" })
    }

    conta.saldo += Number(valor);

    const novoDeposito = {
        data: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
        numero_conta,
        valor
    }
    depositos.push(novoDeposito);

    return res.status(201).json(novoDeposito);
}

const saqueConta = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "O número da conta, o valor e a senha são obrigatórios!" });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!conta) {
        return res.status(404).json({ mensagem: "O número da conta é inválido" });
    }
    if (conta.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: "A senha informada é inválida para esta conta" });
    }
    if (Number(valor) < 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" })
    }
    if (conta.saldo < Number(valor)) {
        return res.status(400).json({ mensagem: "O saldo da conta é inferior ao valor solicitado" })
    }

    conta.saldo -= Number(valor);

    const novoSaque = {
        data: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
        numero_conta,
        valor
    }

    saques.push(novoSaque);
    return res.status(204).send();
}

const transferenciaConta = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "Os números da contas, o valor e a senha são obrigatórios!" });
    }

    const conta_origem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)
    })

    if (!conta_origem) {
        return res.status(404).json({ mensagem: "O número da conta de origem é inválido" });
    }

    const conta_destino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)
    })

    if (!conta_destino) {
        return res.status(404).json({ mensagem: "O número da conta de destino é inválido" })
    }

    if (conta_origem.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: "A senha informada é inválida para esta conta" });
    }

    if (conta_origem.saldo < Number(valor)) {
        return res.status(400).json({ mensagem: "O saldo da conta é inferior ao valor solicitado para transferência" })
    }

    conta_origem.saldo -= Number(valor);
    conta_destino.saldo += Number(valor);

    const novaTransferencia = {
        data: format(new Date(), "yyyy-MM-dd' 'HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }
    transferencias.push(novaTransferencia);

    return res.status(204).send();
}

const saldoConta = (req, res) => {
    const { numero_conta } = req.query;
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    });

    return res.status(200).json(conta.saldo);
}

const solicitarExtrato = (req, res) => {
    const { numero_conta } = req.query;

    const extrato = {
        depositos: [],
        saques: [],
        transferenciasEnviadas: [],
        transferenciasRecebidas: []
    }

    for (let item of depositos) {
        if (item.numero_conta === Number(numero_conta)) {
            extrato.depositos.push(item);
        }
    }

    for (let item of saques) {
        if (item.numero_conta === Number(numero_conta)) {
            extrato.saques.push(item);
        }
    }
    for (let item of transferencias) {
        if (item.numero_conta_origem === Number(numero_conta)) {
            extrato.transferenciasEnviadas.push(item);
        }
        if (item.numero_conta_destino === Number(numero_conta)) {
            extrato.transferenciasRecebidas.push(item);
        }
    }
    return res.status(200).json(extrato);
}


module.exports = {
    listagemContas,
    criarConta,
    atualizarConta,
    deletarConta,
    depositoConta,
    saqueConta,
    transferenciaConta,
    saldoConta,
    solicitarExtrato
}