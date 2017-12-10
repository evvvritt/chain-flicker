import Vue from 'vue'
import Router from 'vue-router'
import Player from '@/components/Player'
import Add from '@/components/AddColor'
import All from '@/components/All'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Player',
      component: Player
    },
    {
      path: '/add',
      name: 'Add',
      component: Add
    },
    {
      path: '/all',
      name: 'All',
      component: All
    }
  ]
})
