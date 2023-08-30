<script setup>
import { ref, onMounted, toRefs } from "vue";
import { getDialogSearchSuggestionAPI } from "../apis/util";

const props = defineProps({
    searchTitle: { type: String, default: "Material Name" },
    searchContent: { type: String, default: "" },
    wNo: { type: Number },
    database: { type: String, default: "materials" },
    field: { type: String, default: "id" },
    data: { type: Object }
});

const emit = defineEmits(["search"]);

const placeholder = ref("");
placeholder.value = "请选择" + props.searchTitle.toLowerCase();

const searchResult = ref([]);
// const searchContent = toRefs(props).searchContent
const searchContent = ref(props.searchContent)


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
    emit("search", props.field, item.value);
};

const check = (val) => {
    emit("search", props.field, val);

}


const loadSuggestion = async () => {
    const res = await getDialogSearchSuggestionAPI(props.database, props.field, props.data)
    searchResult.value = res.data
};

onMounted(() => {
    loadSuggestion()
});



defineExpose({ searchContent });
</script>

<template>
    <el-autocomplete :style="{ width: props.wNo + '%' }" v-model="searchContent" :fetch-suggestions="querySearchAsync"
        clearable :placeholder="placeholder" @select="handleSelect" @change="check" />
</template>

<style scoped></style>