// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store';

/*
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
*/

// Middleware para verificar la autenticación del usuario
const isAuthenticated = (to, from, next) => {
  const userData = store.getters.getUserData;

  // Verifica si el usuario está autenticado y tiene información en el almacenamiento
  if (userData.rol !== null && userData.name !== null && userData.email !== null) {
    // Permite el acceso a todas las rutas para los administradores
    if (userData.rol === "Administrador") {
      next();
    } else if (userData.rol === "Paciente") {
      // Redirige al usuario a la página de inicio de sesión si es paciente
      next({ name: 'Login' });
    } else if (userData.rol === "Medico") {
      // Solo permite el acceso a las rutas 'Preview' y 'Users' para los médicos
      if (to.name === 'Preview' || to.name === 'Users' || to.name === "Home") {
        next();
      } else {
        // Almacena la ruta actual antes de redirigir al usuario
        const redirectRoute = from.fullPath;
        // Redirige al usuario a la página de inicio de sesión con la información de la ruta actual
        next({ name: 'Login', query: { redirect: redirectRoute } });
      }
    }
  } else {
    // Almacena la ruta actual antes de redirigir al usuario
    const redirectRoute = from.fullPath;

    // Redirige al usuario a la página de inicio de sesión con la información de la ruta actual
    next({ name: 'Login', query: { redirect: redirectRoute } });
  }
};



const routes = [

  // RUTA DEL LAYOUT DE LOGIN

  {
    path: '/',
    component: () => import('@/layouts/login/LoginLayout.vue'),
    // RUTA DE LAS VISTAS DEL LAYOUT DE LOGIN
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/LoginView.vue'),
      }
    ],
  },

  // RUTA DEL LAYOUT DE HOME
  {
    path: '/home',
    component: () => import('@/layouts/home/HomeLayout.vue'),
    beforeEnter: isAuthenticated, // Usa el middleware para verificar la autenticación
    // RUTA DE LAS VISTAS DEL LAYOUT DE HOME
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/UserView.vue'),
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "home" */ '@/views/UserView.vue'),
      },
      {
        path: '/tools',
        name: 'Tools',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ToolsView.vue'),
      },
      {
        path: '/preview',
        name: 'Preview',
        component: () => import(/* webpackChunkName: "home" */ '@/views/UserView.vue'),
      }
    ],
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
