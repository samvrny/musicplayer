import './assets/main.css';
import './assets/base.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VeeValidatePlugin from './includes/validation';
import { auth } from './includes/firebase';
import Icon from './directives/icon';
import { registerSW } from 'virtual:pwa-register';
import GlobalComponents from './includes/_globals';

registerSW({ immediate: true });

let app;

//checking firebase for a state change (whether a user is logged in or not)
auth.onAuthStateChanged(() => {
    //if the Vue app has not already been initialized, initialize it
    if (!app) {
        app = createApp(App);

        app.use(createPinia());
        app.use(router);
        app.use(VeeValidatePlugin);
        app.use(GlobalComponents)
        app.directive('icon', Icon);
    
        app.mount('#app');
    }
});
