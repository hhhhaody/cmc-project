<script setup>
import { ref, reactive, computed } from "vue";
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";
// import PaginationComponent from "../components/PaginationComponent.vue";

// 初始化一个reactive的images数组，数组元素包含图片的url和日期
const images = reactive([
    { url: '/public/CandidImages/candid1.jpeg', date: '2023-07-31 11:20:33' },
    { url: '/public/CandidImages/candid2.jpeg', date: '2023-07-31 14:01:56' },
    { url: '/public/CandidImages/candid3.jpeg', date: '2023-07-29 13:30:23' },
    { url: '/public/CandidImages/candid4.jpeg', date: '2023-07-28 10:51:08' },
    { url: '/public/CandidImages/candid5.jpeg', date: '2023-07-27 09:24:45' },
    { url: '/public/CandidImages/candid6.jpeg', date: '2023-07-26 08:56:05' },
    { url: '/public/CandidImages/candid7.jpeg', date: '2023-07-26 16:35:09' },
    { url: '/public/CandidImages/candid8.jpeg', date: '2023-07-26 13:45:54' },
    { url: '/public/CandidImages/candid9.jpeg', date: '2023-07-24 12:06:18' },
    { url: '/public/CandidImages/candid10.jpeg', date: '2023-07-24 17:02:19' },
    { url: '/public/CandidImages/candid11.jpeg', date: '2023-07-24 19:01:36' },
    { url: '/public/CandidImages/candid12.jpeg', date: '2023-07-34 13:33:44' },
    { url: '/public/CandidImages/candid13.jpeg', date: '2023-07-23 12:26:46' },
    { url: '/public/CandidImages/candid14.jpeg', date: '2023-07-22 11:52:57' },
    { url: '/public/CandidImages/candid15.jpeg', date: '2023-06-22 08:35:38' },
    { url: '/public/CandidImages/candid16.jpeg', date: '2023-06-22 07:49:29' },
    { url: '/public/CandidImages/candid17.jpeg', date: '2023-06-20 11:17:30' },
    { url: '/public/CandidImages/candid18.jpeg', date: '2023-06-20 12:14:58' },
    { url: '/public/CandidImages/candid19.jpeg', date: '2023-05-20 17:14:45' },
    { url: '/public/CandidImages/candid20.jpeg', date: '2023-05-19 18:13:37' },
    { url: '/public/CandidImages/candid21.jpeg', date: '2023-05-18 19:10:26' },
]);

// 使用images数组生成一个新的srcList数组，只包含每个元素的url
let srcList = reactive(images.map(image => image.url));

// 定义一个ref用于存储分页显示的图片
let displayedImages = ref([]); 

// 定义一个处理表格更新的函数，新的表格数据会被赋值给displayedImages，页面大小会被更新
const handleTableUpdate = (newTableData) => {
    displayedImages.value = newTableData.value;
    pageSize.value = newTableData.pageSize;
}

// 定义一个ref用于存储搜索字符串的值
const value = ref('')

// 定义一个ref用于存储默认的时间范围
const defaultTime = ref < [Date, Date] > ([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
])

// 定义一个查询函数，该函数会按照给定的日期范围筛选图片
const query = () => {
    // 输出查询日期
    console.log('查询日期：', value.value);
    // 当value的值存在，并且长度为2（代表日期范围）时，进行图片筛选
    if (value.value && value.value.length === 2) {
        // 解构赋值开始和结束日期
        const [startDate, endDate] = value.value;
        // 用filter方法筛选images，返回在开始和结束日期之间的图片
        displayedImages.value = images.filter(image => {
            const imageDate = new Date(image.date);
            return imageDate >= startDate && imageDate <= endDate;
        });
    }
};

// 定义一个PaginationComponent的ref，用于保存PaginationComponent组件的实例
const paginationComponent = ref(null);

// 定义一个重置函数，该函数会重置value的值，并将所有图片赋值给displayedImages，并重置PaginationComponent
const reset = () => {
    value.value = '';
    displayedImages.value = images;
    paginationComponent.value.reset();
};

// 定义一个ref用于存储页面大小
let pageSize = ref(10);

// 定义一个computed属性用于计算网格列的样式，当pageSize的值大于20或10时，返回'repeat(5, 1fr)'，否则返回'repeat(5, 1fr)'
const gridColumns = computed(() => {
    if (pageSize.value > 20) {
        return 'repeat(5, 1fr)';
    } else if (pageSize.value > 10) {
        return 'repeat(5, 1fr)';
    } else {
        return 'repeat(5, 1fr)';
    }
});

</script>

