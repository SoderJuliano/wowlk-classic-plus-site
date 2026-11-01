import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import RegisterView from '../src/views/RegisterView.vue'
import { MIN_FILL_MS } from '../src/utils/botGuard.js'

const Stub = { template: '<div />' }

async function setup() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Stub },
      { name: 'register', path: '/register', component: RegisterView },
      { name: 'register-success', path: '/register/success', component: Stub },
      { name: 'login', path: '/login', component: Stub },
      { name: 'terms', path: '/terms', component: Stub },
      { name: 'privacy', path: '/privacy', component: Stub }
    ]
  })
  router.push('/register')
  await router.isReady()
  const wrapper = mount(RegisterView, { global: { plugins: [router] }, attachTo: document.body })
  return { wrapper, router }
}

async function fill(wrapper) {
  await wrapper.find('input[name="username"]').setValue('Arthas')
  await wrapper.find('input[name="email"]').setValue('arthas@lordaeron.com')
  await wrapper.find('input[name="emailConfirm"]').setValue('arthas@lordaeron.com')
  await wrapper.find('input[name="password"]').setValue('Frostmourne1')
  await wrapper.find('input[name="passwordConfirm"]').setValue('Frostmourne1')
  await wrapper.find('input[type="checkbox"]').setValue(true)
}

describe('RegisterView', () => {
  let fetchMock
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers({ toFake: ['Date'] })
    fetchMock = vi.fn(async () => new Response('{}', { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })

  it('renders the honeypot off-screen, out of tab order, autocomplete off', async () => {
    const { wrapper } = await setup()
    const hp = wrapper.find('input[name="website"]')
    expect(hp.exists()).toBe(true)
    expect(hp.attributes('tabindex')).toBe('-1')
    expect(hp.attributes('autocomplete')).toBe('off')
    expect(hp.element.closest('.hp-field').getAttribute('aria-hidden')).toBe('true')
  })

  it('drops a bot submission silently — no HTTP request at all', async () => {
    const { wrapper, router } = await setup()
    await fill(wrapper)
    await wrapper.find('input[name="website"]').setValue('http://spam.example')
    vi.setSystemTime(Date.now() + MIN_FILL_MS + 1000)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(wrapper.find('.alert').exists()).toBe(false)
    expect(wrapper.find('.field-error').exists()).toBe(false)
    expect(router.currentRoute.value.name).toBe('register-success')
  })

  it('blocks invalid forms without calling the API', async () => {
    const { wrapper } = await setup()
    vi.setSystemTime(Date.now() + MIN_FILL_MS + 1000)
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(wrapper.findAll('.field-error').length).toBeGreaterThan(0)
  })

  it('queues a valid human registration once', async () => {
    const { wrapper, router } = await setup()
    await fill(wrapper)
    vi.setSystemTime(Date.now() + MIN_FILL_MS + 1000)
    await wrapper.find('form').trigger('submit')
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('register-success'))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).key).toBe('test-registration-key')
  })

  it('shows a clear error when the queue is unreachable', async () => {
    fetchMock.mockImplementation(async () => { throw new TypeError('offline') })
    const { wrapper } = await setup()
    await fill(wrapper)
    vi.setSystemTime(Date.now() + MIN_FILL_MS + 1000)
    await wrapper.find('form').trigger('submit')
    await vi.waitFor(() => expect(wrapper.find('.alert--error').exists()).toBe(true))
    expect(wrapper.find('.alert--error').text()).toMatch(/could not reach/i)
  })
})
