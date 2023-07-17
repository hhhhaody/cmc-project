<script lang="ts" setup>
import { ref } from "vue";

const activeNames = ref(["1"]);
const handleChange = (val: string[]) => {
  //   console.log(val);
};

/**
 * type:
 * 0: 日常保养
 * 1：一级保养
 * 2：二级保养
 * 3：逾期一级保养
 * 4：逾期二级保养
 */
const plan = ref([
  {
    name: "device 1",
    section: "section 1",
    station: "station 1",
    type: 0,
  },
  {
    name: "device 2",
    section: "section 1",
    station: "station 1",
    type: 1,
  },
  {
    name: "device 3",
    section: "section 1",
    station: "station 1",
    type: 2,
  },
  {
    name: "device 1",
    section: "section 2",
    station: "station 1",
    type: 1,
  },
  {
    name: "device 1",
    section: "section 3",
    station: "station 1",
    type: 2,
  },
  {
    name: "device 1",
    section: "section 1",
    station: "station 2",
    type: 1,
  },
  {
    name: "device 1",
    section: "section 1",
    station: "station 3",
    type: 2,
  },
  {
    name: "device 1",
    section: "section 1",
    station: "station 4",
    type: 0,
  },
  {
    name: "device 2",
    section: "section 2",
    station: "station 1",
    type: 4,
  },
  {
    name: "device 3",
    section: "section 1",
    station: "station 2",
    type: 0,
  },
  {
    name: "device 5",
    section: "section 3",
    station: "station 1",
    type: 3,
  },
  {
    name: "device 5",
    section: "section 3",
    station: "station 1",
    type: 2,
  },
  {
    name: "device 5",
    section: "section 3",
    station: "station 1",
    type: 2,
  },
  {
    name: "device 5",
    section: "section 3",
    station: "station 1",
    type: 3,
  },
  {
    name: "device 5",
    section: "section 3",
    station: "station 1",
    type: 3,
  },
  {
    name: "device 5",
    section: "section 3",
    station: "station 1",
    type: 4,
  },
  {
    name: "device 5",
    section: "section 3",
    station: "station 1",
    type: 2,
  },
  {
    name: "device 5",
    section: "section 3",
    station: "station 1",
    type: 4,
  },
]);
const routine = plan.value.filter((device) => device.type === 0);
const level1 = plan.value.filter((device) => device.type === 1);
const level2 = plan.value.filter((device) => device.type === 2);
const level3 = plan.value.filter((device) => device.type === 3);
const level4 = plan.value.filter((device) => device.type === 4);
</script>

<template>
  <div class="collapse">
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
      style="
        --el-collapse-border-color: transparent;
        border: 0px;
        --el-collapse-content-bg-color: transparent;
      "
    >
      <el-collapse-item name="1" class="row">
        <template #title>
          今日维护保养任务
          <span class="num"
            >{{ routine.length + level1.length + level2.length }}项</span
          ></template
        >
        <el-collapse-item name="10" class="row">
          <template #title>
            日常保养
            <span class="num">{{ routine.length }}项</span></template
          >
          <el-table
            :data="routine"
            style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            "
          >
            <el-table-column prop="station" label="工段" />
            <el-table-column prop="section" label="工位" />
            <el-table-column prop="name" label="设备名称" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item name="11" class="row">
          <template #title>
            一级保养
            <span class="num">{{ level1.length }}项</span></template
          >
          <el-table
            :data="level1"
            style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            "
          >
            <el-table-column prop="station" label="工段" />
            <el-table-column prop="section" label="工位" />
            <el-table-column prop="name" label="设备名称" /> </el-table
        ></el-collapse-item>
        <el-collapse-item name="12" class="row">
          <template #title>
            二级保养
            <span class="num">{{ level2.length }}项</span></template
          >
          <el-table
            :data="level2"
            style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            "
          >
            <el-table-column prop="station" label="工段" />
            <el-table-column prop="section" label="工位" />
            <el-table-column prop="name" label="设备名称" />
          </el-table>
        </el-collapse-item>
      </el-collapse-item>
      <el-collapse-item name="0" class="row">
        <template #title>
          逾期未完成维护保养任务
          <span class="num"
            >{{ level3.length + level4.length }}项</span
          ></template
        >
        <el-collapse-item name="01" class="row">
          <template #title>
            一级保养
            <span class="num">{{ level3.length }}项</span></template
          >
          <el-table
            :data="level3"
            style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            "
          >
            <el-table-column prop="station" label="工段" />
            <el-table-column prop="section" label="工位" />
            <el-table-column prop="name" label="设备名称" /> </el-table
        ></el-collapse-item>
        <el-collapse-item name="02" class="row">
          <template #title>
            二级保养
            <span class="num">{{ level4.length }}项</span></template
          >
          <el-table
            :data="level4"
            style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            "
          >
            <el-table-column prop="station" label="工段" />
            <el-table-column prop="section" label="工位" />
            <el-table-column prop="name" label="设备名称" />
          </el-table>
        </el-collapse-item>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>



<style scoped>
.collapse {
  height: 36vh;
  width: 90%;
  margin-top: 1vh;
  margin-left: 1vh;
  overflow: auto;
}

::-webkit-scrollbar {
  display: none;
}

el-collapse-item {
  position: relative;
}

.row {
  position: relative;
}
.num {
  position: absolute;
  right: 8vh;
}

:deep .el-collapse-item__header {
  /* background: radial-gradient(ellipse at bottom, #6ca2f3a4, transparent 90%),
    radial-gradient(ellipse at top, #8aadda76, transparent 50%); */
  background-color: #31538271;

  border: solid 0px #559cde50;
  /* border-image: linear-gradient(
      to bottom right,
      #6fa4eafa 10%,
      transparent 60%,
      #39597f 80%
    )
    2 10; */
  color: #fff;
  padding: 0 1vh;
  text-shadow: 1px -1px 5px #a3ccf9;
}

:deep .el-collapse-item__content {
  padding: 0;
  /* padding-left: 2vh; */
  /* color: #1f67d3; */
  background: radial-gradient(ellipse at bottom, #7093c6a4, transparent 90%),
    radial-gradient(ellipse at top, #87a8d376, transparent 50%);
  /* background-color: #1f5493cd; */
  border: solid 0px #559cde50;
}

:deep .el-collapse-item__header.is-active {
  border-bottom: 0px solid #ebeef5;
}

:deep .head_active .el-collapse-item__header.is-active {
  border-bottom-color: transparent;
  color: #667687;
}

:deep .el-collapse-item__wrap {
  border: none;
}

:deep .el-table__inner-wrapper::before {
  display: none;
}
</style>