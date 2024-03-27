import type { Ref } from 'vue'
import { defineAsyncComponent, h, markRaw, reactive, ref } from 'vue'
import type { Template } from '../../src/index'
import { TemplateProvider, defineTemplate, useTemplate } from '../../src/index'
import DialogConfirmPreview from './DialogConfirmPreview.vue'
import HideOnUnmounted from './HideOnUnmounted.vue'
import ShowByDefault from './ShowByDefault.vue'
import NestedTemplateProvider from './NestedTemplateProvider.vue'
import type DialogConfirm from './DialogConfirm.vue'

describe('test <TemplateProvider />', () => {
  it('nested <TemplateProvider /> should only mount once', () => {
    cy.mount(NestedTemplateProvider)

    cy.contains('Hello World!').should('exist')
    cy.get('dialog').should('have.length', 1)
  })
})

describe('test useTemplate()', () => {
  it('hello world - basic useTemplate', () => {
    cy.mount(TemplateProvider as any).as('templateProvider')

    const text = 'Hello World!'
    const { show, hide } = useTemplate({ component: () => h('div', text) })

    cy.get('@templateProvider').then(() => show())
    cy.contains(text).should('exist')

    cy.get('@templateProvider').then(() => hide())
    cy.contains(text).should('not.exist')
  })

  it('DialogConfirm - given static attrs', () => {
    cy.mount(TemplateProvider as any).as('templateProvider')

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
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(title)
    cy.contains('p', content)
    cy.contains('button', 'Confirm').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onConfirm').should('have.callCount', 1)

    /** Cancel */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onCancel').should('have.callCount', 1)
  })

  it('DialogConfirm - given ref props', () => {
    cy.mount(TemplateProvider as any).as('templateProvider')

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
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(props.value.title)
    cy.contains('p', content)
    cy.get('@templateProvider').then(() => {
      props.value.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!')
    })

    cy.contains('button', 'Confirm').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onConfirm').should('have.callCount', 1)

    /** Cancel */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onCancel').should('have.callCount', 1)
  })

  it('DialogConfirm - given reactive props', () => {
    cy.mount(TemplateProvider as any).as('templateProvider')

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
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(props.title)
    cy.contains('p', content)
    cy.get('@templateProvider').then(() => {
      props.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!')
    })

    cy.contains('button', 'Confirm').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onConfirm').should('have.callCount', 1)

    /** Cancel */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.get('@onCancel').should('have.callCount', 1)
  })

  it('DialogConfirm - given ref template', () => {
    cy.mount(TemplateProvider as any).as('templateProvider')

    const template = ref({
      component: markRaw(defineAsyncComponent(() => import('./DialogConfirm.vue'))),
      props: { title: 'Hello World!' },
    }) satisfies Ref<Template<typeof DialogConfirm>>

    const { show } = useTemplate(template)

    /** Confirm */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(template.value.props.title)
    cy.get('@templateProvider').then(() => {
      template.value.props.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!')
    })
  })

  it('DialogConfirm - given reactive template', () => {
    cy.mount(TemplateProvider as any).as('templateProvider')

    const template = reactive({
      component: markRaw(defineAsyncComponent(() => import('./DialogConfirm.vue'))),
      props: { title: 'Hello World!' },
    }) satisfies Template<typeof DialogConfirm>

    const { show } = useTemplate(template)

    /** Confirm */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(template.props.title)
    cy.get('@templateProvider').then(() => {
      template.props.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!')
    })
  })

  it('DialogConfirm - given plain object template', () => {
    cy.mount(TemplateProvider as any).as('templateProvider')

    const template = {
      component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
      props: { title: 'Hello World!' },
    } satisfies Template<typeof DialogConfirm>

    const { show } = useTemplate(template)

    /** Confirm */
    cy.get('@templateProvider').then(() => show())
    cy.get('dialog').should('exist')
    cy.contains(template.props.title)
    cy.get('@templateProvider').then(() => {
      template.props.title = 'Title Changed!'
    })
    cy.get('@templateProvider').then(() => {
      cy.contains('Title Changed!').should('not.exist')
    })
  })

  it('DialogConfirmPreview', () => {
    cy.mount(DialogConfirmPreview).as('templateProvider')

    cy.get('dialog').should('exist')
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.contains('button', 'Open Modal').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('exist')
    })
    cy.contains('button', 'Cancel').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('not.exist')
    })
    cy.contains('button', 'Open Modal').click()
    cy.get('@templateProvider').then(() => {
      cy.get('dialog').should('exist')
    })
  })
})

describe('test useTemplate() options', () => {
  it('showByDefault: false', () => {
    cy.contains('Hello World!').should('not.exist')

    cy.mount(ShowByDefault, {
      props: {
        showByDefault: false,
      },
    }).as('templateProvider')

    cy.contains('Hello World!').should('not.exist')
  })
  it('showByDefault: true', () => {
    cy.contains('Hello World!').should('not.exist')

    cy.mount(ShowByDefault, {
      props: {
        showByDefault: true,
      },
    }).as('templateProvider')

    cy.contains('Hello World!').should('exist')
  })
  it('hideOnUnmounted: false', () => {
    cy.mount(HideOnUnmounted, {
      props: {
        hideOnUnmounted: false,
      },
    }).as('templateProvider')

    cy.contains('Hello World!').should('not.exist')

    cy.contains('button', 'Open Modal').click()
    cy.get('@templateProvider').then(() => {
      cy.contains('Hello World!').should('exist')
    })

    cy.contains('button', 'Hide OnUnmountedDialog').click()
    cy.get('@templateProvider').then(() => {
      cy.contains('Hello World!').should('exist')
    })
  })
  it('hideOnUnmounted: true', () => {
    cy.mount(HideOnUnmounted, {
      props: {
        hideOnUnmounted: true,
      },
    }).as('templateProvider')

    cy.contains('Hello World!').should('not.exist')

    cy.contains('button', 'Open Modal').click()
    cy.get('@templateProvider').then(() => {
      cy.contains('Hello World!').should('exist')
    })

    cy.contains('button', 'Hide OnUnmountedDialog').click()
    cy.get('@templateProvider').then(() => {
      cy.contains('Hello World!').should('not.exist')
    })
  })
})
