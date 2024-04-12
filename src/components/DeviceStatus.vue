<template>
  <div class="pieRow">
    <PieGraph :key="renderKey" class="graph" :total="total1" :offline="offline1" pieName="型钢切割工作站" />
    <PieGraph :key="renderKey" class="graph" :total="total2" :offline="offline2" pieName="地面钢网工作站" />
  </div>
  <div class="pieRow pieRow2">
    <PieGraph :key="renderKey" class="graph" :total="total3" :offline="offline3" pieName="方通组焊工作站" />
    <PieGraph :key="renderKey" class="graph" :total="total4" :offline="offline4" pieName="模块总装工作站" />

  </div>
</template>
<script setup>
import PieGraph from "./PieGraph.vue";
import { ref, onMounted, reactive, onUnmounted, watch, computed } from "vue";
import { getDeviceAPI } from "../apis/data.js"

const total1 = ref(0)
const total2 = ref(0)
const total3 = ref(0)
const total4 = ref(0)
const offline1 = ref(0)
const offline2 = ref(0)
const offline3 = ref(0)
const offline4 = ref(0)

//刷新组件数据
const renderKey = ref(0)
const updateGraph = () => {
  renderKey.value = renderKey.value + 1
}


const tableData = reactive([]);
const total = ref(0)
const getDataFromAPI = async () => {
  const res = await getDeviceAPI();
  console.log(res.data);
  const station1 = [];
  const station2 = [];
  const station3 = [];
  const station4 = [];
  const stopped1 = [];
  const stopped2 = [];
  const stopped3 = [];
  const stopped4 = [];
  const section1 = { name: '型钢切割工作站', components: [] }
  const section2 = { name: '地面钢网工作站', components: [] }
  const section3 = { name: '方通组焊工作站', components: [] }
  const section4 = { name: '模块总装工作站', components: [] }
  for (const i in res.data) {
    const item = res.data[i]

    if (item.section === '型钢切割工作站') {
      station1.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
      if (item.status === "停机") {
        stopped1.push({ name: item.name, id: item.id })
      }
    }

    if (item.section === '地面钢网工作站') {
      station2.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
      if (item.status === "停机") {
        stopped2.push({ name: item.name, id: item.id })
      }
    }
    if (item.section === '方通组焊工作站') {
      station3.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
      if (item.status === "停机") {
        stopped3.push({ name: item.name, id: item.id })
      }
    }
    if (item.section === '模块总装工作站') {
      station4.push({ name: item.name, id: item.id, status: item.status === '检修维护' ? 'maintenance' : item.status === '正常运行' ? 'normal' : item.status === '报警' ? 'alarm' : 'stopped' })
      if (item.status === "停机") {
        stopped4.push({ name: item.name, id: item.id })
      }
    }
  }
  section1.components = station1
  section2.components = station2
  section3.components = station3
  section4.components = station4
  total1.value = station1.length
  total2.value = station2.length
  total3.value = station3.length
  total4.value = station4.length
  offline1.value = stopped1.length
  offline2.value = stopped2.length
  offline3.value = stopped3.length
  offline4.value = stopped4.length

  console.log(offline1.value);
  tableData.value = [section1, section2, section3, section4]
  // console.log(tableData);
  // tableData.value = res.data.data;
  // total.value = res.data.total
  // updateSearchSuggestion()
  updateGraph()

};


getDataFromAPI()
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
</style>