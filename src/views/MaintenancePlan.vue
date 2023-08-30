<script setup>
import { ref, computed, watch } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
import MaintenanceForm from "./MaintenanceForm.vue";

const currentDate = ref(new Date());
const currentMonth = computed(() => currentDate.value.getMonth());
const selectedDate = ref(new Date());
const showContainer = ref(false);

function handleFormConfirm() {
  // 这里您可以添加当表单确定按钮点击时的处理逻辑
  showContainer.value = false;
}

// 根据用户的点击，更新月份
function addMonth(monthsToAdd) {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + monthsToAdd);
  currentDate.value = newDate;
}

// 根据用户的点击，更新年份
function addYear(yearsToAdd) {
  const newDate = new Date(currentDate.value);
  newDate.setFullYear(newDate.getFullYear() + yearsToAdd);
  currentDate.value = newDate;
}

// 根据用户的点击，跳转当日
function goToToday() {
  currentDate.value = new Date();
}

</script>

<template>
  <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
    background-color="#3545659e">
    <br />
    <h1>设备维护计划</h1>

    <div class="calendar-container">
      <el-calendar class="custom-calendar" v-model="currentDate">
        <template #header>
          <div class="custom-header">
            <span class="calendar-nav-btn" @click="addYear(-1)">&lt;&lt;</span>
            <span class="calendar-nav-btn" @click="addMonth(-1)">&lt;</span>
            <span class="calendar-nav-btn" @click="goToToday">{{ currentDate.getFullYear() }}年{{ currentDate.getMonth() +
              1 }}月</span>
            <span class="calendar-nav-btn" @click="addMonth(1)">&gt;</span>
            <span class="calendar-nav-btn" @click="addYear(1)">&gt;&gt;</span>
          </div>
        </template>

        <template #date-cell="{ data }">
          <div class="date-cell-wrapper" @click="selectedDate = new Date(data.day)">
            <p class="date-number" :class="[
              data.isSelected ? 'is-selected' : '',
              new Date(data.day).getMonth() === currentMonth ? 'current-month' : 'is-other-month'
            ]">
              {{ new Date(data.day).getDate() }}
              <!-- {{ data.isSelected ? '.' : '' }} -->
            </p>
          </div>
        </template>
      </el-calendar>

      <div class="maintenance-details">
        <div class="header-section">
          <h2>维保详情：<span class="maintenance-date">{{ selectedDate.getFullYear() }}-{{ (selectedDate.getMonth() +
            1).toString().padStart(2, '0') }}-{{
    selectedDate.getDate().toString().padStart(2, '0') }}</span></h2>
          <button class="add-button" @click="showContainer = true">新增</button>
        </div>

        <div class="separator"></div>

        <MaintenanceForm :isVisible.sync="showContainer" @confirm="handleFormConfirm" />
      </div>

    </div>
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

.custom-calendar {
  width: 62%;
  height: 86%;
  margin: 0 auto;
  margin-top: 20px;
  margin-left: 50px;
}

.calendar-container {
  width: 96%;
  height: 86%;
  margin-left: 37px;
  position: relative;
  background-color: white;
  border-radius: 5px;
}

.maintenance-details {
  background-color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  width: calc(100% - 62% - 80px);
  height: calc(100% - 17px);
  position: absolute;
  right: 0;
  top: 5px;
  margin-right: 17px;
  overflow-y: auto;
  border-radius: 5px;
}

.maintenance-details h2 {
  margin: 0;
  padding: 10px;
  font-size: 18px;
  background-color: white;
  color: black;
  text-align: left;
  font-weight: 350;
  margin-left: 20px;
}

.separator {
  height: 1px;
  background-color: #EBEEF5;
  margin: -1px 30px;
}

::v-deep .el-calendar p.current-month {
  color: #000 !important;
  /* 黑色 */
}

.custom-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.custom-header span {
  margin: 0 12px;
  cursor: pointer;
}

.calendar-nav-btn {
  color: #4E8CDA;
  cursor: pointer;
  font-size: 18px;
}

.date-number {
  text-align: left;
  padding-left: 5px;
}

.maintenance-date {
  color: #4E8CDA;
}

div.date-cell-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: left;
  justify-content: left;

}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 1px;
  margin-top: -1px;
}

.add-button {
  padding: 6px 11px;
  background-color: #4E8CDA;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 30px;
}

.add-button:hover {
  background-color: #3b6ca8;
}
</style>