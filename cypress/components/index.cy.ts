import { defineAsyncComponent, h } from 'vue'
import { Container, createContainer, defineTemplate, useTemplate } from '../../src/index'

describe('test useTemplate()', () => {
  it('hello world - useTemplate and Container', () => {
    cy.mount(Container as any).as('container')

    const text = 'Hello World!'
    const { show, hide } = useTemplate({
      component: () => h('div', text),
    })

    cy.get('@container').then(() => show())
    cy.contains(text).should('exist')

    cy.get('@container').then(() => hide())
    cy.contains(text).should('not.exist')
  })
  it('hello world - createContainer', () => {
    const { Container: _Container, useTemplate: _useTemplate } = createContainer()
    cy.mount(_Container as any).as('container')

    const text = 'Hello World!'
    const { show, hide } = _useTemplate({
      component: () => h('div', text),
    })

    cy.get('@container').then(() => show())
    cy.contains(text).should('exist')

    cy.get('@container').then(() => hide())
    cy.contains(text).should('not.exist')
  })

  it('DialogConfirm', () => {
    const { Container: _Container, useTemplate: _useTemplate } = createContainer()
    cy.mount(_Container as any).as('container')

    const title = 'Hello World!'
    const content = 'This is a dialog content.'
    const onConfirm = cy.spy().as('onConfirm')
    const onCancel = cy.spy().as('onCancel')

    const { show, hide } = _useTemplate({
      component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
      attrs: {
        title,
        onConfirm: () => {
          onConfirm()
          hide()
        },
        onCancel: () => {
          onCancel()
          hide()
        },
      },
      slots: {
        default: defineTemplate({
          component: () => h('p', content),
        }),
      },
    })

    /** Confirm */
    cy.get('@container').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(title)
    cy.contains('p', content)
    cy.contains('button', 'Confirm').click()
    cy.get('@container').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onConfirm').should('have.callCount', 1)

    /** Cancel */
    cy.get('@container').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@container').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onCancel').should('have.callCount', 1)
  })
})
