<script setup>
import { ref, onMounted, reactive, onUnmounted, watch, computed } from "vue";
import { RouterLink } from "vue-router";
import { format } from "date-fns"
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogSearch from "../components/DialogSearch.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";
import UploadImage from "../components/UploadImage.vue";
import { getMaterialAPI, addMaterialAPI, updateMaterialAPI, deleteMaterialAPI, addMaterialOperationAPI, getByBatchAPI } from "../apis/material";
import ExportButton from "@/components/ExportButton.vue";
import { addFacilityAPI, getFacilityAPI, deleteFacilityAPI, getByIdAPI, updateFacilityAPI, updateFacilityStatusAPI } from "../apis/facility";
import { getDeviceAPI, setStatusAPI } from "../apis/data.js"

// 从后端获取数据
const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
    const res = await getDeviceAPI();

    console.log(res.data);
    const station1 = [];
    const station2 = [];
    const station3 = [];
    const station4 = [];
    const station5 = [];
    const section1 = { name: '型钢切割工作站', components: [] };
    const section2 = { name: '地面钢网工作站', components: [] }
    const section3 = { name: '方通组焊工作站', components: [] }
    const section4 = { name: '总装工作站', components: [] }
    const section5 = { name: '墙板生产线', components: [] }
    for (const i in res.data) {
        const item = res.data[i]

        if (item.section === '型钢切割工作站') {
            station1.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
        }

        if (item.section === '地面钢网工作站') {
            station2.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
        }
        if (item.section === '方通组焊工作站') {
            station3.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
        }
        // if (item.section === '模块总装工作站') {
        //     station4.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
        // }
    }
    res.data = [
        { name: '左侧夹具', section: '总装工作站', status: '正常运行' },
        { name: '右侧夹具', section: '总装工作站', status: '正常运行' },
        { name: '焊接桁架A', section: '总装工作站', status: '正常运行' },
        { name: '焊接桁架B', section: '总装工作站', status: '正常运行' },
        { name: '焊接机器人A', section: '总装工作站', status: '正常运行' },
        { name: '焊接机器人B', section: '总装工作站', status: '正常运行' },
        { name: '焊接机器人C', section: '总装工作站', status: '正常运行' },
        { name: '焊接机器人D', section: '总装工作站', status: '正常运行' },
        { name: '左侧移动模台小车', section: '总装工作站', status: '正常运行' },
        { name: '右侧移动模台小车', section: '总装工作站', status: '正常运行' },

        { name: '桁架焊接机器人A', section: '墙板生产线', status: '正常运行' },
        { name: '桁架焊接机器人B', section: '墙板生产线', status: '正常运行' },
        { name: '桁架焊接机器人C', section: '墙板生产线', status: '正常运行' },
        { name: '桁架焊接机器人D', section: '墙板生产线', status: '正常运行' },
        { name: '焊接夹具A', section: '墙板生产线', status: '正常运行' },
        { name: '焊接夹具B', section: '墙板生产线', status: '正常运行' },
        { name: '龙门吊', section: '墙板生产线', status: '正常运行' },
        { name: '吊具', section: '墙板生产线', status: '正常运行' },

        { name: '辅助工装', section: '墙板生产线', status: '正常运行' },
        { name: '板链输送线', section: '墙板生产线', status: '正常运行' },
        { name: '手工焊机', section: '墙板生产线', status: '正常运行' },
        { name: '人工作业平台', section: '墙板生产线', status: '正常运行' },
        { name: '滚筒输送线', section: '墙板生产线', status: '正常运行' },
        { name: '固定工装', section: '墙板生产线', status: '正常运行' },
        { name: '翻转机', section: '墙板生产线', status: '正常运行' },
        { name: '桁架焊接机器人A', section: '墙板生产线', status: '正常运行' },
        { name: '桁架焊接机器人B', section: '墙板生产线', status: '正常运行' },
        { name: '板链输送线', section: '墙板生产线', status: '正常运行' },
        { name: '地轨铺板机器人', section: '墙板生产线', status: '正常运行' },
        { name: '板链输送线', section: '墙板生产线', status: '正常运行' },
        { name: '水泥纤维板二次定位台', section: '墙板生产线', status: '正常运行' },

        { name: '钻孔打钉组件', section: '墙板生产线', status: '正常运行' },
        { name: '二级料仓', section: '墙板生产线', status: '正常运行' },
        { name: '供料器', section: '墙板生产线', status: '正常运行' },
        { name: '打钉桁架机台', section: '墙板生产线', status: '正常运行' },
        { name: '板链输送线', section: '墙板生产线', status: '正常运行' },

        { name: '板链输送线', section: '墙板生产线', status: '正常运行' },
        { name: '阻挡装置', section: '墙板生产线', status: '正常运行' },
        { name: '滚筒输送线', section: '墙板生产线', status: '正常运行' },
        { name: '翻转机', section: '墙板生产线', status: '正常运行' },
        { name: '固定工装', section: '墙板生产线', status: '正常运行' },
        { name: '地轨铺板机器人', section: '墙板生产线', status: '正常运行' },
        { name: '板链输送线', section: '墙板生产线', status: '正常运行' },
        { name: '水泥纤维板二次定位台', section: '墙板生产线', status: '正常运行' },

        { name: '钻孔打钉组件', section: '墙板生产线', status: '正常运行' },
        { name: '二级料仓', section: '墙板生产线', status: '正常运行' },
        { name: '供料器', section: '墙板生产线', status: '正常运行' },
        { name: '打钉桁架机台', section: '墙板生产线', status: '正常运行' },
        { name: '板链输送线', section: '墙板生产线', status: '正常运行' },

        { name: '视觉检测桁架', section: '墙板生产线', status: '正常运行' },
        { name: '板链输送线', section: '墙板生产线', status: '正常运行' },
        { name: '视觉检测系统', section: '墙板生产线', status: '正常运行' },
        { name: '阻挡装置', section: '墙板生产线', status: '正常运行' },

        { name: '板链输送线', section: '墙板生产线', status: '正常运行' },
        { name: '阻挡装置', section: '墙板生产线', status: '正常运行' },

        { name: '水泥板切割机', section: '墙板生产线', status: '正常运行' },
        { name: '上料机器人', section: '墙板生产线', status: '正常运行' },
        { name: '下料机器人', section: '墙板生产线', status: '正常运行' },
        { name: '视觉识别模组', section: '墙板生产线', status: '正常运行' },
        { name: '打码贴标机', section: '墙板生产线', status: '正常运行' },

    ]

    for (const i in res.data) {
        const item = res.data[i]
        if (item.section === '总装工作站') {
            station4.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
        }
        if (item.section === '墙板生产线') {
            station5.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
        }
    }
    section1.components = station1
    section2.components = station2
    section3.components = station3
    section4.components = station4
    section5.components = station5
    // console.log(section1);
    tableData.value = [section1, section2, section3, section4, section5]
    // console.log(tableData);
    // tableData.value = res.data.data;
    // total.value = res.data.total
    // updateSearchSuggestion()

};
//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------


