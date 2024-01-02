<script lang="ts" setup>
import { ref } from "vue";
import { getMaintenancePlanAPI } from "../apis/maintenance"
import { getFacilityAPI } from "../apis/facility";

const activeNames = ref(["1", "0"]);
const handleChange = (val: string[]) => {
  //   console.log(val);
};
const plan = ref([])
const routine = ref()
const level1 = ref()
const level2 = ref()
const level3 = ref()
const level4 = ref()

const routineNo = ref()
const level1No = ref()
const level2No = ref()
const level3No = ref()
const level4No = ref()


/**
 * type:
 * 0: 日常保养
 * 1：一级保养
 * 2：二级保养
 * 3：逾期一级保养
 * 4：逾期二级保养
 */

const getTodayPlan = async (day) => {
  const res = await getMaintenancePlanAPI('', 9999, '', '', '', '', '', new Date(day));
  console.log(res.data);
  for (const obj of res.data.data) {
    if (obj.status === '未完成') {
      if (obj.type === '一级保养') {
        obj.task = 1
      }
      if (obj.type === '二级保养') {
        obj.task = 2
      }
      plan.value.push(obj);
    }
  }
  console.log(plan.value);

};

const getPlan = async (day) => {
  const res = await getMaintenancePlanAPI('', 9999, '', '', '', '', '', '');
  console.log(res.data);
  const today = new Date(day);
  for (const obj of res.data.data) {
    const plannedTime = new Date(obj.plannedTime);
    if (today > plannedTime) {

      if (obj.status === '未完成') {
        if (obj.type === '一级保养') {
          obj.task = 3
        }
        if (obj.type === '二级保养') {
          obj.task = 4
        }
        plan.value.push(obj);
      }

    }


    //   if (obj.status === '未完成') {
    //     if (obj.type === '一级保养') {
    //       obj.task = 1
    //     }
    //     if (obj.type === '二级保养') {
    //       obj.task = 2
    //     }
    //     plan.value.push(obj);
    //   }
  }
  // console.log(plan.value);

};




const getDailyPlan = async () => {
  const res = await getFacilityAPI('', 99999, '', '', '', '', '', true);
  // console.log(res.data);


  for (const obj of res.data.data) {
    const today = new Date();
    const prevDailyTime = new Date(obj.prevDailyTime);
    if (!obj.prevDailyTime || !isSameDay(today, prevDailyTime)) {
      obj.task = 0
      plan.value.push(obj);
    }

  }
  console.log(plan.value);
  routine.value = plan.value.filter((device) => device.task === 0);
  level1.value = plan.value.filter((device) => device.task === 1);
  level2.value = plan.value.filter((device) => device.task === 2);
  level3.value = plan.value.filter((device) => device.task === 3);
  level4.value = plan.value.filter((device) => device.task === 4);

  routineNo.value = routine.value.length
  level1No.value = level1.value.length
  level2No.value = level2.value.length
  level3No.value = level3.value.length
  level4No.value = level4.value.length

  console.log(routineNo.value);



}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

getPlan(Date.now())
getTodayPlan(Date.now())
getDailyPlan()



/**
 * type:
 * 0: 日常保养
 * 1：一级保养
 * 2：二级保养
 * 3：逾期一级保养
 * 4：逾期二级保养
 */
