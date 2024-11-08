<template>
    <div style="margin: 2vh;margin-top: 5vh; margin-right: 5vh;">
        <div class="row">
            方通柱
            <el-progress :text-inside="true" :stroke-width="24" :percentage="70" />

        </div>
        <div class="row">
            墙板
            <el-progress :text-inside="true" :stroke-width="24" :percentage="85" />

        </div>
        <div class="row">
            箱体
            <el-progress :text-inside="true" :stroke-width="24" :percentage="80" />

        </div>
    </div>
</template>

<style scoped>
.row {
    margin: 1vh;
}

:deep .el-progress-bar__outer {
    /* background-color: rgba(107, 127, 145, 0.194) !important; */
    background: radial-gradient(circle, rgba(189, 224, 242, 0.751), transparent) !important;
}

:deep .el-progress-bar__innter {
    background-color: #55a2e7a3 !important;
    /* background-color: linear-gradient(to right, transparent 10%, #6ea3d7 40%, #f3f7fcbb 50%, #6ea3d7 60%, transparent 90%) 2 10 !important; */
}
</style>