//导出组件相关
const selectedRows = ref([]);
const handleSelectionChange = (selected) => {
    // console.log('Handling selection change:', selected);
    selectedRows.value = selected;
    // console.log('selectedRows after update:', selectedRows.value);
};
const headers = ref([
    { key: 'id', title: 'ID' },
    { key: 'name', title: '物料名称' },
    { key: 'spec', title: '规格型号' },
    { key: 'amount', title: '库存数量' },
    { key: 'threshold', title: '低库存阈值' },
]);
const filterExportData = (data) => {
    // 过滤或转换数据的逻辑
    return data; // 示例：返回原始数据，不做任何处理
};



//搜索组件相关
//#region
const search1 = ref();
const search2 = ref();
const name = ref("")
const spec = ref("")
//用于重新加载搜索框和搜索建议
const renderKey = ref(0)
const updateSearchSuggestion = () => {
    renderKey.value = renderKey.value + 1
}

//默认为可刷新状态，如搜索框处于编辑状态，停止实时刷新
const refresh = ref(true)
const edit = (val) => {
    if (val) {
        // console.log("loadmore false");
        loadMore(false)
    }
    else {
        // console.log("loadmore true");
        loadMore(true)
    }
};

const isLoading = ref(false);
const loadMore = (status) => {
    if (isLoading.value) {
        return;
    }
    isLoading.value = true;
    // 执行加载更多逻辑
    // console.log("now setting refresh to be ", status);
    refresh.value = status;

    setTimeout(() => {
        isLoading.value = false;
    }, 1000);
};


