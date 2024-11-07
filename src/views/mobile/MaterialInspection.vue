<template>
    <app-page>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="material" is-link readonly label="来料" placeholder="请选择来料名称" @click="show = true" />
                <van-popup v-model:show="show" round position="bottom">
                    <van-cascader title="请选择规格" :options="options" @close="show = false" @finish="onFinish" />
                </van-popup>
            </van-cell-group>
            <van-cell-group v-if="formItems.length > 0" inset>
                <template v-for="(item, index) in formItems" :key="index">
                    <van-field v-if="item.type === 'input'" v-model="form[item.value]" :label="item.label" clearable>
                    </van-field>
                    <van-field v-if="item.type === 'num'" v-model="form[item.value]" :label="item.label" clickable readonly
                        @click="item.readonly ? activeKeyboardIndex = index : activeKeyboardIndex = null"
                        :label-align="item.labelAlign">
                        <template #label v-if="item.info">
                            <span>{{ item.label }}</span>
                            <van-icon name="question-o" @click.stop="showDetail(index)" />
                        </template>
                    </van-field>
                    <van-field v-if="item.type === 'radio'" :label="item.label">
                        <template #input>
                            <van-radio-group v-model="form[item.value]" direction="horizontal">
                                <van-radio v-for="(option, idx) in item.options" :key="idx" :name="option">{{ option
                                    }}</van-radio>
                            </van-radio-group>
                        </template>
                        <template #label>
                            <span>{{ item.label }}</span>
                            <van-icon name="question-o" @click.stop="showDetail(index)" />
                        </template>
                    </van-field>
                </template>

            </van-cell-group>

            <div v-if="formItems.length > 0" style=" margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>

        <van-number-keyboard v-if="activeKeyboardIndex !== null" v-model="form[formItems[activeKeyboardIndex].value]"
            :show="true" :maxlength="10" @blur="activeKeyboardIndex = null" extra-key="." />
        <van-popup v-model:show="detailPopup.show" round :style="{ padding: '1em' }">
            <p>{{ detailPopup.content }}</p>
        </van-popup>


    </app-page>
</template>
<script setup>
import { ref, watch, reactive } from 'vue';

const material = ref('')
const show = ref(false)
const formItems = ref([]);
const activeKeyboardIndex = ref(null);
const detailPopup = ref({ show: false, content: '' });
const form
    = reactive({
        name: material.value,
        spec: '',
        batch: '',
        surface: '',
        cutFace: '',
        length: '',
        width: '',
        thickness: '',
        flatness: '',
        derust: '',
        rAngle: '',
        crossSection: '',
        inspector: '',
        // A1_2: '',
        // A2_1: '',
        // A2_3: '',
        // A3_2: '',
        // A3_4: '',
        // A4_3: '',
        // A4_1: '',
        // A1_4: '',
        // B1_2: '',
        // B2_1: '',
        // B2_3: '',
        // B3_2: '',
        // B3_4: '',
        // B4_3: '',
        // B4_1: '',
        // B1_4: '',
        // C1_2: '',
        // C2_1: '',
        // C2_3: '',
        // C3_2: '',
        // C3_4: '',
        // C4_3: '',
        // C4_1: '',
        // C1_4: '',
        // A1_3: '',
        // A2_4: '',
        // B1_3: '',
        // B2_4: '',
        // C1_3: '',
        // C2_4: '',
        // l1: '',
        // w1: '',
        // l2: '',
        // w2: '',
        // l3: '',
        // w3: '',
        // l4: '',
        // w4: '',
    })

const showDetail = (index) => {
    const item = formItems.value[index];
    detailPopup.value = {
        show: true,
        content: `${item.info}`
    };
};

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
    form.name = material.value.split(' ')[0]
    form.spec = material.value.split(' ')[1] + ' ' + material.value.split(' ')[2]
};

