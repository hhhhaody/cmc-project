<script setup>
import { ref, onMounted } from "vue";
import { getSearchSuggestionAPI, getSearchAdvanceSuggestionAPI } from "../apis/util";

const props = defineProps({
  searchTitle: { type: String, default: "Material Name" },
  searchContent: { type: String, default: "" },
  hideTitle: { type: Boolean, default: false },
  wNo: { type: Number },
  database: { type: String, default: "materials" },
  field: { type: String, default: "id" },
  data: { type: Object, default: null }
});

const emit = defineEmits(["search", "edit"]);

const placeholder = ref("");
placeholder.value = "请输入" + props.searchTitle.toLowerCase();

const searchResult = ref([]);

const searchContent = ref(props.searchContent);

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
    return searchFrom.value.toLowerCase().includes(queryString.toLowerCase());
  };
};

const handleSelect = (item) => {
  emit("search", props.field, item.value);
};

const check = (val) => {
  emit("search", props.field, val);

}

const focus = () => {
  emit("edit", true);
  // console.log("editing");
}
const blur = () => {
  emit("edit", false);
  // console.log("not editing");
}

const loadSuggestion = async () => {
  console.log(props.data === null);
  if (props.data === null) {
    const res = await getSearchSuggestionAPI(props.database, props.field)
    searchResult.value = res.data
  }
  else {
    const res = await getSearchAdvanceSuggestionAPI(props.database, props.field, props.data)
    searchResult.value = res.data
  }

};


onMounted(() => {
  loadSuggestion()
});



defineExpose({ searchContent });
</script>

<template>
  <template v-if="props.hideTitle === false">{{ props.searchTitle }}:
    <el-autocomplete style="margin: 0 1vh;" :style="{ width: props.wNo + '%' }" v-model="searchContent"
      :fetch-suggestions="querySearchAsync" :placeholder="placeholder" @select="handleSelect" @change="check"
      @focus="focus" @blur="blur" />
  </template>
  <template v-else>
    <el-autocomplete :style="{ width: props.wNo + '%' }" v-model="searchContent" :fetch-suggestions="querySearchAsync"
      clearable :placeholder="placeholder" @select="handleSelect" @change="check" @focus="focus" @blur="blur" />
  </template>
</template>