// 记录用于通过搜索组件输入的搜索种类及对应关键词 searchComponent
const search = (title, keyword) => {
    // console.log(title, keyword);
    if (title === "name") name.value = keyword
    if (title === "spec") spec.value = keyword


    //弹框内使用
    if (title === "supplier") stockform.supplier = keyword
    if (title === "operator") stockform.operator = keyword
};

// 根据关键字搜索数据库
const update = () => {
    refresh.value = true
    getDataFromAPI()
};

// 清空搜索组件的关键字搜索，并初始化表格展示数据
const reset = () => {
    refresh.value = true
    name.value = "";
    spec.value = "";
    search1.value.searchContent = "";
    search2.value.searchContent = "";
    getDataFromAPI()
};

// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//分页组件相关
//#region

const currentPage = ref(1);
const pageSize = ref(10);

//分页器回传的每页条数
const size = (val) => {
    pageSize.value = val;
    getDataFromAPI()
};

//分页器回传的当前页
const cur = (val) => {
    currentPage.value = val;
    getDataFromAPI()

};
// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//弹框相关
//新增
//#region
const dialog = ref(false)
const formattedTime = ref()
const remainingStock = ref(null);
const addDialog = ref()
const editDialog = ref()
const stockInDialog = ref()
const stockOutDialog = ref()
const transferDialog = ref()
const confirmImage = ref(false)

const dialogClose = () => {
    dialog.value = false
    remainingStock.value = null
}

const saveImage = () => {
    confirmImage.value = true
}

const getDefaultDate = () => {
    const currentDate = new Date()
    stockform.operateTime = format(currentDate, 'yyyy-MM-dd') + 'T' + format(currentDate, 'HH:mm:ss')
}

const remains = computed(() => {
    if (remainingStock.value == null) {
        return "请输入数量"
    }
    return `本批次余量：${remainingStock.value}`;
});

//表单数据
const addform = reactive({
    name: '',
    spec: '',
    threshold: ''
})
const updateform = reactive({
    id: '',
    name: '',
    spec: '',
    threshold: ''
})
const stockform
    = reactive({
        name: '',
        spec: '',
        operation: '',
        batch: '',
        amount: '',
        supplier: '',
        supplyTime: '',
        operateTime: '',
        operator: '',
        receipt: '',
    })

watch(
    stockform,
    (newVal, oldVal) => {
        // console.log('uidToFileNameMap changed:');
        // console.log('New uidToFileNameMap:', newMap);
        console.log(newVal);

        // You can perform actions here based on the changes in the uidToFileNameMap
        formattedTime.value = stockform.supplyTime.substring(0, 10)
    },
    { deep: true } // Enable deep monitoring
);

//编辑相关
//数据回显API

const getMaterialByID = async (id) => {
    const res = await getByIdAPI(id);
    if (res.code === 1) {
        updateform.name = res.data.name
        updateform.spec = res.data.spec
        updateform.threshold = res.data.threshold
    }
};

const getMaterialOperationByBatch = async (batch) => {
    const res = await getByBatchAPI(batch);
    if (res.code === 1) {
        stockform.name = res.data.name
        stockform.spec = res.data.spec
        stockform.supplier = res.data.supplier
        stockform.supplyTime = res.data.supplyTime
        remainingStock.value = res.data.amount
        updateSearchSuggestion()
    }
    console.log(res.data);
};

// 弹框内输入框搜索相关

//DialogSearch组件使用
const dialogSearchSuggestion = (title, keyword) => {
    if (title === "name") stockform.name = keyword
    if (title === "spec") stockform.spec = keyword
    if (title === "batch") {
        stockform.batch = keyword
        getMaterialOperationByBatch(keyword)
    }
    updateSearchSuggestion()

}

// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//确认检修
//#region

import { ElMessage, ElMessageBox } from 'element-plus'

const set = async (id) => {
    const res = await setStatusAPI(id);
    if (res.code === 1) {
        getDataFromAPI();
        ElMessage({
            type: 'success',
            message: '检修开始',
        })
    }
    else {
        ElMessage({
            type: 'error',
            message: '检修取消',
        })
    }
};

const alarmConfirm = (id) => {
    refresh.value = false
    ElMessageBox.confirm(
        '确认开始检修吗？',
        '温馨提示',
        {
            confirmButtonText: '确认',

            cancelButtonText: '取消',
            type: 'info',
        }
    )
        .then(() => {
            refresh.value = true
            // console.log(id);
            set(id)
        })
        .catch(() => {
            refresh.value = true

            ElMessage({
                type: 'info',
                message: '检修取消',
            })
        })
}
// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//定时器 实时刷新数据相关
//#region

