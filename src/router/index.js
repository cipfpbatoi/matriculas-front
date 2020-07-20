import Vue from 'vue'
import VueRouter from 'vue-router'
import Enrollments from '../views/Enrollments.vue'
import Processes from '../views/Processes.vue'
import Login from '@/views/Login'

Vue.use(VueRouter)

const ifAuthenticated = ((to, from, next) => {
    if (localStorage.token) {
      next();
    } else {
      next({ name: 'login', params: { redirectTo: to.path } });
    }
});

const routes = [
  {
    path: '/',
    name: 'enrollments',
    component: Enrollments,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/enrollments/process/:process',
    name: 'enrollmentsperprocess',
    component: Enrollments,
    props: true,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/enrollments/process/:process/status/:status',
    name: 'enrollmentsperprocessstatus',
    component: Enrollments,
    props: true,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/enrollments/status/:status',
    name: 'enrollmentsperstatus',
    component: Enrollments,
    props: true,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/processes',
    name: 'processes',
    component: Processes,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
