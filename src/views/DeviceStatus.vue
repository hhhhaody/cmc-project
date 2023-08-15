<!-- 
与后端数据对接说明：
如果你的后端返回的设备状态不是以下四个字符串：'normal', 'stopped', 'maintenance', 'alarm'，
例如是数字代码或其他字符串，你需要添加一层转换逻辑。

比如，如果后端返回1表示'normal'，2表示'stopped'，3表示'maintenance'，4表示'alarm'，
你可以在模板中添加一个方法将这些数字转换为相应的字符串。这个方法可以在<script setup>部分定义。

下面是一个转换方法的示例：

<script setup>
// ...你的其他代码...
// 定义一个方法将状态代码转换为状态字符串
const statusToString = status => {
    switch (status) {
        case 1: return 'normal';
        case 2: return 'stopped';
        case 3: return 'maintenance';
        case 4: return 'alarm';
        default: return 'unknown'; // 你可以为未知的状态代码指定一个默认的状态
    }
}
</script>

在模板中使用这个方法来绑定class，代码如下：
    
<li v-for="component in workstation.components" :key="component.name" :class="[statusToString(component.status), 'status-indicator']">
    {{ component.name }}
</li>

这样，无论后端返回什么设备状态代码，只要你的statusToString方法能正确地将它转换为相应的字符串，你的颜色就会自动变换。 -->




<script setup>
// 导入vue3的一些基本方法和功能，包括引用(ref)，组件挂载事件(onMounted)和响应式对象(reactive)
import { ref, onMounted, reactive } from "vue";

// 导入datav-vue3的一个组件BorderBox1，这是一个为数据可视化设计的组件库，BorderBox1可能是一个边界框组件
import { BorderBox1 as DvBorderBox1 } from "@kjgl77/datav-vue3";

// 定义了一个响应式对象workstations，这是一个数组，包含了多个工作站对象，每个工作站对象都有一个名字和一个组件数组
// 组件数组包含了该工作站的所有组件，每个组件都有一个名字和一个状态，状态可以是"normal"（正常）, "stopped"（停止）, "maintenance"（维护）, "alarm"（警报）
const workstations = reactive([
    {
        name: "型钢切割工作站",
        components: [
            { name: "滚筒线", status: "normal" },
            { name: "焊接工装夹具", status: "normal" },
            { name: "焊接机器人", status: "normal" },
            { name: "焊机", status: "normal" },
            { name: "桁架", status: "stopped" },
            { name: "翻转机1", status: "maintenance" },
            { name: "翻转机2", status: "alarm" },
        ]
    }, {
        name: "地面钢网工作站",
        components: [
            { name: "滚筒线", status: "normal" },
            { name: "焊接工装夹具", status: "stopped" },
            { name: "焊接机器人", status: "normal" },
            { name: "焊机", status: "maintenance" },
            { name: "桁架", status: "stopped" },
            { name: "翻转机1", status: "alarm" },
            { name: "反向起拱设备", status: "normal" },
            { name: "翻转机2", status: "normal" },
            { name: "打钉设备", status: "normal" },
        ]
    }, {
        name: "方通组焊工作站",
        components: [
            { name: "前三轴桁架", status: "normal" },
            { name: "激光切割机", status: "normal" },
            { name: "折弯机器人", status: "normal" },
            { name: "焊接工装夹具", status: "normal" },
            { name: "焊接机器人", status: "normal" },
            { name: "后三轴桁架", status: "normal" },
            { name: "打磨工装夹具", status: "normal" },
            { name: "打磨机器人", status: "normal" },
        ]
    }, {
        name: "模块总装工作站",
        components: [
            { name: "滚筒线", status: "normal" },
            { name: "焊接工装夹具", status: "stopped" },
            { name: "焊接机器人", status: "maintenance" },
            { name: "焊机", status: "alarm" },
            { name: "桁架", status: "normal" },
            { name: "翻转机1", status: "normal" },
            { name: "翻转机2", status: "normal" },
        ]
    },

]);

</script>

<template>
    <!-- 使用dv-border-box1组件作为主要的布局容器，通过ref引用这个组件以便在其他地方操作它。这个组件被赋予了一个动画类，使它在进入时有一个放大的动画效果。
         其颜色属性设置了边界的颜色，背景颜色属性设置了背景的颜色 -->
    <dv-border-box1 ref="borderRef" class="subNavPage animate__animated animate__zoomIn" :color="['#4f698794', '#4f698794']"
        background-color="#4f698794">
        <br />
        <!-- 标题显示为"设备运行监测" -->
        <h1>设备运行监测</h1>

        <!-- 描述每种颜色对应的设备状态的说明部分 -->
        <div class="status-description">
            <span class="status-item">
                绿色：正常运行
            </span>
            <span class="status-item">
                灰色：停机
            </span>
            <span class="status-item">
                黄色：检修维护
            </span>
            <span class="status-item">
                红色：报警
            </span>
        </div>

        <!-- 用于显示所有工作站的容器 -->
        <div class="workstations">

            <!-- 使用v-for指令来遍历工作站数组并为每个工作站创建一个工作站元素，元素的key是工作站的名字 -->
            <div class="workstation" v-for="workstation in workstations" :key="workstation.name">

                <!-- 显示工作站的名称 -->
                <div class="workstation-header">{{ workstation.name }}</div>
                <ul>
                    <!-- 再次使用v-for指令来遍历工作站的组件数组，为每个组件创建一个列表元素，元素的key是组件的名字，类名是组件的状态，
                         这可以用来通过CSS改变不同状态的组件的颜色 -->
                    <li v-for="component in workstation.components" :key="component.name" :class="component.status">
                        <!-- 显示组件的名称 -->
                        {{ component.name }}
                    </li>
                </ul>
            </div>
        </div>

    </dv-border-box1>
</template>

<style scoped>
.subNavPage {
    border-radius: 3%;
    color: #fff;
    height: 100%;
    width: 95%;
    margin: 0 auto;
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
    justify-content: center;
    padding: 0 0%;
    margin-top: 25px;

}

.workstation {
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0 25px 25px;
    width: 20%;
    text-align: left;
    margin: 0 30px;
    height: calc(100vh - 450px);
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
    margin-left: 5px;
    /* 调整左边距实现左对齐 */
}

.workstation ul {
    padding-left: 0;
    /* 移除默认的左边距 */
    list-style-type: none;
    /* 移除默认的列表样式 */
    margin-top: 40px;
}

.workstation li {
    margin: 15px 0;
    /* 增加垂直边距 */
    padding: 5px;
    /* 增加内边距 */
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

.normal::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: green;
    border-radius: 50%;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
}

.stopped::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: gray;
    border-radius: 50%;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
}

.maintenance::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: yellow;
    border-radius: 50%;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
}

.alarm::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: red;
    border-radius: 50%;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
}

.status-description {
    text-align: left;
    color: #fff;
    margin-left: 120px;
    margin-top: 60px;
}
.status-item {
    margin-right: 20px;
}
</style>