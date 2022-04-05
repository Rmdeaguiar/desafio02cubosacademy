const { contas } = require('../bancodedados');

const autenticacaoSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(401).json({ mensagem: "Você precisa inserir uma senha" })
    }

    if (senha_banco !== 'Cubos123Bank') {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    }

    next();
}

const autenticacaoSenhaConta = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(401).json({ mensagem: "Você precisa inserir o número da conta e a respectiva senha" });
    }
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })

    if (!conta) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: "A senha informada para a é inválida" });
    }

    next();
}

module.exports = {
    autenticacaoSenha,
    autenticacaoSenhaConta
}