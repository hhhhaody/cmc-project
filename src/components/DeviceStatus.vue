<template>
  <div class="pieRow">
    <PieGraph class="graph" :online="1200" :offline="30" pieName="型钢切割工作站" />
    <PieGraph class="graph" :online="1100" :offline="98" pieName="地面钢网工作站" />
  </div>
  <div class="pieRow pieRow2">
    <PieGraph class="graph" :online="788" :offline="29" pieName="方通组焊工作站" />
    <PieGraph class="graph" :online="1000" :offline="130" pieName="模块总装工作站" />

  </div>
</template>
<script setup>
import PieGraph from "./PieGraph.vue";

const props = defineProps({
  pieName: { type: String, default: "全部设备" },
  online: { type: Number, default: 1250 },
  offline: { type: Number, default: 320 },
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
</style>