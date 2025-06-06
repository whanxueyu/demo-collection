/* eslint-disable */
import { createRouter, createWebHashHistory } from "vue-router";
import pinia from '@/store'
import { useMenu } from '@/store/menu'
const routes = [
    {
        path: '/',
        component: () => import('@/pages/public/index.vue'),
        meta: {
            hidden: true,
            name: 'public'
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
                    hidden: false
                },
            },
            {
                path: '/cesium',
                name: 'cesium',
                component: () => import('@/pages/cesium/index.vue'),
                meta: {
                    name: 'cesium用例',
                    hidden: false
                },
                children: [
                    {
                        path: '/cesium/map',
                        name: 'map',
                        component: () => import('@/pages/cesium/cesium.vue'),
                        meta: {
                            name: '标签图层',
                            hidden: false
                        },
                    },
                    {
                        path: '/cesium/deployment',
                        name: 'deployment',
                        component: () => import('@/pages/cesium/deployment.vue'),
                        meta: {
                            name: '队列部署',
                            hidden: false
                        },
                    },
                    {
                        path: '/cesium/material',
                        name: 'material',
                        component: () => import('@/pages/cesium/material.vue'),
                        meta: {
                            name: '各类材质',
                            hidden: false
                        },
                    },
                    {
                        path: '/cesium/echarts',
                        name: 'echarts',
                        component: () => import('@/pages/cesium/withEcharts.vue'),
                        meta: {
                            name: 'Echarts融合',
                            hidden: false
                        },
                    },
                    {
                        path: '/cesium/particle',
                        name: 'particle',
                        component: () => import('@/pages/cesium/particle.vue'),
                        meta: {
                            name: '粒子效果',
                            hidden: false
                        },
                    },
                ]
            },
            {
                path: '/bigScreen',
                name: 'bigScreen',
                component: () => import('@/pages/bigscreen/bigscreen.vue'),
                meta: {
                    name: '可视化大屏',
                    hidden: false
                },
            },
            {
                path: '/PearOCR',
                name: 'PearOCR',
                component: () => import('@/pages/orc/orc.vue'),
                meta: {
                    name: 'PearOCR',
                    hidden: false
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
                    hidden: false
                },
                children: [
                    {
                        path: '/equirectangular',
                        name: 'equirectangular',
                        component: () => import('@/pages/panoramic/equirectangular.vue'),
                        meta: {
                            name: '圆柱投影',
                            hidden: false
                        },
                    },
                    {
                        path: '/cubic',
                        name: 'cubic',
                        component: () => import('@/pages/panoramic/cubic.vue'),
                        meta: {
                            name: '立方体投影',
                            hidden: false
                        },
                    },
                    {
                        path: '/house',
                        name: 'house',
                        component: () => import('@/pages/panoramic/house.vue'),
                        meta: {
                            name: 'VR看房',
                            hidden: false
                        },
                    }
                ]
            },
            {
                path: '/three',
                name: 'three',
                component: () => import('@/pages/three/index.vue'),
                meta: {
                    name: 'ThreeJS案例',
                    hidden: false
                },
                children: [
                    {
                        path: '/three/wave',
                        name: 'wave',
                        component: () => import('@/pages/three/waveBg/waveBg.vue'),
                        meta: {
                            name: '粒子波浪',
                            hidden: false
                        },
                    },
                    {
                        path: '/three/space',
                        name: 'space',
                        component: () => import('@/pages/three/spaceBg/spaceBg.vue'),
                        meta: {
                            name: '太空背景',
                            hidden: false
                        },
                    },
                ]
            },
            {
                path: '/project',
                name: 'project',
                component: () => import('@/pages/project/index.vue'),
                meta: {
                    name: '项目案例',
                    hidden: false
                },
            },
            {
                path: '/404',
                name: '404',
                component: () => import('@/pages/404/notFound.vue'),
                meta: {
                    hidden: true,
                    name: '404'
                },
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/404/notFound.vue'),
        meta: {
            hidden: true,
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