// 根据不同材料生成不同的表单项
const generateFormItems = (material) => {
    switch (material) {
        case '钢板 t=5mm 380x132mm':
        case '钢板 t=5mm 380x152mm':
            return [
                { type: 'input', label: '批次号', value: 'batch' },
                { type: 'radio', label: '外表面', value: 'surface', options: ['合格', '不合格'], info: '钢材表面应平整光洁，无裂缝、折边、夹渣、锈斑等' },
                { type: 'radio', label: '切面', value: 'cutFace', options: ['合格', '不合格'], info: '切割面或剪切面应无裂纹、夹渣、毛刺和分层' },
                { type: 'num', readonly: true, label: '长度', value: 'length', info: '±1.0' },
                { type: 'num', readonly: true, label: '宽度', value: 'width', info: '±1.0' },
                { type: 'num', readonly: true, label: '厚度', value: 'thickness', info: '（-0.05，0.03）' },
                { type: 'num', readonly: true, label: '平整度', value: 'flatness', info: '（0，0.5）' },
                { type: 'radio', label: '除锈等级', value: 'derust', options: ['合格', '不合格'], info: 'Sa2.5' },
                { type: 'input', label: '检测人', value: 'inspector' },
            ];
        case '钢板 t=8mm 360x180mm':
        case '钢板 t=8mm 450x200mm':
            return [
                { type: 'input', label: '批次号', value: 'batch' },
                { type: 'radio', label: '外表面', value: 'surface', options: ['合格', '不合格'], info: '钢材表面应平整光洁，无裂缝、折边、夹渣、锈斑等' },
                { type: 'radio', label: '切面', value: 'cutFace', options: ['合格', '不合格'], info: '切割面或剪切面应无裂纹、夹渣、毛刺和分层' },
                { type: 'num', readonly: true, label: '长度', value: 'length', info: '±1.0' },
                { type: 'num', readonly: true, label: '宽度', value: 'width', info: '（0，-1.0）' },
                { type: 'num', readonly: true, label: '厚度', value: 'thickness', info: '（-0.05，0.03）' },
                { type: 'num', readonly: true, label: '平整度', value: 'flatness', info: '（0，0.5）' },
                { type: 'radio', label: '除锈等级', value: 'derust', options: ['合格', '不合格'], info: 'Sa2.5' },
                { type: 'input', label: '检测人', value: 'inspector' },
            ];
        case '方通 t=4mm 180x180mm':
        case '方通 t=4mm 200x200mm':
            return [
                { type: 'input', label: '批次号', value: 'batch' },
                { type: 'radio', label: '外观质量', value: 'surface', options: ['合格', '不合格'], info: '表面不应有裂缝、焊渣、焊疤、灰尘、油污、水、毛刺等' },
                { type: 'num', readonly: false, label: '方通折角', value: 'rAngle', info: '△<1.0' },
                { type: 'num', readonly: true, label: 'A(1-2)', labelAlign: 'center', value: 'A(1-2)' },
                { type: 'num', readonly: true, label: 'A(2-1)', labelAlign: 'center', value: 'A(2-1)' },
                { type: 'num', readonly: true, label: 'A(2-3)', labelAlign: 'center', value: 'A(2-3)' },
                { type: 'num', readonly: true, label: 'A(3-2)', labelAlign: 'center', value: 'A(3-2)' },
                { type: 'num', readonly: true, label: 'A(3-4)', labelAlign: 'center', value: 'A(3-4)' },
                { type: 'num', readonly: true, label: 'A(4-3)', labelAlign: 'center', value: 'A(4-3)' },
                { type: 'num', readonly: true, label: 'A(4-1)', labelAlign: 'center', value: 'A(4-1)' },
                { type: 'num', readonly: true, label: 'A(1-4)', labelAlign: 'center', value: 'A(1-4)' },
                { type: 'num', readonly: true, label: 'B(1-2)', labelAlign: 'center', value: 'B(1-2)' },
                { type: 'num', readonly: true, label: 'B(2-1)', labelAlign: 'center', value: 'B(2-1)' },
                { type: 'num', readonly: true, label: 'B(2-3)', labelAlign: 'center', value: 'B(2-3)' },
                { type: 'num', readonly: true, label: 'B(3-2)', labelAlign: 'center', value: 'B(3-2)' },
                { type: 'num', readonly: true, label: 'B(3-4)', labelAlign: 'center', value: 'B(3-4)' },
                { type: 'num', readonly: true, label: 'B(4-3)', labelAlign: 'center', value: 'B(4-3)' },
                { type: 'num', readonly: true, label: 'B(4-1)', labelAlign: 'center', value: 'B(4-1)' },
                { type: 'num', readonly: true, label: 'B(1-4)', labelAlign: 'center', value: 'B(1-4)' },
                { type: 'num', readonly: true, label: 'C(1-2)', labelAlign: 'center', value: 'C(1-2)' },
                { type: 'num', readonly: true, label: 'C(2-1)', labelAlign: 'center', value: 'C(2-1)' },
                { type: 'num', readonly: true, label: 'C(2-3)', labelAlign: 'center', value: 'C(2-3)' },
                { type: 'num', readonly: true, label: 'C(3-2)', labelAlign: 'center', value: 'C(3-2)' },
                { type: 'num', readonly: true, label: 'C(3-4)', labelAlign: 'center', value: 'C(3-4)' },
                { type: 'num', readonly: true, label: 'C(4-3)', labelAlign: 'center', value: 'C(4-3)' },
                { type: 'num', readonly: true, label: 'C(4-1)', labelAlign: 'center', value: 'C(4-1)' },
                { type: 'num', readonly: true, label: 'C(1-4)', labelAlign: 'center', value: 'C(1-4)' },
                { type: 'num', readonly: false, label: '截面尺寸', value: 'crossSection', info: '±0.5' },
                { type: 'num', readonly: true, label: 'A(1-3)', labelAlign: 'center', value: 'A(1-3)' },
                { type: 'num', readonly: true, label: 'A(2-4)', labelAlign: 'center', value: 'A(2-4)' },
                { type: 'num', readonly: true, label: 'B(1-3)', labelAlign: 'center', value: 'B(1-3)' },
                { type: 'num', readonly: true, label: 'B(2-4)', labelAlign: 'center', value: 'B(2-4)' },
                { type: 'num', readonly: true, label: 'C(1-3)', labelAlign: 'center', value: 'C(1-3)' },
                { type: 'num', readonly: true, label: 'C(2-4)', labelAlign: 'center', value: 'C(2-4)' },
                { type: 'num', readonly: false, label: '表面弯曲度', value: 'flatness', info: '(0,1.0)' },
                { type: 'num', readonly: true, label: '1长', labelAlign: 'center', value: '1长', },
                { type: 'num', readonly: true, label: '1宽', labelAlign: 'center', value: '1宽', },
                { type: 'num', readonly: true, label: '2长', labelAlign: 'center', value: '2长', },
                { type: 'num', readonly: true, label: '2宽', labelAlign: 'center', value: '2宽', },
                { type: 'num', readonly: true, label: '3长', labelAlign: 'center', value: '3长', },
                { type: 'num', readonly: true, label: '3宽', labelAlign: 'center', value: '3宽', },
                { type: 'num', readonly: true, label: '4长', labelAlign: 'center', value: '4长', },
                { type: 'num', readonly: true, label: '4宽', labelAlign: 'center', value: '4宽', },
                { type: 'radio', label: '除锈等级', value: 'derust', options: ['合格', '不合格'], info: 'Sa2.5' },
                { type: 'input', label: '检测人', value: 'inspector' },
            ];
        case '方通 t=8mm 180x180mm':
        case '方通 t=8mm 200x200mm':
            return [
                { type: 'input', label: '批次号', value: '' },
                { type: 'radio', label: '外观质量', value: [], options: ['合格', '不合格'], info: '表面不应有裂缝、焊渣、焊疤、灰尘、油污、水、毛刺等，且要求：无缝钢管' },
                { type: 'num', readonly: false, label: '方通折角', value: '', info: '△<1.0' },
                { type: 'num', readonly: true, label: 'A(1-2)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'A(2-1)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'A(2-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'A(3-2)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'A(3-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'A(4-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'A(4-1)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'A(1-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(1-2)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(2-1)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(2-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(3-2)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(3-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(4-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(4-1)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(1-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(1-2)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(2-1)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(2-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(3-2)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(3-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(4-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(4-1)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(1-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: false, label: '截面尺寸', value: '', info: '±0.5' },
                { type: 'num', readonly: true, label: 'A(1-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'A(2-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(1-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(2-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(1-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(2-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: false, label: '表面弯曲度', value: '', info: '(0,1.0)' },
                { type: 'num', readonly: true, label: '1长', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '1宽', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '2长', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '2宽', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '3长', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '3宽', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '4长', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '4宽', labelAlign: 'center', value: '' },
                { type: 'radio', label: '除锈等级', value: [], options: ['合格', '不合格'], info: 'Sa2.5' },
                { type: 'input', label: '检测人', value: '' },
            ];
        case '方通 t=8mm 80x80mm':
        case '方通 t=8mm 100x100mm':
            return [
                { type: 'input', label: '批次号', value: '' },
                { type: 'radio', label: '外观质量', value: [], options: ['合格', '不合格'], info: '表面不应有裂缝、焊渣、焊疤、灰尘、油污、水、毛刺等' },
                { type: 'num', readonly: false, label: '截面尺寸', value: '', info: '±0.5' },
                { type: 'num', readonly: true, label: 'A(1-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'A(2-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(1-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'B(2-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(1-3)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: 'C(2-4)', labelAlign: 'center', value: '' },
                { type: 'num', readonly: false, label: '表面弯曲度', value: '', info: '(0,1.0)' },
                { type: 'num', readonly: true, label: '1长', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '1宽', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '2长', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '2宽', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '3长', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '3宽', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '4长', labelAlign: 'center', value: '' },
                { type: 'num', readonly: true, label: '4宽', labelAlign: 'center', value: '' },
                { type: 'radio', label: '除锈等级', value: [], options: ['合格', '不合格'], info: 'Sa2.5' },
                { type: 'input', label: '检测人', value: '' },
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


// 提交表单
const onSubmit = (values) => {
    console.log('submit');


    console.log(form);

    // 集合 rAngle 的值
    const keys = ['A(1-2)', 'A(2-1)', 'A(2-3)', 'A(3-2)', 'A(3-4)', 'A(4-3)', 'A(4-1)', 'A(1-4)', 'B(1-2)', 'B(2-1)', 'B(2-3)', 'B(3-2)', 'B(3-4)', 'B(4-3)', 'B(4-1)', 'B(1-4)', 'C(1-2)', 'C(2-1)', 'C(2-3)', 'C(3-2)', 'C(3-4)', 'C(4-3)', 'C(4-1)', 'C(1-4)'];
    form.rAngle = keys.map(key => `${key}: ${form[key] || 0}`).join(', ');
    // console.log(`方通折角: ${form.rAngle}`);

    // 集合 crossSection 的值
    const keys2 = ['A(1-3)', 'A(2-4)', 'B(1-3)', 'B(2-4)', 'C(1-3)', 'C(2-4)'];
    console.log(keys2);
    form.crossSection = keys2.map(key => `${key}: ${form[key] || 0}`).join(', ');
    // console.log(`截面尺寸: ${form.crossSection}`);

    // 集合 flatness 的值
    const keys3 = ['1长', '1宽', '2长', '2宽', '3长', '3宽', '4长', '4宽'];
    form.flatness = keys3.map(key => `${key}: ${form[key] || 0}`).join(', ');
    // console.log(`表面弯曲度: ${form.flatness}`);

    // 重置表单项，但保留表单结构
    for (let key in form) {
        if (key !== 'name' && key !== 'spec') {
            form[key] = '';
        }
    }
};
</script>