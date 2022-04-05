const express = require('express');
const contas = require('./controladores/contas');
const { autenticacaoSenha, autenticacaoSenhaConta } = require('./intermediarios/intermediarios');

const rotas = express();


rotas.get('/contas', autenticacaoSenha, contas.listagemContas);
rotas.post('/contas', contas.criarConta);
rotas.put('/contas/:numeroConta/usuario', contas.atualizarConta);
rotas.delete('/contas/:numeroConta', contas.deletarConta);
rotas.post('/transacoes/depositar', contas.depositoConta);
rotas.post('/transacoes/sacar', contas.saqueConta);
rotas.post('/transacoes/transferir', contas.transferenciaConta);
rotas.get('/contas/saldo', autenticacaoSenhaConta, contas.saldoConta);
rotas.get('/contas/extrato', autenticacaoSenhaConta, contas.solicitarExtrato);




module.exports = rotas;