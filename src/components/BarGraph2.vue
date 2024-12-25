<template>
    <div>
        <div ref="BarChartRef" class="echart" :key="renderKey"></div>
    </div>
</template>
<script setup>
import { ref, onMounted, inject, watch, reactive, onUnmounted } from "vue";
import { getProductInventoryAmountAPI } from "../apis/data"


const BarChartRef = ref();
//刷新组件数据
const renderKey = ref(0)
const updateGraph = () => {
    renderKey.value = renderKey.value + 1
}

const props = defineProps({
    station: { type: String },
    stations: { type: Array },
});

const x = ref([])
const y = ref([]);
const y2 = ref([])
const total = ref(0)

//   // console.log(props.station),
//   {
//     value:,
//     name: "销量",
//   },
//   {
//     value:[50, 25, 40, 15, 18, 28],
//     name: "销量",
//   },
// ];

// console.log(data.value[1]);

const getDataFromAPI = async () => {

    x.value = []
    y.value = []
    y2.value = []
    total.value = 0

    let res
    res = await getProductInventoryAmountAPI(props.station);
    // if (props.station === '总装工作站') {
    //     res = await getProductInventoryAmountAPI('型钢切割工作站');

    //     res.data = [
    //         { name: '4F', 总装工作站: 6, 总装工作站2: 11, spec: '模块' },
    //         { name: '5F', 总装工作站: 5, 总装工作站2: 11, spec: '模块' },
    //         { name: '6F', 总装工作站: 8, 总装工作站2: 11, spec: '模块' },
    //         { name: '7F', 总装工作站: 3, 总装工作站2: 11, spec: '模块' },
    //         { name: '8F', 总装工作站: 6, 总装工作站2: 11, spec: '模块' },
    //         { name: '9F', 总装工作站: 0, 总装工作站2: 8, spec: '模块' },
    //         { name: '10F', 总装工作站: 0, 总装工作站2: 8, spec: '模块' },
    //         { name: '11F', 总装工作站: 0, 总装工作站2: 6, spec: '模块' },
    //         { name: '12F', 总装工作站: 0, 总装工作站2: 6, spec: '模块' },
    //         { name: '13F', 总装工作站: 0, 总装工作站2: 3, spec: '模块' },
    //         { name: '14F', 总装工作站: 0, 总装工作站2: 3, spec: '模块' }
    //     ]


    // }
    // else if (props.station === '墙板生产线') {
    //     res = await getProductInventoryAmountAPI('型钢切割工作站');

    //     res.data = [
    //         { name: '(F1.1#.4F)-A#模块箱', 墙板生产线: 5, 墙板生产线2: 6, spec: '墙板' },
    //         { name: '(F1.1#.4F)-C#模块箱', 墙板生产线: 2, 墙板生产线2: 4, spec: '墙板' },
    //         { name: '(F1.1#.4F)-D#模块箱', 墙板生产线: 6, 墙板生产线2: 7, spec: '墙板' },
    //         { name: '(F1.1#.4F)-E#模块箱', 墙板生产线: 5, 墙板生产线2: 5, spec: '墙板' },
    //         { name: '(F1.1#.4F)-F#模块箱', 墙板生产线: 2, 墙板生产线2: 2, spec: '墙板' },
    //         { name: '(F1.1#.4F)-G#模块箱', 墙板生产线: 4, 墙板生产线2: 4, spec: '墙板' },
    //         { name: '(F1.1#.4F)-H#模块箱', 墙板生产线: 6, 墙板生产线2: 4, spec: '墙板' },
    //         { name: '(F1.1#.4F)-I#模块箱', 墙板生产线: 6, 墙板生产线2: 6, spec: '墙板' },
    //         { name: '(F1.1#.4F)-J#模块箱', 墙板生产线: 3, 墙板生产线2: 4, spec: '墙板' },
    //         { name: '(F1.1#.4F)-K#模块箱', 墙板生产线: 2, 墙板生产线2: 2, spec: '墙板' },
    //         { name: '(F1.1#.4F)-L#模块箱', 墙板生产线: 4, 墙板生产线2: 5, spec: '墙板' }
    //     ]

    // }
    // else {
    //     res = await getProductInventoryAmountAPI(props.station);

    // }

    // console.log(res.data);

    for (const i in res.data) {
        const item = res.data[i]
        x.value.push(item.name)
        y.value.push({ value: item.value, spec: item.spec })
        total.value = total.value + item.value

        // console.log(x.value);
        // console.log(y.value)

        BarChart.setOption({
            graphic: {
                type: 'text',
                right: '10%',
                top: '5%',
                style: {
                    text: `总产量: ${total.value}`,
                    fontSize: 15,
                    fill: '#fff'
                }
            },
            xAxis: {
                data: x.value,
            },
            series: [
                {
                    data: y.value,
                    name: '完成生产'
                },
            ],
        });

    }

    // for (const i in res.data) {
    //     const item = res.data[i]
    //     x.value.push(item.name)
    //     y.value.push({ value: item[props.value], spec: item.spec })

    //     // if (props.station === '总装工作站' || props.station === '墙板生产线') {
    //     //     y2.value.push({ value: item[`${props.station}2`], spec: item.spec })


    //     // }
    //     // console.log(x.value);
    //     // console.log(y.value)

    //     BarChart.setOption({
    //         xAxis: {
    //             data: x.value,
    //         },
    //         series: [
    //             {
    //                 data: y.value,
    //                 name: '实际产量',
    //                 label: {
    //                     show: true,
    //                     position: "top",
    //                     formatter: ({ value }) => (value === 0 ? "" : value), // 不显示值为0的标签
    //                 },
    //             },
    //             {
    //                 data: y2.value,
    //                 name: '计划产量'
    //             },
    //         ],
    //     });

    // }

};


