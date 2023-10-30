<script setup>
import { ref, onMounted, watchEffect, computed } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import PaginationComponent from "../components/PaginationComponent.vue";
import { getCaptureAPI } from "../apis/capture";

onMounted(() => {
    getDataFromAPI();
});


const tableData = ref([]);
const total = ref(0)
const currentPage = ref(1);
const pageSize = ref(10);
const selectedDates = ref([]);

const captureTimeStart = computed(() => {
    if (selectedDates.value && selectedDates.value.length > 0) {
        return selectedDates.value[0];
    }
    return null;
});

const captureTimeEnd = computed(() => {
    if (selectedDates.value && selectedDates.value.length > 1) {
        return selectedDates.value[1];
    }
    return null;
});


const formatDate = (date) => {
    if (date) {
        return date.toISOString().split('T')[0];
    }
    return null;
}

const getDataFromAPI = async (page, pageSize, captureTimeStart, captureTimeEnd) => {
    // 使用formatDate函数格式化日期
    const formattedCaptureTimeStart = formatDate(captureTimeStart);
    const formattedCaptureTimeEnd = formatDate(captureTimeEnd);

    const res = await getCaptureAPI(page, pageSize, formattedCaptureTimeStart, formattedCaptureTimeEnd);
    tableData.value = (res.data.data && Array.isArray(res.data.data)) ? res.data.data.map(item => item.fileName) : [];
    total.value = res.data.total;
};

watchEffect(() => {
    // console.log("WatchEffect triggered.");
    getDataFromAPI(currentPage.value, pageSize.value, captureTimeStart.value, captureTimeEnd.value);
});

const searchByDate = () => {
    currentPage.value = 1; // 重置到第一页
    getDataFromAPI(currentPage.value, pageSize.value, captureTimeStart.value, captureTimeEnd.value);
};

const resetSearch = () => {
    selectedDates.value = [];
    currentPage.value = 1; // 重置到第一页
    getDataFromAPI(currentPage.value, pageSize.value);
};

// 初始化数据
getDataFromAPI(currentPage.value, pageSize.value);

//分页器回传的每页条数
const size = (val) => {
    pageSize.value = val;
    getDataFromAPI(currentPage.value, pageSize.value, captureTimeStart.value, captureTimeEnd.value)
};

//分页器回传的当前页
const cur = (val) => {
    currentPage.value = val;
    getDataFromAPI(currentPage.value, pageSize.value, captureTimeStart.value, captureTimeEnd.value)
};

const formatFileName = (fileName) => {
    const strippedFileName = fileName.replace('.jpeg', '');
    const year = strippedFileName.substring(0, 4);
    const month = strippedFileName.substring(4, 6);
    const day = strippedFileName.substring(6, 8);
    const hour = strippedFileName.substring(8, 10);
    const minute = strippedFileName.substring(10, 12);
    const second = strippedFileName.substring(12, 14);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const getImageUrl = (fileName) => {
    // console.log("Function getImageUrl is being called with:", fileName);
    const url = `https://cmc.eos-chengdu-1.cmecloud.cn/monitor/${fileName}`;
    // console.log("Generated image URL:", url);
    return url;
};

const imageUrls = computed(() => {
    if (tableData.value && tableData.value.length) {
        const urls = tableData.value.map(fileName => getImageUrl(fileName));
        // console.log("Computed imageUrls:", urls);
        return urls;
    }
    return [];
});

const formattedFileNames = computed(() => {
    if (tableData.value && tableData.value.length) {
        return tableData.value.map(fileName => formatFileName(fileName));
    }
    return [];
});

const handleDateChange = (newDates) => {
    if (!newDates || newDates.length === 0) {
        selectedDates.value = [];
    }
};


</script>
<template>
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
        background-color="#3545659e">
        <el-container class="subNavPage">
            <br />
            <h1>安全抓拍记录</h1>
            <el-main style="overflow: hidden">
                <div class="input-row">
                    <div>
                        <el-date-picker v-model="selectedDates" type="daterange" start-placeholder="开始日期"
                            end-placeholder="结束日期" @change="handleDateChange" />
                    </div>
                    <el-button @click="searchByDate" type="primary" style="margin-left: 10px; width: 7%">
                        <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
                    </el-button>
                    <el-button @click="resetSearch" style="width: 7%">
                        <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />重置
                    </el-button>
                </div>
                <br />
                <div style="background-color: white; padding: 4vh;border-radius: 1vh;">
                    <div class="calendar-container">
                        <div class="image-container" v-for="(url, index) in imageUrls" :key="url">
                            <el-image :src="url" :preview-src-list="[url]" alt="Image"
                                style="width: 85%; height: auto; border-radius: 1vh;">
                            </el-image>

                            <p class="image-label">{{ formattedFileNames[index] }}</p>
                        </div>
                    </div>
                </div>


            </el-main>

            <el-footer style="display: flex; justify-content: center">
                <PaginationComponent :total="total" :currentPage="currentPage" @size="size" @cur="cur" />
            </el-footer>
        </el-container>
    </dv-border-box1>
</template>

<style scoped>
.subNavPage {
    border-radius: 3%;
    color: #fff;
    height: 100%;
    width: 95%;
    margin: 0 auto;
    position: relative;
}

.calendar-container {

    width: 100%;
    height: 100%;
    margin-left: 0px;
    position: relative;
    background-color: white;
    border-radius: 1vh;
    margin-top: 10px;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
    align-content: space-evenly;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 2vh;
}

.image-container {
    text-align: center;
}

.image-label {
    margin-top: 4px;
    font-size: 14px;
    color: black;
}

.input-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    margin-left: 35%;
}

:deep .el_total-color {
    --el-text-color-regular: #729fd0;
}
</style>

