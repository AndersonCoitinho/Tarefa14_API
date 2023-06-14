/// <reference types="cypress" />
import('../support/commands.js');
import contrato from '../contracts/produtos.contract'

describe('Testes da Funcionalidade Produtos', () => {
  let token
  before(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
  });

  it('Deve validar contrato de produtos', () => {
    cy.request('produtos').then(response => {
      return contrato.validateAsync(response.body)
    })
  })


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


  it('Cadastrar produto', () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`
    cy.request({
      method: 'POST',
      url: 'produtos',
      body: {
        "nome": produto,
        "preco": 5300,
        "descricao": "Monitor",
        "quantidade": 5
      },
      headers: { authorization: token },
    }).then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  })

  it('Deve validar mensagem de erro se item for repetido', () => {
    cy.cadastrarProduto(token, 'Produto EBAC 5654452', '250', 'Descricao aqui', '180')
      .then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Já existe produto com esse nome')
      })
  })

  it('Deve editar um produto já cadastrado', () => {
    cy.request('produtos').then(response => {
      let id = response.body.produtos[0]._id
      cy.request({
        method: 'PUT',
        url: `produtos/${id}`,
        headers: { authorization: token },
        failOnStatusCode: false,
        body:
        {
          "nome": "Produto EBAC 509",
          "preco": 100,
          "descricao": "Editado agora",
          "quantidade": 150
        }
      }).then(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });

  it('Deve editar um produto cadastrado previamente', () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`
    cy.cadastrarProduto(token, produto, '250', 'Descricao aqui', '180')
      .then(response => {
        let id = response.body._id

        cy.request({
          method: 'PUT',
          url: `produtos/${id}`,
          headers: { authorization: token },
          body:
          {
            "nome": produto,
            "preco": 500,
            "descricao": "Editado agora mesmo",
            "quantidade": 300
          }
        }).then(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
      })
  })

  it('Deve deletar um produto', () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`
    cy.cadastrarProduto(token, produto, '250', 'Descricao aqui', '180')
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `produtos/${id}`,
          headers: { authorization: token },
        }).then(response => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).to.equal(200)
        })
      })
  })

});
