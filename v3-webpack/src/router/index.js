import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About.vue'),
      },
      {
        path: '/hello-kitty',
        name: 'HelloKitty',
        component: () => import('@/components/HelloWorld.vue'),
      },
      {
        path: '/others',
        name: 'Others',
        component: () => import('@/views/Others.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