// const plan = ref([
//   {
//     name: "切割机器人",
//     section: "切割工位",
//     station: "型钢切割工作站",
//     task: 0,
//   },
//   {
//     name: "焊接机器人",
//     section: "上料工位",
//     station: "方通组焊工作站",
//     task: 1,
//   },
//   {
//     name: "焊接机器人",
//     section: "上料工位",
//     station: "地面钢网工作站",
//     task: 2,
//   },
//   {
//     name: "焊接机器人",
//     section: "总装工位",
//     station: "总装模块工作站",
//     task: 1,
//   },
//   {
//     name: "切割机器人",
//     section: "型钢工位",
//     station: "地面钢网工作站",
//     task: 2,
//   },
//   {
//     name: "焊接机器人",
//     section: "焊接工位",
//     station: "方通组焊工作站",
//     task: 1,
//   },
//   {
//     name: "焊接机器人",
//     section: "总装工位",
//     station: "总装模块工作站",
//     task: 2,
//   },
//   {
//     name: "切割机器人",
//     section: "切割工位",
//     station: "地面钢网工作站",
//     task: 0,
//   },
//   {
//     name: "焊接机器人",
//     section: "上料工位",
//     station: "型钢切割工作站",
//     task: 4,
//   },
//   {
//     name: "焊接机器人",
//     section: "上料工位",
//     station: "总装模块工作站",
//     task: 0,
//   },
//   {
//     name: "焊接机器人",
//     section: "上料工位",
//     station: "型钢切割工作站",
//     task: 3,
//   },
//   {
//     name: "焊接机器人",
//     section: "上料工位",
//     station: "型钢切割工作站",
//     task: 2,
//   },
//   {
//     name: "焊接机器人",
//     section: "切割工位",
//     station: "总装模块工作站",
//     task: 2,
//   },
//   {
//     name: "焊接机器人",
//     section: "上料工位",
//     station: "型钢切割工作站",
//     task: 3,
//   },
//   {
//     name: "焊接机器人",
//     section: "切割工位",
//     station: "地面钢网工作站",
//     task: 3,
//   },
//   {
//     name: "焊接机器人",
//     section: "切割工位",
//     station: "型钢切割工作站",
//     task: 4,
//   },
//   {
//     name: "焊接机器人",
//     section: "切割工位",
//     station: "地面钢网工作站",
//     task: 2,
//   },
//   {
//     name: "焊接机器人",
//     section: "切割工位",
//     station: "方通组焊工作站",
//     task: 4,
//   },
// ]);

</script>

<template>
  <div class="collapse">
    <el-collapse v-model="activeNames" @change="handleChange" style="
        --el-collapse-border-color: transparent;
        border: 0px;
        --el-collapse-content-bg-color: transparent;
      ">
      <el-collapse-item name="1" class="row">
        <template #title>
          今日维护保养任务
          <span class="num">
            {{ routineNo + level1No + level2No }}
            项</span></template>
        <el-collapse-item name="10" class="row">
          <template #title>
            日常保养
            <span class="num">
              {{ routineNo }}
              项</span></template>
          <el-table :data="routine" style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            ">
            <el-table-column prop="section" label="工段" />
            <el-table-column prop="station" label="工位" />
            <el-table-column prop="name" label="设备名称" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item name="11" class="row">
          <template #title>
            一级保养
            <span class="num">
              {{ level1No }}
              项</span></template>
          <el-table :data="level1" style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            ">
            <el-table-column prop="section" label="工段" />
            <el-table-column prop="station" label="工位" />
            <el-table-column prop="name" label="设备名称" /> </el-table></el-collapse-item>
        <el-collapse-item name="12" class="row">
          <template #title>
            二级保养
            <span class="num">
              {{ level2No }}
              项</span></template>
          <el-table :data="level2" style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            ">
            <el-table-column prop="section" label="工段" />
            <el-table-column prop="station" label="工位" />
            <el-table-column prop="name" label="设备名称" />
          </el-table>
        </el-collapse-item>
      </el-collapse-item>
      <el-collapse-item name="0" class="row">
        <template #title>
          逾期未完成维护保养任务
          <span class="num">
            {{ level3No + level4No }}
            项</span></template>
        <el-collapse-item name="01" class="row">
          <template #title>
            一级保养
            <span class="num">
              {{ level3No }}
              项</span></template>
          <el-table :data="level3" style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            ">
            <el-table-column prop="section" label="工段" />
            <el-table-column prop="station" label="工位" />
            <el-table-column prop="name" label="设备名称" /> </el-table></el-collapse-item>
        <el-collapse-item name="02" class="row">
          <template #title>
            二级保养
            <span class="num">
              {{ level4No }}
              项</span></template>
          <el-table :data="level4" style="
              width: 100%;
              --el-table-border: 0px;
              --el-table-text-color: #fff;
              --el-table-header-text-color: #fff;
              --el-table-bg-color: transparent;
              --el-table-header-bg-color: transparent;
              --el-table-tr-bg-color: transparent;
              --el-table-row-hover-bg-color: transparent;
            ">
            <el-table-column prop="section" label="工段" />
            <el-table-column prop="station" label="工位" />
            <el-table-column prop="name" label="设备名称" />
          </el-table>
        </el-collapse-item>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>



<style scoped>
.collapse {
  height: 30vh;
  margin: 1vh;
  overflow: auto;
  border-radius: 1vh;
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
  background-color: #3b639b71;

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
  background: radial-gradient(ellipse at bottom, #6b9ce6a4, transparent 90%),
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