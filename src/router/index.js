import Vue from 'vue'
import Router from 'vue-router'
import Player from '@/components/Player'
import Add from '@/components/AddColor'
import All from '@/components/All'
import Fps from '@/components/Fps'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Player',
      component: Player,
      meta: {
        buttons: ['All', 'Add', 'Fps']
      }
    },
    {
      path: '/add',
      name: 'Add',
      component: Add,
      meta: {
        buttons: ['Add']
      }
    },
    {
      path: '/all',
      name: 'All',
      component: All,
      meta: {
        buttons: ['All', 'Add', 'Fps']
      }
    },
    {
      path: '/fps',
      name: 'Fps',
      component: Fps,
      meta: {
        buttons: ['Fps']
      }
    }
  ]
})
