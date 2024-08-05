<template>
    <div class="app-page">
        <van-nav-bar v-if="navBar" :title="route.meta.title" :left-arrow="leftArrow" @click-left="onClickLeft" />

        <div class="app-main">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
defineProps({
    navBar: {
        type: Boolean,
        default: true
    },
    leftArrow: {
        type: Boolean,
        default: true
    },
    onClickLeft: {
        type: Function,
        default: () => history.back()
    }
})

const route = useRoute()
</script>

<style lang="scss" scoped>
.app-page {
    background-color: #4252810c;
    font-family: "Microsoft YaHei";
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .app-main {
        padding-top: 1em;
        padding-bottom: 1em;
        flex: 1;
        overflow: auto;
    }
}
</style>