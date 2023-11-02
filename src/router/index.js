// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store';


// Middleware para verificar la autenticación del usuario
const isAuthenticated = (to, from, next) => {
  console.log(store.getters.getUserData);
  // Verifica si el usuario está autenticado y tiene información en el almacenamiento
  if (store.getters.getUserData.rol !== null && store.getters.getUserData.name !== null && store.getters.getUserData.email !== null) {
    if(store.getters.getUserData.rol!="Paciente"){
      next(); // Permite el acceso a la ruta
    }else{
      // Redirige al usuario a la página de inicio de sesión
      next({ name: 'Login' });
    }
  } else {
    // Redirige al usuario a la página de inicio de sesión
    next({ name: 'Login' });
  }
};


const routes = [

  // RUTA DE LA PAGINA DE LOGIN
  
  {
    path: '/',
    component: () => import('@/layouts/login/Default.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/LoginView.vue'),
      }
    ],
  },

  // RUTA DE LA PAGINA DE HOME

  {
    path: '/home',
    component: () => import('@/layouts/home/DefaultHome.vue'),
    beforeEnter: isAuthenticated, // Usa el middleware para verificar la autenticación
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
      },
      {
        path: '/tools',
        name: 'Tools',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ToolsView.vue'),
      },
      {
        path: '/preview',
        name: 'Preview',
        component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
      }
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
