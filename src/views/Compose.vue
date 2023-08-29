<script setup>
import { ref, onMounted, reactive } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import SearchComponent from "../components/SearchComponent.vue";
import DialogComponent from "../components/DialogComponent.vue";

const tableData = [
    {
        section: "型钢切割工作站",
    },
    {
        section: "地面钢网工作站",
    },
    {
        section: "方通组焊工作站",
    },
    {
        section: "模块总装工作站",
    },
];

const addform = reactive({
    section: '',  //工段名称
    station: '',  //工位名称
})

// 从后端获取数据
// const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
    // const res = await getMaterialAPI(currentPage.value, pageSize.value, name.value, spec.value);
    // console.log(res.data);
    tableData.value = res.data.data;
    total.value = res.data.total
    updateSearchSuggestion()

};


//弹框相关
//新增
//#region
const dialog = ref(false)
const addDialog = ref()
const editDialog = ref()

const dialogClose = () => {
    dialog.value = false
}

const tableShown = reactive([]);

const loadAllProduct = () => {
    return [
        { value: "product 1", link: "https://github.com/vuejs/vue" },
        { value: "product 2", link: "https://github.com/ElemeFE/element" },
        { value: "product 3", link: "https://github.com/ElemeFE/cooking" },
        { value: "product 4", link: "https://github.com/ElemeFE/mint-ui" },
        { value: "product 5", link: "https://github.com/vuejs/vuex" },
        { value: "product 6", link: "https://github.com/vuejs/vue-router" },
    ];
};

const loadAllModel = () => {
    return [
        { value: "50*30*4500", link: "https://github.com/vuejs/vue" },
        { value: "30*30*4500", link: "https://github.com/ElemeFE/element" },
        { value: "30*30*5000", link: "https://github.com/ElemeFE/cooking" },
    ];
};

const createFilter = (queryString) => {
    return (tableData) => {
        return (
            tableData.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
    };
};

const handleSelect = (item) => {
    console.log(item);
};

const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const background = ref(true);
const disabled = ref(false);

const handleSizeChange = (val) => {
    pageSize.value = val;
    tableShown.value = tableData.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value
    );
};
const handleCurrentChange = (val) => {
    // console.log(`current page: ${val}`);
    currentPage.value = val;
    tableShown.value = tableData.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value
    );
};


onMounted(() => {
    tableShown.value = tableData.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value
    );
});
</script>
<template>
    <!-- borderbox -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
        background-color="#4f698794">
        <!-- body -->
        <el-container class="subNavPage">
            <br />
            <h1>产线组成</h1>
            <!-- main -->
            <el-main style="overflow: hidden">
                <!-- search -->
                <!-- <div>
          <SearchComponent
            search-title="文件名称"
            :load-all-data="loadAllProduct"
          />
          <el-button type="primary" style="margin-left: 10px; width: 7%"
            ><Search
              style="width: 1em; height: 1em; margin-right: 8px"
            />搜索</el-button
          >
          <el-button style="width: 7%"
            ><DeleteFilled
              style="width: 1em; height: 1em; margin-right: 8px"
            />重置</el-button
          >
        </div> -->
                <br />
                <!-- operation -->
                <div style="display: flex; justify-content: space-between">
                    <span>
                        <el-button type="primary" @click="addDialog.dialogVisible = true, dialog = true">
                            <Plus style="width: 1em; height: 1em; margin-right: 8px" />新增
                        </el-button>

                        <!-- <el-button type="primary"
              ><Upload
                style="width: 1em; height: 1em; margin-right: 8px"
              />上传</el-button
            > -->
                    </span>
                </div>

                <DialogComponent ref="addDialog" :form="addform" dialog-title="新建工段" :refreshFunc="getDataFromAPI"
                    :confirm-func="addMaterialAPI" @dialogClose="dialogClose">
                    <el-form-item label="工段名称:" prop="section" :rules="[
                        { required: true, message: '请输入工段名称', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="addform.section" autocomplete="off" style="width: 100%;" />
                    </el-form-item>

                    <el-form-item label="工位名称:" prop="station" :rules="[
                        { required: true, message: '请输入工位名称', trigger: 'blur' },
                        {
                            min: 1, max: 30,
                            message: '长度必须在1-30之间', trigger: 'blur'
                        }]">
                        <el-input v-model="addform.station" autocomplete="off" style="width: 100%;" />
                    </el-form-item>
                </DialogComponent>

                <!-- table -->
                <div>
                    <el-table :data="tableShown.value" show-overflow-tooltip
                        style="width: 100%; border-radius: 1vh; margin-top: 1vh" table-layout="fixed" height="50vh">
                        <el-table-column type="selection" align="center" />
                        <el-table-column type="index" label="序号" align="center" min-width="60vh" />
                        <el-table-column prop="section" label="工段名称" align="center" />

                        <el-table-column prop="produceNo" label="操作" align="center">
                            <template #default="scope">
                                <el-button class="inline_button"
                                    @click="getMaterialByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, updateform.id = scope.row.id">
                                    工位管理
                                </el-button>
                                <el-button class="inline_button"
                                    @click="getMaterialByID(scope.row.id), editDialog.dialogVisible = true, dialog = true, updateform.id = scope.row.id">
                                    编辑
                                </el-button>
                                <el-button class="inline_button" @click="deleteConfirm(scope.row.id)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
            <!-- pagination -->
            <el-footer style="display: flex; justify-content: center">
                <div class="demo-pagination-block">
                    <el-pagination class="el_total-color" v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100]" :small="small" :disabled="disabled" :background="background"
                        layout="total, sizes, prev, pager, next, jumper" :total="tableData.length"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
</style>