let BarChart;

getDataFromAPI(props.station)

onMounted(() => {
    // 注入echarts实例
    const echarts = inject("echarts");
    // 基于准备好的dom，初始化echarts实例
    BarChart = echarts.init(BarChartRef.value, "vintage");
    // 绘制图表
    BarChart.setOption({
        // title: {
        //   text: "Bar Chart",
        // },
        tooltip: {
            // trigger: "item",
            // axisPointer: {
            //   type: "shadow", // 鼠标悬浮时显示阴影效果
            // },
            formatter(params) { // 自定义提示信息的内容
                // var station = params[0].name; // 获取柱状图对应的站点名称
                // var value = params[0].value; // 获取柱状图的值
                return ` ${params.name}：${params.data.value}`; // 返回自定义的提示信息
                console.log(params);
            },
        },

        xAxis: {
            data: x.value,
        },
        yAxis: {},
        // grid: {
        //   bottom: "15%",
        // },
        series: [
            {
                type: "bar",
                data: y.value,

                // itemStyle: {
                //     color: {
                //         type: "linear",
                //         x: 0,
                //         y: 0,
                //         x2: 0,
                //         y2: 1,
                //         colorStops: [
                //             {
                //                 offset: 1,
                //                 color: "#339a528b", // 100% 处的颜色
                //             },
                //             {
                //                 offset: 0.5,
                //                 color: "#9ec2c6", // 50% 处的颜色
                //             },
                //             {
                //                 offset: 0,
                //                 color: "#e5f3ef", // 0% 处的颜色
                //             },
                //         ],
                //         global: false, // 缺省为 false
                //     },
                //     opacity: 0.8,
                // },
            }
        ],
    });
});
// console.log(props.station);
watch(
    () => props,
    (newVal) => {
        // console.log(props.station);
        getDataFromAPI(props.station)

        BarChart.setOption({
            xAxis: {
                data: x.value,
            },
            series: [
                {
                    data: y.value,
                },
            ],
        });
    },
    {
        deep: true,
    }
);

//定时获取最新数据
let id

function start() {
    id = setInterval(function () {
        console.log("获取产品生产数据");
        getDataFromAPI()
    }, 30000);
}
// setTimeout(start, 1000);

onUnmounted(() => {
    clearInterval(id);
});

</script>
<style lang="scss" scoped>
.echart {
    width: 100%;
    height: 100%;
}
</style>