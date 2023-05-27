import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
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
            {
                path: '/m3u8',
                name: 'm3u8',
                component: () => import('@/pages/player/m3u8palyer.vue'),
                meta: {
                    name: 'm3u8播放器',
                    hidden:false
                },
            },
            {
                path: '/panoramic',
                name: 'panoramic',
                component: () => import('@/pages/panoramic/index.vue'),
                meta: {
                    name: 'Pannellum 全景VR',
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
                            name: '看房',
                            hidden:false
                        },
                    },
                ]
            },
            {
                path: '/aframe',
                name: 'aframe',
                component: () => import('@/pages/aFrame/index.vue'),
                meta: {
                    name: 'AFrame_VR',
                    hidden:false
                },
                children:[
                    {
                        path: '/aframebox',
                        name: 'aframebox',
                        component: () => import('@/pages/aFrame/aframe.vue'),
                        meta: {
                            name: 'Aframe 动画',
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
            {
                path: '/cesium',
                name: 'cesium',
                component: () => import('@/pages/cesium/cesium.vue'),
                meta: {
                    name: 'cesium 地图',
                    hidden:false
                },
            },
        ]
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