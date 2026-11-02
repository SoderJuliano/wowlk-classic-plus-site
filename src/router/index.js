import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { site } from '../config/site.js'

const auth = (name, path, loader, title) => ({ name, path, component: loader, meta: { title } })

const routes = [
  { name: 'home', path: '/', component: HomeView, meta: { title: site.tagline } },
  auth('register', '/register', () => import('../views/RegisterView.vue'), 'Create Account'),
  auth('register-success', '/register/success', () => import('../views/RegisterSuccessView.vue'), 'Registration Received'),
  auth('login', '/login', () => import('../views/LoginView.vue'), 'Login'),
  auth('forgot-password', '/forgot-password', () => import('../views/ForgotPasswordView.vue'), 'Recover Password'),
  auth('reset-password', '/reset-password', () => import('../views/ResetPasswordView.vue'), 'Reset Password'),
  auth('terms', '/terms', () => import('../views/LegalView.vue'), 'Terms of Use'),
  auth('privacy', '/privacy', () => import('../views/LegalView.vue'), 'Privacy Policy'),
  { name: 'not-found', path: '/:pathMatch(.*)*', component: () => import('../views/NotFoundView.vue'), meta: { title: 'Not Found', noindex: true } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 84 }
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.name === 'home' ? `${site.name} — ${site.tagline}` : `${to.meta.title} · ${site.name}`
  let robots = document.querySelector('meta[name="robots"]')
  if (robots) robots.setAttribute('content', to.meta.noindex || to.query.t ? 'noindex' : 'index,follow')
})

export default router
