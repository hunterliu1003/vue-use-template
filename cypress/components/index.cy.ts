import { h } from 'vue'
import { createContainer } from '../../src/index'

describe('test useTemplate()', () => {
  it('should be closed by default', () => {
    const { Container, useTemplate } = createContainer()
    cy.mount(Container).as('container')

    const { show, hide } = useTemplate({
      component: () => h('div', 'Hello World!'),
    })

    cy.get('@container').then(() => show())
    cy.contains('Hello World!').should('exist')

    cy.get('@container').then(() => hide())
    cy.contains('Hello World!').should('not.exist')
  })
})
