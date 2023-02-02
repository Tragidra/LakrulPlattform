import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: '/',
    label: 'Мои работы',
    name: 'home',
    show: true,
    component: Home
  }, {
    path: '/covid',
    label: 'Задачи',
    name: 'covid',
    show: true,
    component: () => import(/* webpackChunkName: "CovidPapers" */ '../views/CovidPapers.vue')
  },{
    path: '/publications',
    label: 'LaKrul',
    name: 'publications',
    show: true,
    component: () => import(/* webpackChunkName: "Publications" */ '../views/Publications.vue')
  }, {
    path: '/publication/:p(.*)',
    label: 'Publication',
    name: 'publication',
    show: false,
    component: () => import(/* webpackChunkName: "Publication" */ '../views/Publication.vue')
  }, {
    path: '/authors',
    label: 'Статистика',
    name: 'authors',
    show: true,
    component: () => import(/* webpackChunkName: "Authors" */ '../views/Authors.vue')
  }, {
    path: '/author/:id',
    label: 'Author',
    name: 'author',
    show: false,
    component: () => import(/* webpackChunkName: "Author" */ '../views/Author.vue')
  }, {
    path: '/fieldsOfStudy',
    label: 'Работа с Данными',
    name: 'fieldsOfStudy',
    show: true,
    component: () => import(/* webpackChunkName: "FieldsOfStudy" */ '../views/FieldsOfStudy.vue')
  }, {
    path: '/fieldOfStudy/:id',
    label: 'Field of Study',
    name: 'fieldOfStudy',
    show: false,
    component: () => import(/* webpackChunkName: "FieldsOfStudy" */ '../views/FieldOfStudy.vue')
  }, {
    path: '/about',
    label: 'Настройки',
    name: 'about',
    show: true,
    component: () => import(/* webpackChunkName: "About" */ '../views/About.vue')
  }, {
    path: '/:pathMatch(.*)*',
    label: 'NotFound',
    name: 'notFound',
    show: false,
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (from.query.time && !to.query.time) {
    next({path: to.path, query: {time: from.query.time}})
  }
  next();
});

export default router