<template>
    <!-- DvBorderBox1 组件用于创建一个具有边框和背景色的容器 -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
        background-color="#4f698794">

        <!-- 空行和标题 -->
        <br />
        <h1>安全抓拍记录</h1>

        <!-- 日期选择和查询重置按钮区域 -->
        <div class="demo-date-picker">
            <div class="block">
                <p>日期</p>

                <!-- 使用 Element UI 的日期范围选择器组件 -->
                <el-date-picker v-model="value" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                    :default-time="defaultTime" />

                <!-- 查询和重置按钮 -->
                <el-button type="primary" class="button-margin" @click="query">查询</el-button>
                <el-button type="info" class="button-margin" @click="reset">重置</el-button>
            </div>
        </div>

        <!-- 图片展示区域 -->
        <div class="image-container" :style="{ 'grid-template-columns': gridColumns }">

            <!-- 使用 v-for 指令来循环渲染 displayedImages 中的每一项 -->
            <div class="image-item" v-for="(item, index) in displayedImages" :key="index">
                <div class="demo-image__preview">

                    <!-- 使用 Element UI 的图片组件来展示图片，支持点击放大查看 -->
                    <el-image style="display: block" :src="item.url" :zoom-rate="1.2" :preview-src-list="srcList"
                        :initial-index="index" fit="cover" />
                </div>

                <!-- 显示图片的日期 -->
                <p>{{ item.date }}</p>
            </div>
        </div>

        <!-- 分页组件区域 -->
        <div>

            <!-- Element UI 的 Footer 组件用于包裹分页组件 -->
            <el-footer style="display: flex; justify-content: center">

                <!-- 自定义的 PaginationComponent 分页组件 -->
                <PaginationComponent ref="paginationComponent" :tableData="images" :total="images.length" :pageSize="10"
                    @table="handleTableUpdate" />

            </el-footer>
        </div>
    </dv-border-box1>
</template>

<style scoped>
.subNavPage {
    border-radius: 3%; /* 页面的圆角大小 */
    color: #fff; /* 页面的字体颜色 */
    height: 100%; /* 页面的高度 */
    width: 95%; /* 页面的宽度 */
    margin: 0 auto; /* 页面居中显示 */
    position: relative; /* 页面的定位方式 */
}

.el-footer {
    position: absolute; /* footer的定位方式为绝对定位 */
    bottom: 0; /* 使footer位于父元素的底部 */
    width: 100%; /* footer的宽度为父元素的100% */
}

.image-container {
    display: grid; /* 图片容器的布局方式为网格布局 */
    grid-template-columns: repeat(5, 1fr); /* 定义了5列，每列占用相同的空间 */
    grid-row-gap: 0px; /* 定义网格行间的空白大小 */
    grid-column-gap: -10px; /* 定义网格列间的空白大小 */
    padding-left: 70px; /* 容器的左内边距 */
    padding-top: 20px; /* 容器的顶部内边距 */
    height: 550px; /* 容器的高度 */
    overflow: auto; /* 如果内容溢出，则显示滚动条 */
    scrollbar-width: thin; /* 滚动条的宽度 */
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* 滚动条的颜色 */
}

.image-item {
    display: flex; /* 图片项目的布局方式为弹性盒布局 */
    flex-direction: column; /* 子元素的排列方式为垂直方向 */
    align-items: center; /* 子元素在交叉轴上的对齐方式为居中 */
    justify-content: center; /* 子元素在主轴上的对齐方式为居中 */
    font-weight: bold; /* 文字的字体粗细 */
    max-width: 80%; /* 项目的最大宽度 */
    max-height: 80%; /* 项目的最大高度 */
}

.demo-date-picker {
    display: flex; /* 日期选择器的布局方式为弹性盒布局 */
    width: 100%; /* 日期选择器的宽度 */
    padding: 0; /* 日期选择器的内边距 */
    flex-wrap: wrap; /* 如果一行上的项目无法容纳，则移动到新行 */
}

.demo-date-picker .block {
    padding: 30px 0; /* 区块的顶部和底部内边距 */
    text-align: left; /* 文本的对齐方式 */
    border-right: solid 1px var(--el-border-color); /* 区块右边的边框 */
    padding-left: 160px; /* 区块的左内边距 */
    display: flex; /* 区块的布局方式为弹性盒布局 */
    align-items: center; /* 子元素在交叉轴上的对齐方式为居中 */
}

.demo-date-picker .block:last-child {
    border-right: none; /* 最后一个区块的右边没有边框 */
}

.demo-date-picker p {
    margin-right: 10px; /* 段落右边的外边距 */
}

.image-container::-webkit-scrollbar {
    width: 8px; /* 滚动条的宽度 */
}

.image-container::-webkit-scrollbar-track {
    background: transparent; /* 滚动条轨道的背景颜色 */
}

.image-container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2); /* 滚动条的颜色 */
    border-radius: 4px; /* 滚动条的圆角大小 */
}

.image-container:hover::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2); /* 鼠标悬停时滚动条的颜色 */
}

.image-container:hover {
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* 鼠标悬停时滚动条的颜色 */
}

.button-margin {
    margin-left: 10px; /* 按钮左边的外边距 */
}
</style>