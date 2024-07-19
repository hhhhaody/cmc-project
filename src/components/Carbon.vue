<template>
    <div class="total">
        <div class="top" style="
    height: 12vh;">
            <div style="margin-bottom: 1vh;">碳排放总量</div>
            <div> <i class="number">3500</i> tCO2</div>
        </div>
        <el-divider />
        <div class="bottom">
            <div class="top">
                <div style="margin-bottom: 1vh;">用电碳排放量</div>
                <div> <i class="number">0.66</i> tCO2/MWH</div>
            </div>
            <div>

                <div style="margin-bottom: 1vh;">用气碳排放量</div>
                <div> <i class="number">0.32</i> 单位</div>
            </div>
        </div>
    </div>
</template>
<script setup>

</script>
<style scoped>
.total {
    margin: 2vh;
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 28vh;
    background-color: rgba(107, 127, 145, 0.194);
    border-radius: 2vh;
}

.number {
    font-size: large;
    color: rgba(72, 159, 225, 0.852);
    margin-left: 1vh;
}

.top {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.bottom {
    height: 11vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}
</style>