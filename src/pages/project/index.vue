<template>
    <div class="projects-container">
        <h1>我的项目案例</h1>
        <div class="project-list">
            <div v-for="(project, index) in projects" :key="project.id" class="project-card" :style="{ '--i': index }"
                @click="openProject(project.url)">
                <h2>{{ project.name }}</h2>
                <img :src="project.picture" :alt="project.name" class="project-image">
                <p>{{ project.description }}</p>
                <a :href="project.url" target="_blank" rel="noopener noreferrer">访问项目</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface Project {
    id: number
    name: string
    url: string
    picture: string
    description: string
}

const projects = ref<Project[]>([
    {
        id: 1,
        name: "项目一 - axy-demo",
        url: "https://axydemo.netlify.app",
        picture: "https://app.netlify.com/.netlify/images?url=https://d33wubrfki0l68.cloudfront.net/682574288ffaf30008f05c7c/screenshot_2025-05-15-04-58-52-0000.webp&fit=cover&h=500&q=40&w=800",
        description: "包含炫酷CSS效果、cesium、threejs、全景图、VR、文字识别等示例"
    },
    {
        id: 2,
        name: "项目二 - axy-cesium",
        url: "https://axy-cesium.netlify.app",
        picture: "https://app.netlify.com/.netlify/images?url=https://d33wubrfki0l68.cloudfront.net/6809fa2237c60b000873127d/screenshot_2025-04-24-08-46-20-0000.webp&fit=cover&h=500&q=40&w=800",
        description: "基于 cesium 的大量示例，从基础到复杂的功能"
    },
    {
        id: 3,
        name: "项目三 - free-dialog",
        url: "https://free-dialog.netlify.app",
        picture: "https://app.netlify.com/.netlify/images?url=https://d33wubrfki0l68.cloudfront.net/68257934b067b700081e4ba2/screenshot_2025-05-15-05-19-14-0000.webp&fit=cover&h=500&q=40&w=800",
        description: "基于 Vue3 封装的功能强大、可定制的弹窗组件"
    },
    {
        id: 4,
        name: "项目四 - cyberpunk-ui",
        url: "https://cyberpunk-ui.netlify.app",
        picture: "https://app.netlify.com/.netlify/images?url=https://d33wubrfki0l68.cloudfront.net/66f379d6bd250c00083c0d25/screenshot_2024-09-25-02-48-41-0000.webp&fit=cover&h=500&q=40&w=800",
        description: "自己封装的基于vue3的赛博朋克风格UI组件库"
    },
    {
        id: 5,
        name: "项目五 - guonansimulator",
        url: "https://guonansimulator.netlify.app",
        picture: "https://app.netlify.com/.netlify/images?url=https://d33wubrfki0l68.cloudfront.net/68257cccb3d7ee00087cbc76/screenshot_2025-05-15-05-34-32-0000.webp&fit=cover&h=500&q=40&w=800",
        description: "国男大冒险游戏"
    },
    {
        id: 6,
        name: "项目六 - axy-mars3d-demo",
        url: "https://axy-mars3d-demo.netlify.app",
        picture: "https://app.netlify.com/.netlify/images?url=https://d33wubrfki0l68.cloudfront.net/682571c62513bd153833be7b/screenshot_2025-05-15-04-47-18-0000.webp&fit=cover&h=500&q=40&w=800",
        description: "基于 mars3d 的部分示例和测试代码"
    }
])

const openProject = (url: string) => {
    window.open(url, "_blank")
}
</script>

<style scoped>
.projects-container {
    padding: 60px;
    max-width: 1400px;
    margin: auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    /* background-color: #f9f9f966; */
    /* border-top: #409eff  dashed 4px; */
    color: #333;
}

h1 {
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 40px;
    color: #ffffff;
    font-weight: bold;
}

.project-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 60px;
    justify-items: center;
}

.project-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: fadeInUp 0.6s forwards;
    animation-delay: calc(0.1s * var(--i));
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.project-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.project-card h2 {
    font-size: 1.2em;
    margin-bottom: 10px;
    color: #0d6efd;
    font-weight: 600;
}

.project-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 15px;
    transition: transform 0.3s ease;
}

.project-card:hover .project-image {
    transform: scale(1.05);
}

.project-card p {
    font-size: 0.95em;
    margin-bottom: 15px;
    color: #555;
    flex-grow: 1;
}

.project-card a {
    display: inline-block;
    text-decoration: none;
    color: #0d6efd;
    font-weight: bold;
    padding: 8px 16px;
    border: 1px solid #0d6efd;
    border-radius: 6px;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.project-card a:hover {
    background-color: #0d6efd;
    color: #fff;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .project-card {
        padding: 15px;
    }

    .project-image {
        height: 160px;
    }

    h1 {
        font-size: 2em;
    }
}
</style>