const timer = ref()

const startTimer = () => {
    //创建定时器来实时更新数据
    timer.value = setInterval(() => {
        console.log("实时刷新中");
        //FIXME: 调试时修改此处
        getDataFromAPI()
    }, 10000)
}


//在页面销毁之前销毁定时器
onUnmounted(() => {
    clearInterval(timer.value)
    timer.value = ""
})

onMounted(() => {
    //初始化表格展示数据，数据需从后端获取
    getDataFromAPI()
    //开始实时更新
    if (timer.value) clearInterval(timer.value)
    startTimer()
});

// 有弹框时或用户编辑搜索条件时停止实时更新 
watch([dialog, refresh], (val1, val2) => {
    console.log(`dialog visible is ${val1[0]}, refresh is ${val1[1]}`)
    if (val1[0] | !val1[1]) clearInterval(timer.value)
    else startTimer()
})

// #endregion

//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
//图片上传相关
//#region 

const uploadImage = (uidToFileNameMap) => {
    // console.log("picture uploaded");
    // const allFileNames = computed(() => Object.values(uidToFileNameMap).join('-'));
    console.log(JSON.stringify(uidToFileNameMap));
    // console.log(allFileNames.value);
    // stockform.receipt = allFileNames.value
    stockform.receipt = JSON.stringify(uidToFileNameMap);
    console.log(stockform);
    confirmImage.value = false
}
//#endregion
</script>

<template>
    <!-- borderbox -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn"
        :color="['#4f698794', '#4f698794']" background-color="#3545659e">
        <!-- body -->
        <el-container class="subNavPage">
            <br />
            <h1>设备运行监测</h1>
            <!-- main -->
            <el-main style="overflow: hidden">
                <!-- search -->
                <!-- <div>
                    <SearchComponent :key="renderKey" search-title="物料名称" :searchContent=name ref="search1" field="name"
                        @search="search" @edit="edit" />
                    <SearchComponent :key="renderKey" search-title="规格型号" :searchContent=spec ref="search2" field="spec"
                        @search="search" @edit="edit" />
                    <el-button type="primary" style="margin-left: 10px; width: 7%" @click="update">
                        <Search style="width: 1em; height: 1em; margin-right: 8px" />搜索
                    </el-button>
                    <el-button style="width: 7%" @click="reset">
                        <DeleteFilled style="width: 1em; height: 1em; margin-right: 8px" />清空
                    </el-button>
                </div> -->
                <br />
                <!-- operation -->
                <!-- <div style="display: flex; justify-content: space-between">
                    <span>
                        <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
                            <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增物料
                        </el-button>

                        <ExportButton v-model="selectedRows" :headers="headers" :tableData="tableData.value"
                            fileName="物料库存信息.xlsx" :filterFunction="filterExportData" buttonLabel="导出" />
                    </span>
                    <span>
                        <el-button
                            @click="stockInDialog.dialogVisible = true, stockform.operation = '入库', dialog = true, getDefaultDate()">入库</el-button>
                        <el-button
                            @click="stockOutDialog.dialogVisible = true, stockform.operation = '出库', dialog = true, getDefaultDate()">出库</el-button>
                        <el-button
                            @click="transferDialog.dialogVisible = true, stockform.operation = '转入不良物料库', dialog = true, getDefaultDate()">转入不良物料
                        </el-button>
                    </span>
                </div> -->
                <!-- record -->
                <!-- <div style="
            height: 4vh;
            line-height: 4vh;
            text-decoration: underline;
            color: #729fd0;
            position: relative;
            left: 95%;
            width: fit-content;
            cursor: pointer;
          ">
                    <RouterLink to="/inventory/operation">操作记录</RouterLink>
                </div> -->


                <!-- 描述每种颜色对应的设备状态的说明部分 -->
                <div class="status-description">
                    <span class="status-item1">
                        正常运行
                    </span>
                    <span class="status-item2">
                        检修维护
                    </span>
                    <span class="status-item3">
                        报警
                    </span>
                    <span class="status-item4">
                        停机
                    </span>
                </div>

                <!-- 用于显示所有工作站的容器 -->
                <div class="workstations">

                    <!-- 使用v-for指令来遍历工作站数组并为每个工作站创建一个工作站元素，元素的key是工作站的名字 -->
                    <div class="workstation" v-for="workstation in tableData.value" :key="workstation.name">

                        <!-- 显示工作站的名称 -->
                        <div class="workstation-header">{{ workstation.name }}</div>
                        <ul>
                            <!-- 再次使用v-for指令来遍历工作站的组件数组，为每个组件创建一个列表元素，元素的key是组件的名字，类名是组件的状态，
                         这可以用来通过CSS改变不同状态的组件的颜色 -->
                            <li v-for="component in workstation.components" :key="component.name"
                                :class="component.status">
                                <!-- 显示组件的名称 -->
                                {{ component.name }}
                                <el-button v-if="component.status == 'alarm'" class="confirm"
                                    @click="alarmConfirm(component.id)">
                                    检修
                                </el-button>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-main>
            <!-- pagination -->
            <el-footer style="display: flex; justify-content: center">
                <!-- <PaginationComponent :total="total" @size="size" @cur="cur" /> -->
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
    /* background-color: #3545659e; */
    /* 3f536cb0 */
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

