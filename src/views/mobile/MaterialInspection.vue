<template>
    <app-page>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="material" is-link readonly label="来料" placeholder="请选择来料名称" @click="show = true" />
                <van-popup v-model:show="show" round position="bottom">
                    <van-cascader v-model="spec" title="请选择规格" :options="options" @close="show = false"
                        @finish="onFinish" />
                </van-popup>
            </van-cell-group>
            <van-cell-group v-if="formItems.length > 0">
                <div v-for="(item, index) in formItems" :key="index">
                    <van-field v-if="item.type === 'input'" v-model="item.value" :label="item.label" />
                    <van-checkbox-group v-else-if="item.type === 'checkbox'" v-model="item.value">
                        <van-checkbox v-for="option in item.options" :key="option" :name="option">{{ option
                            }}</van-checkbox>
                    </van-checkbox-group>
                    <!-- 其他类型的表单项可以继续添加 -->
                </div>
            </van-cell-group>
        </van-form>
    </app-page>
</template>
<script setup>
import { ref, watch } from 'vue';

const material = ref('')
const spec = ref('')
const show = ref(false)
const formItems = ref([]);

// 选项列表，children 代表子选项，支持多级嵌套
const options = [
    {
        text: '钢板',
        value: 'steelPlate',
        children: [
            {
                text: 't=5mm', value: 't=5mm',
                children: [
                    { text: '380x132mm', value: '380x132mm' },
                    { text: '380x152mm', value: '380x152mm' }
                ]
            },
            {
                text: 't=8mm', value: 't=8mm',
                children: [
                    { text: '360x180mm', value: '360x180mm' },
                    { text: '450x200mm', value: '450x200mm' }
                ]
            }
        ],
    },
    {
        text: '方通',
        value: 'squareTube',
        children: [
            {
                text: 't=4mm', value: 't=4mm',
                children: [
                    { text: '180x180mm', value: '180x180mm' },
                    { text: '200x200mm', value: '200x200mm' }
                ]
            },
            {
                text: 't=8mm', value: 't=10mm',
                children: [
                    { text: '80x80mm', value: '80x80mm' },
                    { text: '100x100mm', value: '100x100mm' },
                    { text: '180x180mm', value: '180x180mm' },
                    { text: '200x200mm', value: '200x200mm' }
                ]
            }
        ],
    },
];
// 全部选项选择完毕后，会触发 finish 事件
const onFinish = ({ selectedOptions }) => {
    show.value = false;
    material.value = selectedOptions.map((option) => option.text).join(' ');
};

// 根据不同材料生成不同的表单项
const generateFormItems = (material) => {
    switch (material) {
        case '钢板 t=5mm 380x132mm':
            return [
                { type: 'input', label: '长度', value: '' },
                { type: 'input', label: '宽度', value: '' },
                { type: 'checkbox', label: '是否涂漆', value: [], options: ['是', '否'] }
            ];
        case '方通 t=4mm 180x180mm':
            return [
                { type: 'input', label: '高度', value: '' },
                { type: 'input', label: '厚度', value: '' }
            ];
        // 其他材料的表单项...
        default:
            return [];
    }
};

// 监听 material 的变化
watch(material, (newValue) => {
    formItems.value = generateFormItems(newValue);
});
</script>