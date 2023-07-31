<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({
  searchTitle: { type: String, default: "Material Name" },
  wNo: { type: Number },
  loadAllData: {
    type: Function,
    default: () => {
      return [
        { value: "material 1", link: "https://github.com/vuejs/vue" },
        { value: "material 2", link: "https://github.com/ElemeFE/element" },
        { value: "material 3", link: "https://github.com/ElemeFE/cooking" },
        { value: "material 4", link: "https://github.com/ElemeFE/mint-ui" },
        { value: "material 5", link: "https://github.com/vuejs/vuex" },
        { value: "material 6", link: "https://github.com/vuejs/vue-router" },
      ];
    },
  },
});

const emit = defineEmits(["search"]);

const placeholder = ref("");
placeholder.value = "请输入" + props.searchTitle.toLowerCase();

const searchResult = ref([]);
const searchContent = ref("");

let timeout;
const querySearchAsync = (queryString, cb) => {
  const results = queryString
    ? searchResult.value.filter(createFilter(queryString))
    : searchResult.value;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cb(results);
  }, 1000 * Math.random());
};

const createFilter = (queryString) => {
  return (searchFrom) => {
    return (
      searchFrom.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

const handleSelect = (item) => {
  // console.log(props.searchTitle);
  emit("search", props.searchTitle, item.value);
};

onMounted(() => {
  searchResult.value = props.loadAllData();
});

defineExpose({ searchContent });
</script>

<template>
  {{ props.searchTitle }}:
  <el-autocomplete
    style="margin: 0 1vh"
    :style="{ width: props.wNo + '%' }"
    v-model="searchContent"
    :fetch-suggestions="querySearchAsync"
    clearable
    :placeholder="placeholder"
    @select="handleSelect"
  />
</template>