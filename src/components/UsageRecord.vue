<template>
  <el-table
    :data="tableData"
    size="small"
    style="background-color: rgb(0, 0, 0, 0); padding-top: 5%"
    table-layout="fixed"
    height="35vh"
    show-overflow-tooltip
    :header-row-style="headerRowStyle"
    :header-cell-style="headerCellStyle"
    :row-style="rowStyle"
    :cell-style="cellStyle"
  >
    <!-- <el-table-column type="index" :index="indexMethod" /> -->
    <el-table-column prop="name" label="Name" min-width="80em" />
    <el-table-column prop="size" label="Size" min-width="65em" />
    <el-table-column prop="remains" label="Remains" min-width="70em" />
    <el-table-column prop="used" label="Used" min-width="50em" />
    <el-table-column prop="progress" label="Progress">
      <template #default="scope"
        ><GaugeGraph class="graph" :value="scope.row.progress"></GaugeGraph
      ></template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import GaugeGraph from "./GaugeGraph.vue";
// const indexMethod = (index) => {
//   return index + 1;
// };
const tableData = [
  {
    name: "Material 1",
    size: "300x300",
    remains: 50,
    used: 20,
    progress: 80,
  },
  {
    name: "Material 2",
    size: "200x200",
    remains: 30,
    used: 20,
    progress: 50,
  },
  {
    name: "Material 3",
    size: "200x300",
    remains: 25,
    used: 30,
    progress: 90,
  },
  {
    name: "Material 4",
    size: "200x200",
    remains: 40,
    used: 40,
    progress: 57,
  },
  {
    name: "Material 5",
    size: "400x200",
    remains: 30,
    used: 30,
    progress: 66,
  },
  {
    name: "Material 5",
    size: "400x200",
    remains: 30,
    used: 30,
    progress: 66,
  },
  {
    name: "Material 5",
    size: "400x200",
    remains: 30,
    used: 30,
    progress: 66,
  },
];

function headerRowStyle({ row, rowIndex }) {
  return {
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: "white",
    textAlign: "center",
    height: "4vh",
  };
}
function headerCellStyle({ row, column, rowIndex, columnIndex }) {
  return {
    backgroundColor: "rgba(0, 0, 0, 0)",
    padding: "0px",
    // borderBottom: "1px solid rgb(8, 171, 238)",
    borderBottom: "0px",
    textAlign: "center",
  };
}
function rowStyle({ row, rowIndex }) {
  return {
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: "white",
    textAlign: "center",
    // height: "2vh",
  };
}
function cellStyle({ row, column, rowIndex, columnIndex }) {
  return {
    // display: "flex",
    backgroundColor: "rgba(0, 0, 0, 0)",
    border: "none",
    textAlign: "center",
  };
}
</script>

<style scoped>
:deep .el-table__inner-wrapper::before {
  height: 0px;
}
.graph {
  width: 100%;
  height: 6vh;
}
</style>