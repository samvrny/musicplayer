import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Manage from '@/views/Manage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/manage-music',
    // alias: ['/manage', '/boxcar'], //this is just an example of an alias.
    name: 'manage',
    component: Manage,
    beforeEnter: (to, from, next) => {
      console.log('Manage Guard')

      next()
    }
  },
  {
    path: '/manage',
    redirect: { name: 'manage' }
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
});

router.beforeEach((to, from, next) => {
  console.log('Global Guard')

  next()
});

export default router;
