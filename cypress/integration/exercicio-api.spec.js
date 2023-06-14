/// <reference types="cypress" />
import contrato from '../contracts/usuario.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let email = `mario${Math.floor(Math.random() * 100000)}@gmail.com`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "mario",
                    "email": email,
                    "password": "novo",
                    "administrador": "true"
               },
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               failOnStatusCode: false,
               body: {
                    "nome": "marioo",
                    "email": "mario@gmail.com",
                    "password": "novo",
                    "administrador": "true"
               },
          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[3]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body:
                    {
                         "nome": "tal",
                         "email": "albertinhosss@gmail.com",
                         "password": "159",
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.cadastrarUsuario("usuario novo", "emailaqui@gmail.com", "novo", "false")
          .then(response => {
              let id = response.body._id
              cy.request({
                  method: 'DELETE',
                  url: `usuarios/${id}`,
              }).then(response =>{
                  expect(response.body.message).to.equal('Registro excluído com sucesso')
                  expect(response.status).to.equal(200)
              })
          })
     });


});
