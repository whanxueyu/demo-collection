import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
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
                component: () => import('@/pages/aFrame/aframe.vue'),
                meta: {
                    name: 'A-frame 全景图',
                    hidden:false
                },
            },
        ]
    }

]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router