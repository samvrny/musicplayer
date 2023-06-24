import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Manage from '@/views/Manage.vue';
import useUserStore from '@/stores/user';

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
    beforeEnter: (to, from, next) => { //this is an example of a route specific guard
      next()
    },
    meta: {
      requiresAuth: true,
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
  linkExactActiveClass: 'text-yellow-400'
});

//this is an example of global router guards.
router.beforeEach((to, from, next) => {
  //if the path/route does not have the requiresAuth meta rule, render the route
  if(!to.meta.requiresAuth) {
    next();
    return;
  } 

  const store = useUserStore();

  //if a user is logged in, render the guarded route. If they aren't, send them to the home page
  if(store.userLoggedIn) {
    next();
    return;
  } else {
    next({ name: 'home' });
  }

});

export default router;
