<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div class="menuList">
                    <div class="menu" v-for="menu in state.routerList" :key="menu.path" @click="navto(menu)">{{
                        menu.meta.name }}</div>
                </div>
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
                    @select="handleSelect">
                    <el-menu-item index="0">LOGO</el-menu-item>
                    <div class="flex-grow" />
                    <el-menu-item index="1">m3u8播放器</el-menu-item>
                    <el-sub-menu index="2">
                        <template #title>360°全景</template>
                        <el-menu-item index="2-1">圆柱投影(equirectangular)</el-menu-item>
                        <el-menu-item index="2-2">立方体投影(cubic)</el-menu-item>
                    </el-sub-menu>
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
export default {
    name: 'HelloWorld',
    setup() {
        const state = reactive({
            routerList: []
        })
        const activeIndex = ref('1')
        const handleSelect = (key, keyPath) => {
            console.log(key, keyPath)
        }
        const router = useRouter()
        const navto = (menu) => {
            router.push(menu.path)
        }
        onMounted(() => {
            let arr = router.getRoutes()
            state.routerList = arr.filter((item) => {
                console.log(item)
                return item.meta.hidden === false
            })
            console.log(state.routerList);
            navto(state.routerList[0])
        })
        return {
            state,
            navto,
            handleSelect,
            activeIndex
        }
    }
}
</script>
<style>
.menuList {
    display: flex;
    height: 60px;
    line-height: 60px;
    /* background-color: #409eff22; */
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
</style>