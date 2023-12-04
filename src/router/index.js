import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardView from '../views/DashboardView.vue' 
import UsersView from '../views/UsersView.vue'  
import CompanyView from '../views/CompanyView.vue'  
import BookView from '../views/BookView.vue'  
import RentView from '../views/RentView.vue'  

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/Users',
    name: 'Users',
    component: UsersView
  },

  {
    path: '/Company',
    name: 'Company',
    component: CompanyView
  },

  {
    path: '/Book',
    name: 'Book',
    component: BookView
  },

  {
    path: '/Rent',
    name: 'Rent',
    component: RentView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
