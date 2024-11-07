<template>
  <div class="pieRow">
    <PieGraph :key="renderKey" class="graph" :total="total1" :offline="offline1" pieName="墙板生产线" />
    <PieGraph :key="renderKey" class="graph" :total="total2" :offline="offline2" pieName="总装工作站" />
  </div>
  <!-- <div class="pieRow pieRow2"> -->
  <!-- <PieGraph :key="renderKey" class="graph" :total="total3" :offline="offline3" pieName="方通组焊工作站" />
    <PieGraph :key="renderKey" class="graph" :total="total4" :offline="offline4" pieName="模块总装工作站" /> -->

  <!-- </div> -->
  <div class="workstations">

    <!-- 使用v-for指令来遍历工作站数组并为每个工作站创建一个工作站元素，元素的key是工作站的名字 -->
    <div class="workstation" v-for="workstation in tableData.value" :key="workstation.name">

      <!-- 显示工作站的名称 -->
      <!-- <div class="workstation-header">{{ workstation.name }}</div> -->
      <ul>
        <!-- 再次使用v-for指令来遍历工作站的组件数组，为每个组件创建一个列表元素，元素的key是组件的名字，类名是组件的状态，
                         这可以用来通过CSS改变不同状态的组件的颜色 -->
        <li v-for="component in workstation.components" :key="component.name" :class="component.status">
          <!-- 显示组件的名称 -->
          {{ component.name }}
          <el-button v-if="component.status == 'alarm'" class="confirm" @click="alarmConfirm(component.id)">
            检修
          </el-button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import PieGraph from "./PieGraph.vue";
import { ref, onMounted, reactive, onUnmounted, watch, computed } from "vue";
import { getDeviceAPI } from "../apis/data.js"

const total1 = ref(0)
const total2 = ref(0)
const offline1 = ref(0)
const offline2 = ref(0)

//刷新组件数据
const renderKey = ref(0)
const updateGraph = () => {
  renderKey.value = renderKey.value + 1
}


const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getDeviceAPI();
  // console.log(res.data);
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
    { name: '左侧夹具', section: '总装工作站', status: '正常运行' },
    { name: '右侧夹具', section: '总装工作站', status: '正常运行' },
    { name: '焊接桁架A', section: '总装工作站', status: '正常运行' },
    { name: '焊接桁架B', section: '总装工作站', status: '正常运行' },
    { name: '焊接机器人A', section: '总装工作站', status: '正常运行' },
    { name: '焊接机器人B', section: '总装工作站', status: '正常运行' },
    { name: '焊接机器人C', section: '总装工作站', status: '正常运行' },
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
    { name: '阻挡装置', section: '墙板生产线', status: '正常运行' }

  ]
  const station1 = [];
  const station2 = [];
  const stopped1 = [];
  const stopped2 = [];
  const section1 = { name: '墙板生产线', components: [] }
  const section2 = { name: '总装工作站', components: [] }
  for (const i in res.data) {
    const item = res.data[i]

    if (item.section === '墙板生产线') {
      station1.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
      if (item.status === "停机") {
        stopped1.push({ name: item.name, id: item.id })
      }
    }

    if (item.section === '总装工作站') {
      station2.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
      if (item.status === "停机") {
        stopped2.push({ name: item.name, id: item.id })
      }
    }

  }
  section1.components = station1
  section2.components = station2
  total1.value = station1.length
  total2.value = station2.length
  offline1.value = stopped1.length
  offline2.value = stopped2.length

  // console.log(offline1.value);
  tableData.value = [section1, section2]
  // console.log(tableData);
  // tableData.value = res.data.data;
  // total.value = res.data.total
  // updateSearchSuggestion()
  updateGraph()

};

//定时获取最新数据
getDataFromAPI()

let id

function start() {
  id = setInterval(function () {
    getDataFromAPI()
  }, 60000);
}
setTimeout(start, 1000);

onUnmounted(() => {
  clearInterval(id);
});
</script>
<style scoped>
.pieRow {
  display: flex;
  padding-left: 2%;
  flex-direction: row;
  position: relative;
  top: -5%;
}

.pieRow2 {
  top: -10%;
}

.graph {
  width: 40vh;
  height: 18vh;
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
}

.workstations {
  display: flex;
  justify-content: space-evenly;
  /* padding: 0 1vh; */
  margin-top: -1vh;
  height: 19vh;
}

.workstation {
  /* background-color: white; */
  /* border-radius: 1vh; */
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
  /* padding: 0 25px 25px; */
  width: 45%;
  text-align: center;
  padding-left: 1vh;
  /* margin: 0 30px; */
  height: 14vh;
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
  /* margin-top: 40px; */
}

.workstation li {
  /* margin: 1vh 0; */
  /* 增加垂直边距 */
  padding: 5px;
  /* 增加内边距 */
  color: white;
  font-size: 13px;
  font-weight: 400;
  text-shadow: 1px -1px 5px #a3ccf9;
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

@keyframes blink {

  0%,
  100% {
    opacity: 1;
    /* 初始和结束时完全显示 */
  }

  50% {
    opacity: 0.5;
    /* 中间时刻半透明 */
  }
}

.normal::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  /* background-color: #8db2a1; */
  background-color: #6ea3d7;

  box-shadow: 1px -1px 3px #e1e9e9, 0 0 8px #cae7da;
  ;
  border-radius: 50%;
  left: 1vh;
  top: 50%;
  transform: translateY(-50%);
  animation: blink 2s infinite;
}

.stopped::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: grey;
  border-radius: 50%;
  left: 1vh;
  top: 50%;
  transform: translateY(-50%);
}

.maintenance::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ff9a02a0;
  border-radius: 50%;
  left: 1vh;
  top: 50%;
  transform: translateY(-50%);
}

.alarm::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #e26237ab;
  border-radius: 50%;
  left: 1vh;
  top: 50%;
  transform: translateY(-50%);
}

.confirm {
  color: #e26237ab;
  position: absolute;
  width: 10px;
  height: 10px;
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

ul :nth-child(1) {
  animation: fadeInUpBig;
  animation-duration: 1s;
}

ul :nth-child(2) {
  animation: fadeInUpBig;
  animation-duration: 1.2s;
}

ul :nth-child(3) {
  animation: fadeInUpBig;
  /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1.4s;
}

ul :nth-child(4) {
  animation: fadeInUpBig;
  animation-duration: 1.6s;
}

ul :nth-child(5) {
  animation: fadeInUpBig;
  animation-duration: 1.8s;
}

ul :nth-child(6) {
  animation: fadeInUpBig;
  animation-duration: 2s;
}
</style>