.workstation-header {
    color: #333;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    font-weight: bold;
    position: sticky;
    /*使元素有粘性，可以固定在一个位置*/
    top: 0;
    /*固定在顶部，即滚动到哪都会保持在顶部*/
    background: white;
    /*提供背景，以避免其他内容在其下方滚动时显示出来*/
    z-index: 1;
    /*提高堆叠顺序，以避免其他内容覆盖其上*/
    padding-top: 25px;
    margin-top: -25px;
    text-align: center;
}

.workstations {
    display: flex;
    justify-content: center;
    padding: 0 0%;
    margin-top: 25px;

}

.workstation {
    background-color: white;
    border-radius: 1vh;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0 25px 25px;
    width: 20%;
    text-align: left;
    margin: 0 30px;
    height: calc(100vh - 450px);
    overflow-y: auto;

    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}

.workstation::-webkit-scrollbar {
    display: none;
}

.workstation h2,
.workstation ul {
    /* margin-left: 5px; */
    /* 调整左边距实现左对齐 */
}

.workstation ul {
    padding-left: 0;
    /* 移除默认的左边距 */
    list-style-type: none;
    /* 移除默认的列表样式 */
    margin-top: 40px;
}

.workstation li {
    /* margin: 1vh 0; */
    /* 增加垂直边距 */
    padding: 1vh;
    /* 增加内边距 */
    position: relative;
}

.normal {
    color: black;
}

.stopped {
    color: black;
}

.maintenance {
    color: black;
}

.alarm {
    color: black;
}

.normal::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #339a528b;
    border-radius: 50%;
    right: 2vh;
    top: 50%;
    transform: translateY(-50%);
}

.stopped::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: grey;
    border-radius: 50%;
    right: 2vh;
    top: 50%;
    transform: translateY(-50%);
}

.maintenance::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #ff9a02a0;
    border-radius: 50%;
    right: 2vh;
    top: 50%;
    transform: translateY(-50%);
}

.alarm::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #e26237ab;
    border-radius: 50%;
    right: 2vh;
    top: 50%;
    transform: translateY(-50%);
}

.confirm {
    color: #e26237ab;
    position: absolute;
    width: 15px;
    height: 15px;
    right: -1vh;
    top: 50%;
    transform: translateY(-50%);
}

.status-description {
    display: flex;
    width: 20%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
}


.status-item1::before {
    display: inline-block;
    content: "";
    position: relative;
    width: 12px;
    height: 12px;
    background-color: #339a528b;
    border-radius: 50%;
    /* right: 3vh; */
    top: 50%;
    /* transform: translateY(-50%); */
}

.status-item2::before {
    display: inline-block;
    content: "";
    position: relative;
    width: 12px;
    height: 12px;
    background-color: #ff9a02a0;
    border-radius: 50%;
    /* right: 3vh; */
    top: 50%;
    /* transform: translateY(-50%); */
}

.status-item3::before {
    display: inline-block;
    content: "";
    position: relative;
    width: 12px;
    height: 12px;
    background-color: #e26237ab;
    border-radius: 50%;
    /* right: 3vh; */
    top: 50%;
    /* transform: translateY(-50%); */
}

.status-item4::before {
    display: inline-block;
    content: "";
    position: relative;
    width: 12px;
    height: 12px;
    background-color: grey;
    border-radius: 50%;
    /* right: 3vh; */
    top: 50%;
    /* transform: translateY(-50%); */
}
</style>
