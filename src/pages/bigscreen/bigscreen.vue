<template>
    <div class="bigdata">
        <div class="side">
            <el-icon :class="state.showAll?'star active':'star'" size="40px" @click="state.showAll = !state.showAll">
                <svg t="1685694092016" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2384" width="128" height="128"><path d="M643.072 380.928v262.144H380.928V380.928h262.144z m65.536 0h196.608v262.144H708.608V380.928z m-65.536 524.288H380.928V708.608h262.144v196.608z m65.536 0V708.608h196.608v196.608H708.608z m-65.536-786.432v196.608H380.928V118.784h262.144z m65.536 0h196.608v196.608H708.608V118.784zM315.392 380.928v262.144H118.784V380.928h196.608z m0 524.288H118.784V708.608h196.608v196.608z m0-786.432v196.608H118.784V118.784h196.608z" p-id="2385"></path></svg>
            </el-icon>
            <div class="filelist">
                <div :class="state.url === file.path ? 'active cell' : 'cell'" v-for="file in state.fileList"
                    :key="file.path" @click="clickFile(file)">{{ file.name }}</div>
            </div>
        </div>
        <div class="frame" v-if="state.showAll">
            <div class="cardList">
                <el-card :class="state.url === file.path ? 'active card' : 'card'" :body-style="{ padding: '0px' }" v-for="file in state.fileList" :key="file.path" @click="clickFile(file)">
                    <img :src="file.img" class="image" />
                    <div style="padding: 14px">
                        <span>{{ file.name }}</span>
                    </div>
                </el-card>
            </div>
        </div>
        <iframe class="frame" v-else :src="state.url"></iframe>
    </div>
</template>
  
<script>
import { onMounted, reactive, ref } from 'vue'
export default {
    name: 'bigScreen',
    setup() {
        const list = ref([])
        const state = reactive({
            showAll: true,
            url: './html/example/index.html',
            fileList: [
                {
                    name: '通用模板',
                    path: './html/example/index.html',
                    img: './html/example/preview.png'
                },
                {
                    name: '智慧工地',
                    path: './html/smartsite/index.html',
                    img: './html/smartsite/preview.png'
                },
                {
                    name: '电子商务',
                    path: './html/e-Buniness/index.html',
                    img: './html/e-Buniness/preview.png'
                },
                {
                    name: '交通管控',
                    path: './html/traffic/index.html',
                    img: './html/traffic/preview.png'
                },
                {
                    name: '智慧旅游',
                    path: './html/travel/index.html',
                    img: './html/travel/preview.png'
                },
                {
                    name: '智慧天气',
                    path: './html/weather/index.html',
                    img: './html/weather/preview.png'
                },
                {
                    name: '智慧物联',
                    path: './html/IoT/index.html',
                    img: './html/IoT/preview.png'
                },
                {
                    name: '新能源车',
                    path: './html/vehicle/index.html',
                    img: './html/vehicle/preview.png'
                },
                {
                    name: '智慧物流',
                    path: './html/logistics/index.html',
                    img: './html/logistics/preview.png'
                },
                {
                    name: '环境监测',
                    path: './html/environment/index.html',
                    img: './html/environment/preview.png'
                },
                {
                    name: '厅店运营',
                    path: './html/restaurant/index.html',
                    img: './html/restaurant/preview.png'
                },
                {
                    name: '舆情分析',
                    path: './html/opinion/public.html',
                    img: './html/opinion/preview.png'
                },
            ]
        })
        const clickFile = (file) => {
            state.url = file.path
            state.showAll = false
        }
        onMounted(() => {
            state.url = './html/example/index.html'
        })
        return {
            state,
            list,
            clickFile
        }
    }
}
</script>
  
<style lang="scss" scoped>
.bigdata {
    width: 100vw;
    height: calc(100vh - 60px);
    display: flex;

    .side {
        width: 110px;

        .star {
            width: 40px;
            height: 40px;
            padding: 15px 5px;
            cursor: pointer;
            color: rgb(94, 94, 94);

            &:hover {
                filter: brightness(1);
                color: #fff;
            }
            &.active {
                filter: brightness(1.2);
                color: #c2f1fd;
            }
        }
    }

    .filelist {
        max-height: calc(100vh - 120px);
        overflow-y: auto;

        .cell {
            padding: 15px 5px;
            font-size: 20px;
            color: rgb(10, 145, 145);
            cursor: pointer;

            &.active {
                color: rgb(0, 255, 255);
            }
        }
    }

    .cardList {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-content: center;

        .card {
            margin: 20px auto;
            .image {
                width: 384px;
                height: 216px;

            }
            &:hover{
                box-shadow: 0 0 4px 4px rgb(10, 145, 145);
            }
            &.active{
                box-shadow: 0 0 4px 4px rgb(10, 145, 145);
                border: 2px solid rgb(0, 255, 255);
            }
        }
    }

    .frame {
        background-color: #000;
        width: calc(100vw);
        height: calc(100vh - 65px);
        border: medium none;
        overflow: auto;
    }
}
</style>
  