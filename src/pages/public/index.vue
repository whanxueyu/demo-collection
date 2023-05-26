<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-menu :default-active="menu.activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
                    @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item index="0">LOGO</el-menu-item>
                    <div class="flex-grow" />
                    <template v-for="menu in menu.routes" :key="menu.path">
                        <el-sub-menu :index="menu.path" v-if="menu.children && menu.children.length">
                            <template #title>
                                <span>{{ menu.meta.name }}</span>
                            </template>
                            <template v-for="item in menu.children" :key="item.path">
                                <el-menu-item :index="item.path" @click="navto(item)">
                                    <span>{{ item.meta.name }}</span>
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                        <el-menu-item :index="menu.path" @click="navto(menu)" v-else>
                            <span>{{ menu.meta.name }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenu } from '@/store/menu'
export default {
    name: 'public',
    setup() {
        const state = reactive({
            routerList: []
        })
        const activeIndex = ref('1')
        const menu = useMenu()
        const handleSelect = (key, keyPath) => {
            console.log(key, keyPath)
        }
        const router = useRouter()
        const navto = (item) => {
            router.push(item.path)
            menu.activeIndex = item.path
        }
        onMounted(() => {
            let currentPath = router.currentRoute.value.path
            if(currentPath==="/"){
                router.push('/m3u8')
                menu.activeIndex = '/m3u8'
            }else{
                menu.activeIndex = currentPath
            }
        })
        return {
            state,
            navto,
            handleSelect,
            activeIndex,
            menu
        }
    }
}
</script>
<style>
.menuList {
    display: flex;
    height: 60px;
    line-height: 60px;
}

.menu {
    color: #666;
    margin: 0 60px;
    cursor: pointer;
}

.menu:hover {
    color: #409eff;
}

.flex-grow {
    flex-grow: 1;
}

.el-menu-demo {
    overflow-x: auto;
}
</style>