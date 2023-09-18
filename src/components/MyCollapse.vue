<template>
  <div class="demo-collapse">
    <!-- 使用Element Plus的Collapse组件 -->
    <!-- activeNames指定了默认打开的面板，@change绑定了面板切换事件的处理函数 -->
    <el-collapse v-model="activeNames" @change="handleChange" 
      style="
        --el-collapse-border-color: transparent;    /* 面板的边框颜色 */
      ">
      <!-- 遍历每一个工作站 -->
      <el-collapse-item v-for="(option, index) in options" :title="option.title" :name="index.toString()" :key="index">
        <div v-for="(checked, stream) in option.streams" :key="stream">
          <!-- 显示监控点位的状态，如果checked为true，则显示为选中状态 -->
          <div class="circle" v-bind:class="{ checked: checked }" @click="toggleStream(stream, option, index)">
            <div v-if="checked" class="checkmark"></div>
          </div>
          <!-- 显示监控点位的名称 -->
          {{ stream }}
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
  
<script>
import { ElCollapse, ElCollapseItem } from 'element-plus';
import { ref, reactive, onMounted, nextTick } from 'vue'
import { getVideoStreamAPI } from '../apis/video';

export default {
  components: {
    ElCollapse,
    ElCollapseItem
  },
  setup(props, { emit }) {
    // 保存默认打开的面板的名称
    const activeNames = ref(["0", "1", "2", "3"])

    // 面板切换事件的处理函数
    const handleChange = (val) => {
      console.log(val)
    }

    // 保存每一个工作站的信息，包括名称和各监控点位的状态
    const options = reactive([
      // 每个工作站包括标题（title）和流信息（streams）
      // streams是一个对象，键是流的名字，值是一个布尔值，表示该流是否被选中
      // 初始时，所有的流都没有被选中（值为false）
      // 下面的例子中，列出了四个工作站，每个工作站有两个监控点位
      {
        title: '型钢切割工作站',
        streams: {
          '监控点位1': false,
          '监控点位2': false,
        },
      },
      {
        title: '地面钢网工作站',
        streams: {
          '监控点位3': false,
          '监控点位4': false,
        },
      },
      {
        title: '方通组焊工作站',
        streams: {
          '监控点位5': false,
          '监控点位6': false,
        },
      },
      {
        title: '模块总装工作站',
        streams: {
          '监控点位7': false,
          '监控点位8': false,
        },
      },
    ]);

    // 在组件挂载完成后，将每个工作站的第一个视频流设置为默认选中的流
    // 并发射两个事件，分别是'stream-changed'和'default-streams'
    onMounted(async () => {
      await nextTick();
      const defaultIndexCodes = []; // 创建一个数组来保存默认的 indexCodes
      // 设定每个工作站的第一个视频流为默认显示（高亮）
      options.forEach(option => {
        const firstStreamKey = Object.keys(option.streams)[0];
        option.streams[firstStreamKey] = true;
        emit('stream-changed', { stream: streamMap[firstStreamKey], index: 0 });

        defaultIndexCodes.push(streamMap[firstStreamKey]); // 将每个工作站的第一个视频流的 indexCode 添加到数组中
      });
      // 流的映射，键是流的名字，值是流的URL
      // 这是一个用于查找流URL的对象
      // const defaultStreams = options.map(option => streamMap[Object.keys(option.streams)[0]]);
      emit('default-streams', defaultIndexCodes);

    });


    const streamMap = reactive({
      '监控点位1': '5363b5f5880b49c29dcbfa199ce3f11f',
      '监控点位2': '8f4800455a984875b4a2f8e670879f8b',
      '监控点位3': '7e37741ff6954cbebbbc60d6608d36e1',
      '监控点位4': '301790102285474c873196aa8a32bfa2',
      '监控点位5': 'c8c0ba638ecd446a9778f1b72d9e5770',
      '监控点位6': 'e897fed708ec4c66a7488ed605d82d68',
      '监控点位7': '01a78a827d564de89244eb9c080caffe',
      '监控点位8': 'b11f232628cc4838968af8ab3291ccaa',
    });


    // 切换流的函数，当用户点击一个流时，会调用这个函数
    // 这个函数会将当前工作站的所有流设置为未选中状态，然后将被点击的流设置为选中状态
    // 最后，发射一个'stream-changed'事件，传递出去当前被选中的流的URL和索引
    const toggleStream = (stream, option, index) => {
      for (const key in option.streams) {
        option.streams[key] = false;
      }
      option.streams[stream] = true;
      const indexCode = streamMap[stream]; // 获取对应的indexCode
      emit('point-selected', { indexCode, index }); // 发出事件

      emit('stream-changed', { stream: streamMap[stream], index });
    };

    // 返回一些属性和方法，让它们可以在模板中使用
    return {
      activeNames,
      handleChange,
      options,
      toggleStream,
      // streamUrls
    }
  }
};

</script>
  
<style scoped>
/* 每个折叠项标题的背景和文本颜色 */
::v-deep .el-collapse-item__header {
  background-color: rgb(245, 245, 245);
  color: rgb(96, 98, 102);
  font-weight: 600;
  height: 50px;
  padding: 0 20px;
  border: none;
}

/* 每个折叠项内容的背景和文本颜色 */
::v-deep .el-collapse-item__content {
  background-color: rgb(249, 249, 249);
  color: #070707;
  font-weight: 500;
  height: 80px;
  line-height: 30px;
  padding-top: 10px;
  padding-right: 100px;
}

/* 设置监控点位状态显示的样式，例如圆圈的大小、颜色和位置等 */
.circle {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 50%;
  background: rgb(220, 222, 225);
  vertical-align: middle;
  position: relative;
  cursor: pointer;
  margin-top: -3px;
}

.circle.checked {
  background: rgb(18, 150, 219);
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
}

:deep .el-collapse-item__wrap {
  border: none;
}

:deep .head_active .el-collapse-item__header.is-active {
  border-bottom-color: transparent;
  /* color: #667687; */
}

:deep .el-collapse-item__header.is-active {
  border-bottom: 0px solid #ebeef5;
}
</style>
