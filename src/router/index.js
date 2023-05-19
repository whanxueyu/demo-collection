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
                name: '/m3u8',
                component: () => import('@/pages/m3u8palyer.vue'),
                meta: {
                    name: 'm3u8播放器',
                    hidden:false
                },
            },
            {
                path: '/myPannel',
                name: '/myPannel',
                component: () => import('@/pages/myPannel.vue'),
                meta: {
                    name: '360°全景',
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