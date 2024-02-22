import { defineAsyncComponent, h, reactive, ref } from 'vue'
import { Container, createTemplatePlugin, defineTemplate, useTemplate } from '../../src/index'
import DialogConfirmPreview from './DialogConfirmPreview.vue'
import HideOnUnmounted from './HideOnUnmounted.vue'

describe('test useTemplate()', () => {
  it('hello world - createTemplatePlugin', () => {
    const templatePlugin = createTemplatePlugin()
    cy.mount(Container as any, { global: { plugins: [templatePlugin] } }).as('container')

    const text = 'Hello World!'
    const { show, hide } = useTemplate({ component: () => h('div', text) })

    cy.get('@container').then(() => show())
    cy.contains(text).should('exist')

    cy.get('@container').then(() => hide())
    cy.contains(text).should('not.exist')
  })

  it('DialogConfirm - given static attrs', () => {
    const templatePlugin = createTemplatePlugin()
    cy.mount(Container as any, { global: { plugins: [templatePlugin] } }).as('container')

    const title = 'Hello World!'
    const content = 'This is a dialog content.'
    const onConfirm = cy.spy().as('onConfirm')
    const onCancel = cy.spy().as('onCancel')

    const { show, hide } = useTemplate({
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
        default: defineTemplate({ component: () => h('p', content) }),
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

  it('DialogConfirm - given ref props', () => {
    const templatePlugin = createTemplatePlugin()
    cy.mount(Container as any, { global: { plugins: [templatePlugin] } }).as('container')

    const props = ref({ title: 'Hello World!' })
    const content = 'This is a dialog content.'
    const onConfirm = cy.spy().as('onConfirm')
    const onCancel = cy.spy().as('onCancel')

    const { show, hide } = useTemplate({
      component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
      props,
      emits: {
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
        default: defineTemplate({ component: () => h('p', content) }),
      },
    })

    /** Confirm */
    cy.get('@container').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(props.value.title)
    cy.contains('p', content)
    cy.get('@container').then(() => {
      props.value.title = 'Title Changed!'
    })
    cy.get('@container').then(() => {
      cy.contains('Title Changed!')
    })

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

  it('DialogConfirm - given reactive props', () => {
    const templatePlugin = createTemplatePlugin()
    cy.mount(Container as any, { global: { plugins: [templatePlugin] } }).as('container')

    const props = reactive({ title: 'Hello World!' })
    const content = 'This is a dialog content.'
    const onConfirm = cy.spy().as('onConfirm')
    const onCancel = cy.spy().as('onCancel')

    const { show, hide } = useTemplate({
      component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
      props,
      emits: {
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
        default: defineTemplate({ component: () => h('p', content) }),
      },
    })

    /** Confirm */
    cy.get('@container').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(props.title)
    cy.contains('p', content)
    cy.get('@container').then(() => {
      props.title = 'Title Changed!'
    })
    cy.get('@container').then(() => {
      cy.contains('Title Changed!')
    })

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

  it('DialogConfirmPreview', () => {
    const templatePlugin = createTemplatePlugin()
    cy.mount(DialogConfirmPreview, { global: { plugins: [templatePlugin] } }).as('container')

    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@container').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.contains('button', 'Open Modal').click()
    cy.get('@container').then(() => {
      cy.get('dialog').should('exist')
    })
    cy.contains('button', 'Cancel').click()
    cy.get('@container').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.contains('button', 'Open Modal').click()
    cy.get('@container').then(() => {
      cy.get('dialog').should('exist')
    })
  })
})

describe('test useTemplate() options', () => {
  it('hideOnUnmounted: false', () => {
    const templatePlugin = createTemplatePlugin()
    cy.mount(HideOnUnmounted, {
      global: { plugins: [templatePlugin] },
      props: {
        hideOnUnmounted: false,
      },
    }).as('container')

    cy.contains('Hello World!').should('not.exist')

    cy.contains('button', 'Open Modal').click()
    cy.get('@container').then(() => {
      cy.contains('Hello World!').should('exist')
    })

    cy.contains('button', 'Hide OnUnmountedDialog').click()
    cy.get('@container').then(() => {
      cy.contains('Hello World!').should('exist')
    })
  })
  it('hideOnUnmounted: true', () => {
    const templatePlugin = createTemplatePlugin()
    cy.mount(HideOnUnmounted, {
      global: { plugins: [templatePlugin] },
      props: {
        hideOnUnmounted: true,
      },
    }).as('container')

    cy.contains('Hello World!').should('not.exist')

    cy.contains('button', 'Open Modal').click()
    cy.get('@container').then(() => {
      cy.contains('Hello World!').should('exist')
    })

    cy.contains('button', 'Hide OnUnmountedDialog').click()
    cy.get('@container').then(() => {
      cy.contains('Hello World!').should('not.exist')
    })
  })
})
