/* eslint-disable */
import { createRouter, createWebHashHistory } from "vue-router";
import pinia from '@/store'
import { useMenu } from '@/store/menu'
const routes = [
    {
        path: '/',
        component: () => import('@/pages/public/index.vue'),
        meta: {
            hidden:true,
            name:'public'
        },
        children: [
            // {
            //     path: '/playground',
            //     name: 'playground',
            //     component: () => import('@/pages/playground/playground.vue'),
            //     meta: {
            //         name: '编辑器',
            //         hidden:false
            //     },
            // },
            {
                path: '/home',
                name: 'home',
                component: () => import('@/pages/home/home.vue'),
                meta: {
                    name: '首页',
                    hidden:false
                },
            },
            {
                path: '/bigScreen',
                name: 'bigScreen',
                component: () => import('@/pages/bigscreen/bigscreen.vue'),
                meta: {
                    name: '可视化大屏',
                    hidden:false
                },
            },
            {
                path: '/PearORC',
                name: 'PearORC',
                component: () => import('@/pages/orc/orc.vue'),
                meta: {
                    name: 'PearORC',
                    hidden:false
                },
            },
            // {
            //     path: '/m3u8',
            //     name: 'm3u8',
            //     component: () => import('@/pages/player/m3u8palyer.vue'),
            //     meta: {
            //         name: 'm3u8播放器',
            //         hidden:true
            //     },
            // },
            {
                path: '/panoramic',
                name: 'panoramic',
                component: () => import('@/pages/panoramic/index.vue'),
                meta: {
                    name: '全景VR',
                    hidden:false
                },
                children:[
                    {
                        path: '/equirectangular',
                        name: 'equirectangular',
                        component: () => import('@/pages/panoramic/equirectangular.vue'),
                        meta: {
                            name: '圆柱投影',
                            hidden:false
                        },
                    },
                    {
                        path: '/cubic',
                        name: 'cubic',
                        component: () => import('@/pages/panoramic/cubic.vue'),
                        meta: {
                            name: '立方体投影',
                            hidden:false
                        },
                    },
                    {
                        path: '/house',
                        name: 'house',
                        component: () => import('@/pages/panoramic/house.vue'),
                        meta: {
                            name: 'VR看房',
                            hidden:false
                        },
                    },
                    {
                        path: '/aframehouse',
                        name: 'aframehouse',
                        component: () => import('@/pages/aFrame/aframehouse.vue'),
                        meta: {
                            name: 'Aframe 房间',
                            hidden:false
                        },
                    },
                ]
            },
            // {
            //     path: '/aframe',
            //     name: 'aframe',
            //     component: () => import('@/pages/aFrame/index.vue'),
            //     meta: {
            //         name: 'AFrame_VR',
            //         hidden:false
            //     },
            //     children:[
            //         {
            //             path: '/aframebox',
            //             name: 'aframebox',
            //             component: () => import('@/pages/aFrame/aframe.vue'),
            //             meta: {
            //                 name: 'Aframe 动画',
            //                 hidden:false
            //             },
            //         },
            //         {
            //             path: '/aframehouse',
            //             name: 'aframehouse',
            //             component: () => import('@/pages/aFrame/aframehouse.vue'),
            //             meta: {
            //                 name: 'Aframe 房间',
            //                 hidden:false
            //             },
            //         },
            //     ]
            // },
            {
                path: '/cesium',
                name: 'cesium',
                component: () => import('@/pages/cesium/index.vue'),
                meta: {
                    name: 'cesium 地图',
                    hidden:false
                },
                children:[
                    {
                        path: '/map',
                        name: 'map',
                        component: () => import('@/pages/cesium/cesium.vue'),
                        meta: {
                            name: '地图功能',
                            hidden:false
                        },
                    },
                    {
                        path: '/deployment',
                        name: 'deployment',
                        component: () => import('@/pages/cesium/deployment.vue'),
                        meta: {
                            name: '队列计算',
                            hidden:false
                        },
                    },
                    {
                        path: '/imagery',
                        name: 'imagery',
                        component: () => import('@/pages/cesium/imageryLayer.vue'),
                        meta: {
                            name: '图层编辑',
                            hidden:false
                        },
                    },
                ]
            },
        ]
    },
    {
        path: '/404',
        name:'404',
        component: () => import('@/pages/404/notFound.vue'),
        meta: {
            hidden:true,
            name:'404'
        },
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/404/notFound.vue'),
        meta: {
            hidden:true,
        },
    }
]
const menu = useMenu(pinia)
menu.routes = routes[0].children
menu.activeIndex = routes[0].children[0].path
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router