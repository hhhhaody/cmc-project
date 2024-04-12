<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import { getCarbonAPI } from "../apis/Carbon.js";
import ExportButton from "@/components/ExportButton.vue";
import { useUserStore } from '../stores/store.js';
const userStore = useUserStore();

// 定义工作站名称
const sections = ["型钢切割工作站", "地面钢网工作站", "方通组焊工作站", "模块总装工作站"];
const selectedSection = ref(sections[0]); // 默认选中的工作站
const stationData = ref([]);  // 用于保存工位数据

// 定义工位排序映射
const stationOrderMap = {
    "桁架上料工位": 17,
    "型钢翻转工位": 18,
    "激光切割工位": 19,
    "机器人下料工位": 20,
    "桁架下料工位": 21,
    "搬运机器人工位": 35,
    "柱头焊接工位1": 36,
    "柱头焊接工位2": 37,
    "柱脚焊接工位1": 38,
    "柱脚焊接工位2": 39,
    "柱头总装工位": 40,
    "柱脚总装工位": 41,
    "整焊机台工位": 42,
    "桁架上下料工位": 43,
    "移动模台工位": 46,
    "装夹工位1": 47,
    "装夹工位2": 48,
    "机器人焊接工位1": 49,
    "机器人焊接工位2": 50,
    "机器人焊接工位3": 51,
    "机器人焊接工位4": 52,
    "移动桁架工位": 53,
    "桁架上料工位": 110,
    "机器人焊接工位": 112,
    "桁架下料工位": 118,
};

//保存后端数据
const tableData = reactive({
    total: 0,
    data: []
});

//从后端获取数据
const fetchTableData = async (section) => {
    const res = await getCarbonAPI(currentPage.value, pageSize.value, type.value, section, startDate.value, endDate.value);
    if (res.code === 1) {
        tableData.data = res.data.data;
        tableData.total = res.data.total;
        // console.log(res.data.data);

        // 提取当前分页数据中的所有工位名称
        // let allStations = new Set();
        // tableData.data.forEach(item => {
        //     item.stationTimes.forEach(station => {
        //         allStations.add(station.stationName);
        //     });
        // });
        // stationData.value = [...allStations].sort((a, b) => {
        //     return (stationOrderMap[a] || 0) - (stationOrderMap[b] || 0);
        // });
    } else {
        stationData.value = [];
    }
    updateSearchSuggestion();
}

// 更新日期范围
const updateDates = () => {
    startDate.value = dateRange.value[0];
    endDate.value = dateRange.value[1];
};

// 搜索处理函数
const handleSearch = async () => {
    await fetchTableData(selectedSection.value, startDate.value, endDate.value, type.value);
};

//重置功能
const reset = async () => {
    type.value = '';
    dateRange.value = [null, null];
    startDate.value = null;
    endDate.value = null;
    currentPage.value = 1; // 设置为第一页

    // 获取数据
    await fetchTableData(selectedSection.value);
};

// 获取工位时间
const getStationTime = (stationTimes, stationName) => {
    const station = stationTimes.find(st => st.stationName === stationName);
    return station ? `${station.timeSpent}s` : '';
}

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// 切换工作站
const changeSection = async (section) => {
    selectedSection.value = section;
    await fetchTableData(section);
};

// 导出功能相关
const selectedRows = ref([]);
const handleSelectionChange = (selected) => {
    selectedRows.value = selected;
};
const headers = ref([
    { key: 'id', title: '序号' },
    { key: 'type', title: '能源类型' },
    { key: 'emissions', title: '碳排放量' },
    { key: 'updateTime', title: '日期' },
]);
const filterExportData = (data) => {
    // 过滤或转换数据的逻辑
    // 遍历tableData.data中的项目，对每个项目的stationTimes按照stationOrderMap中定义的顺序进行排序。排序后的数据将被用于导出。
    return data.map(item => {
        // 对 stationTimes 进行排序
        const sortedStationTimes = item.stationTimes.sort((a, b) => {
            return (stationOrderMap[a.stationName] || 0) - (stationOrderMap[b.stationName] || 0);
        });

        // 重构 stationInfo 字段
        const stationInfo = sortedStationTimes.map(station => `${station.stationName}:${station.timeSpent}`).join(', ');

        return {
            ...item,
            stationTimes: sortedStationTimes,
            stationInfo: stationInfo // 使用新的 stationInfo
        };
    });
};

// 搜索功能相关
const search1 = ref();
const search2 = ref();
const renderKey = ref(0)
const updateSearchSuggestion = () => {
    renderKey.value = renderKey.value + 1
}

