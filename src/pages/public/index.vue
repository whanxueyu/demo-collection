<template>
    <div class="menuList">
        <div class="menu" v-for="menu in state.routerList" :key="menu.path" @click="navto(menu)">{{ menu.meta.name }}</div>
    </div>
    <router-view></router-view>
</template>

<script>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
export default {
    name: 'HelloWorld',
    setup() {
        const state = reactive({
            routerList: []
        })
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

        })
        return {
            state,
            navto
        }
    }
}
</script>
<style>
.menuList {
    display: flex;
    height: 60px;
    line-height: 60px;
    background-color: #409eff22;
}

.menu {
    color: #666;
    margin: 0 60px;
    cursor: pointer;
}

.menu:hover {
    color: #409eff;
}
</style>