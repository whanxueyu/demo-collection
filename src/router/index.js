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
                    name: '360°全景',
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
                ]
            },
        ]
    }

]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router