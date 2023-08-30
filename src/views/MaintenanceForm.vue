<template>
    <div class="add-container" v-show="isVisible">
        <h3>新增</h3>
        <div class="separator"></div>

        <!-- 新增部分 -->
        <div class="input-section">

            <div class="input-row">
                <label class="input-label">工段名称</label>
                <el-select class="component-width" v-model="lineName" clearable placeholder="请选择工段">
                    <el-option label="Line1" value="Line1"></el-option>
                    <el-option label="Line2" value="Line2"></el-option>
                </el-select>

                <label class="input-label ">工位名称</label>
                <el-select class="component-width" v-model="positionName" clearable placeholder="请选择工位">
                    <el-option label="Position1" value="Position1"></el-option>
                    <el-option label="Position2" value="Position2"></el-option>
                </el-select>
            </div>

            <div class="input-row">
                <label class="input-label">设备型号</label>
                <el-select class="component-width" v-model="deviceModel" clearable placeholder="请选择型号">
                    <el-option label="Type1" value="Type1"></el-option>
                    <el-option label="Type2" value="Type2"></el-option>
                </el-select>

                <label class="input-label">维护人员</label>
                <el-input class="component-width" v-model="maintenancePerson" placeholder="请输入人员姓名"></el-input>
            </div>

            <div class="input-row">
                <label>计划完成维护日期</label>
                <el-date-picker style="width: 335px; margin-right: 10px; padding-left: 14px; margin-top: 10px;"
                    v-model="maintenanceDate" type="date" placeholder="选择日期"></el-date-picker>

                <label>实际完成维护日期</label>
                <el-date-picker style="width: 335px; margin-right: 10px; padding-left: 14px; margin-top: 10px;"
                    v-model="actualCompletionDate" type="date" placeholder="选择日期"></el-date-picker>
            </div>

            <div class="input-row">
                <label>维护内容</label>
                <el-input type="textarea" :rows="4"
                    style="width: 86.5%; height: 80px; padding-left: 14px; margin-top: 10px;" v-model="description"
                    placeholder="请输入维护内容"></el-input>
            </div>
        </div>

        <div class="button-group">
            <el-button type="primary" @click="handleConfirm">检修维护</el-button>
            <el-button @click="toggleVisibility">取消</el-button>
        </div>
    </div>
</template>
  
<script>
import { ref } from "vue";
import { ElDatePicker, ElOption, ElTimePicker, ElInput, ElButton, ElSelect } from 'element-plus';

const tableData = [
  {
    lineName: "Line1",
    positionName: "Position1",
    deviceModel: "Type1",
    maintenanceDate: "2021-04-13",
    actualCompletionDate: "2021-04-13",
    maintenancePerson: "方舟",
    description: "清洁焊接机器人表面",
    }, {
    lineName: "Line1",
    positionName: "Position1",
    deviceModel: "Type1",
    maintenanceDate: "2021-04-13",
    actualCompletionDate: "2021-04-13",
    maintenancePerson: "方舟",
    description: "清洁焊接机器人表面",
    }, {
    lineName: "Line1",
    positionName: "Position1",
    deviceModel: "Type1",
    maintenanceDate: "2021-04-13",
    actualCompletionDate: "2021-04-13",
    maintenancePerson: "方舟",
    description: "清洁焊接机器人表面",
    }, {
    lineName: "Line1",
    positionName: "Position1",
    deviceModel: "Type1",
    maintenanceDate: "2021-04-13",
    actualCompletionDate: "2021-04-13",
    maintenancePerson: "方舟",
    description: "清洁焊接机器人表面",
    },
]


export default {
    props: {
        isVisible: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const lineName = ref(null);
        const positionName = ref(null);
        const deviceModel = ref(null);
        const maintenanceDate = ref(null);
        const actualCompletionDate = ref(null);
        const completionTime = ref(null);
        const description = ref(null);
        const maintenancePerson = ref(null);


        function toggleVisibility() {
            emit('update:isVisible', false);
        }

        function handleConfirm() {
            emit('confirm', {
                lineName: lineName.value,
                positionName: positionName.value,
                deviceModel: deviceModel.value,
                maintenanceDate: maintenanceDate.value,
                completionTime: actualCompletionDate.value,
                maintenancePerson: maintenancePerson.value,
                description: description.value
            });
            toggleVisibility();
        }

        return {
            lineName,
            positionName,
            deviceModel,
            maintenanceDate,
            actualCompletionDate,
            maintenancePerson,
            completionTime,
            description,
            handleConfirm,
            toggleVisibility
        };
    }
}
</script>
  
<style scoped>
.add-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 522px;
    margin: 0 auto;
    margin-top: 15px;
}

.input-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.input-label {
    font-size: 14px;
    font-weight: 500;
    display: inline-block;
    width: 77px;
    text-align: right;
    margin-right: 13px;
}

.component-width {
    width: 220px;
    margin-top: 11px;
    margin-right: 10px;
}

.select-label {
    width: 200px;
    margin-top: 11px;
}

.line-select {
    width: 220px;
    margin-right: 10px;
}

h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
    font-weight: 350;
    text-align: left;
}

.separator {
    height: 1px;
    background-color: #EBEEF5;
    margin: 15px 0;
}

.button-group {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    padding-top: 15px;
}

el-button {
    margin-top: 20px;
}

.input-section label {
    display: block;
    margin-top: 10px;
    font-size: 14px;
    color: #333;
}

.input-section {
    margin-bottom: 20px;
}
</style>
  
  