// 控制数据刷新
const refresh = ref(true)
const edit = (val) => {
    if (val) {
        loadMore(false)
    }
    else {
        loadMore(true)
    }
};
const isLoading = ref(false);
const loadMore = (status) => {
    if (isLoading.value) {
        return;
    }
    isLoading.value = true;
    refresh.value = status;

    setTimeout(() => {
        isLoading.value = false;
    }, 1000);
};

// 更新搜索条件
const search = (title, keyword) => {
    console.log(title, keyword);
    if (title === "type") type.value = keyword
    if (title === "itemModel") itemModel.value = keyword
};

// 初始化引用和数据
const type = ref('');
const itemModel = ref('');
const startDate = ref(null); // 起始日期
const endDate = ref(null);   // 结束日期
const dateRange = ref([null, null]);

//分页组件相关
//#region
const currentPage = ref(1);
const pageSize = ref(10);

//分页器回传的每页条数
const size = (val) => {
    pageSize.value = val;
    fetchTableData(selectedSection.value);
};

//分页器回传的当前页
const cur = (val) => {
    currentPage.value = val;
    fetchTableData(selectedSection.value);
};


// 页面加载后，获取默认数据
onMounted(async () => {
    await fetchTableData(selectedSection.value, startDate.value, endDate.value);
});
</script>
<template>
    <!-- borderbox -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
        :color="['#4f698794', '#4f698794']" background-color="#3545659e">
        <!-- body -->
        <el-container class="subNavPage">
            <br />
            <h1>碳管理</h1>
            <!-- main -->
            <el-main style="overflow: hidden">
                <!-- search -->
                <div class="input-row">
                    <SearchComponent :key="renderKey" search-title="能源类型" :searchContent=type ref="search1" field="type"
                        @search="search" @edit="edit" database="carbon" />

                    <div>日期：
                        <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期"
                            end-placeholder="结束日期" title="日期范围" @change="updateDates" />
                    </div>

                    <el-button type="primary" style="margin-left: 10px; width: 7%" @click="handleSearch">
                        <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
                    </el-button>
                    <el-button style="width: 7%" @click="reset">
                        <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
                    </el-button>
                </div>
                <br />
                <!-- operation -->
                <div style="display: flex; justify-content: space-between">
                    <span>
                        <ExportButton v-if="!userStore.isReadOnly" v-model="selectedRows" :headers="headers"
                            :tableData="tableData.data" fileName="碳管理.xlsx" :filterFunction="filterExportData"
                            buttonLabel="导出" />


                    </span>
                    <el-button>
                        <el-dropdown>
                            <span class="el-dropdown-link"> {{ selectedSection }} </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="section in sections" :key="section"
                                        @click="changeSection(section)">{{
            section
        }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </el-button>
                </div>

                <div>
                    <el-table :data="tableData.data" @selection-change="handleSelectionChange" show-overflow-tooltip
                        style="width: 100%; margin-top: 1vh;border-radius: 1vh; margin-top: 1vh" table-layout="fixed"
                        height="52vh">
                        <el-table-column type="selection" align="center" />
                        <el-table-column type="index" label="序号" align="center" min-width="60vh" />
                        <el-table-column prop="type" label="能源类型" align="center" />
                        <el-table-column prop="updateTime" label="日期" align="center"
                            :formatter="row => formatDate(row.updateTime)">
                        </el-table-column>
                        <el-table-column prop="emissions" label="碳排放量（T）" align="center" />
                    </el-table>
                </div>
            </el-main>
            <!-- pagination -->
            <el-footer style="display: flex; justify-content: center">
                <div class="demo-pagination-block">
                    <PaginationComponent :total="tableData.total" @size="size" @cur="cur" />
                </div>
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

.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}

:deep .el_total-color {
    --el-text-color-regular: #729fd0;
}

.inline_button {
    padding: 0 2px;
    margin: 0;
    text-decoration: underline;
    color: #729fd0;
    border: none;
    width: min-content;
}

:deep .el-dialog {
    --el-dialog-padding-primary: 3vh;
    --el-dialog-border-radius: 1vh
}

:deep .el-overlay {
    background-color: rgba(37, 54, 83, 0.498);
}

.input-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    align-items: center;
    margin-bottom: 12px;
    /* margin-left: 5%; */
    position: relative;
}

.tab {
    display: inline-block;
    /* width: 10vh; */
    right: 2vh;
    position: absolute;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    font-size: 14px;
    color: #606266;
    border: 1px solid #fff;
    /* 添加白色边框 */
    padding: 5px 10px;
    border-radius: 4px;
    background-color: white;
}
</style>
