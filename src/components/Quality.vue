<template>
    <div style="margin: 2vh; margin-right: 5vh; height: 31vh;">
        <div class="row">
            方通柱
            <el-progress :text-inside="true" :stroke-width="24" :percentage="70" />

        </div>
        <div class="row">
            墙面
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
    background-color: rgba(107, 127, 145, 0.194) !important;
}
</style>