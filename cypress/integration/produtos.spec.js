/// <reference types="cypress" />
import ('../support/commands.js');

describe('Testes da Funcionalidade Produtos', () => {
  let token
  before(() => {
      cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
  });

  it('Listar Produtos', () => {
    cy.request({
      method: 'GET',
      url: 'produtos'
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('produtos')
        expect(response.duration).to.be.lessThan(15)
      })
    })
  });

  it.only('Cadastrar produto', () => {
    cy.request({
      method: 'POST',
      url: 'produtos',
      body: {
        "nome": "Monitor DELL Ultra",
        "preco": 5300,
        "descricao": "Monitor",
        "quantidade": 5
      },
      headers: {authorization: token}, 
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  });