<template>
    <app-page>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="product" is-link readonly label="成品" placeholder="请选择成品名称" @click="show = true" />
                <van-popup v-model:show="show" round position="bottom">
                    <van-cascader title="请选择成品" :options="options" @close="show = false" @finish="onFinish" />
                </van-popup>
            </van-cell-group>
            <van-cell-group v-if="formItems.length > 0" inset>
                <template v-for="(item, index) in formItems" :key="index">
                    <van-field v-if="item.type === 'input'" v-model="form[item.value]" :label="item.label" clearable>
                    </van-field>
                    <van-field v-if="item.type === 'num'" v-model="form[item.value]" :label="item.label" clickable
                        readonly @click="item.readonly ? activeKeyboardIndex = index : activeKeyboardIndex = null"
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
                    <!-- 新增 custom 类型 -->
                    <template v-if="item.type === 'custom'">
                        <van-field :label="item.label" clickable readonly @click="showCustomPopup(index)">
                            <template #label v-if="item.info">
                                <span>{{ item.label }}</span>
                                <van-icon name="question-o" @click.stop="showDetail(index)" />
                            </template>
                            <template #right-icon v-if="form[item.label].some(data => data.trim() !== '')">
                                <van-icon name="success" color="green" />
                            </template>
                        </van-field>
                    </template>
                </template>
            </van-cell-group>
            <div v-if="formItems.length > 0" style=" margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>

        <van-number-keyboard v-if="activeKeyboardIndex !== null" v-model="customData[activeKeyboardIndex]" :show="true"
            :maxlength="10" @blur="activeKeyboardIndex = null" extra-key="." style="z-index: 2013;" />
        <van-popup v-model:show="detailPopup.show" round :style="{ padding: '1em' }">
            <p>{{ detailPopup.content }}</p>
        </van-popup>

        <!-- 新增的弹出框，用于填写 10 个数据 -->
        <van-popup v-model:show="customPopup.show" round :style="{ padding: '1em' }">
            <div v-for="(data, index) in customData" :key="index">
                <van-field v-model="customData[index]" :label="`数据${index + 1}`" @focus="handleFocus(index)" readonly />
            </div>
            <van-button type="primary" block @click="saveCustomData">保存</van-button>
        </van-popup>
    </app-page>
</template>
<script setup>
import { ref, watch, reactive } from 'vue';
import { addRectangularAPI } from "../../apis/product"

const product = ref('')
const show = ref(false)
const formItems = ref([]);
const activeKeyboardIndex = ref(null);
const detailPopup = ref({ show: false, content: '' });
const customPopup = ref({ show: false, index: null });
const customData = ref(Array(10).fill(''));
const form
    = reactive({
        name: product.value,
        batch: '',
        cutface: '',
        surface: '',
        appearance: '',
        rebarWelding: '',
        hole: '',
        rebar: '',
        welding: '',
    })

const showDetail = (index) => {
    const item = formItems.value[index];
    detailPopup.value = {
        show: true,
        content: `${item.info}`
    };
};

const handleFocus = (fieldIndex) => {
    if (customPopup.value.index !== null && formItems.value[customPopup.value.index]) {
        const currentItem = formItems.value[customPopup.value.index];
        if (currentItem.readonly) {
            activeKeyboardIndex.value = fieldIndex;
        }
    }
};

const showCustomPopup = (index) => {
    const item = formItems.value[index];
    customPopup.value.index = index;
    customData.value = formItems.value[index].value.slice();
    customPopup.value.show = true;
};

const saveCustomData = () => {
    const index = customPopup.value.index;
    formItems.value[index].value = [...customData.value];
    formItems.value[index].hasData = customData.value.some(data => data.trim() !== '');
    // 将数据保存到 form 对象中，使用 formItems 的 value 作为 key
    form[formItems.value[index].label] = [...customData.value];
    customPopup.value.show = false;
};

// 选项列表，children 代表子选项，支持多级嵌套
const options = [
    {
        text: '方通柱',
        value: 'rectangularColumn',
    },
];

// 全部选项选择完毕后，会触发 finish 事件
const onFinish = ({ selectedOptions }) => {
    show.value = false;
    product.value = selectedOptions.map((option) => option.text).join(' ');
    form.name = product.value.split(' ')[0]
    form.spec = product.value.split(' ')[1] + ' ' + product.value.split(' ')[2]
};

// 重置表单
const resetForm = () => {
    // 保留用户选择的物料，只清空表单中的字段
    form.batch = '';
    form.cutface = '';
    form.surface = '';
    form.appearance = '';
    form.rebarWelding = '';
    form.hole = '';
    form.rebar = '';
    form.welding = '';

    // 清空 custom 类型的字段
    formItems.value.forEach(item => {
        if (item.type === 'custom') {
            form[item.label] = Array(10).fill('');
        }
    });

    customData.value = Array(10).fill('');
    activeKeyboardIndex.value = null;
};


// 根据不同材料生成不同的表单项
const generateFormItems = (product) => {
    switch (product) {
        case '方通柱':
            const items = [
                { type: 'input', label: '编号', value: 'batch' },
                { type: 'radio', label: '切面', value: 'cutface', options: ['合格', '不合格'], info: '角柱外观质量：钢材剪切面或切割面应无裂纹、夹渣、分层和大于1mm的缺棱，角度' },
                { type: 'radio', label: '外表面', value: 'surface', options: ['合格', '不合格'], info: '角柱外观质量：钢柱表面不应有焊渣、焊疤、灰尘、油污、水、毛刺等' },
                { type: 'radio', label: '外观', value: 'appearance', options: ['合格', '不合格'], info: '焊缝质量：外形均匀成型较好，焊渣和飞溅物基本清除干净。不得有表面气孔、夹渣、弧坑裂纹、电弧擦伤等缺陷，二级焊缝' },
                { type: 'custom', readonly: true, label: '连接板与外钢柱', value: Array(10).fill(''), hasData: false, clickable: true, info: '焊缝尺寸：加强焊脚尺寸hk[1,10] ' },
                { type: 'custom', readonly: true, label: '连接板与芯柱', value: Array(10).fill(''), hasData: false, clickable: true, info: '焊缝尺寸：加强焊脚尺寸hk[2,10] ' },
                { type: 'custom', readonly: true, label: '余高', value: Array(10).fill(''), hasData: false, clickable: true, info: '焊缝尺寸：[0,2]（焊缝宽b≤20mm），[0,3]（焊缝宽b＞20mm）' },
                { type: 'custom', readonly: true, label: '余高铲磨后表面（横向对接焊缝）', value: Array(10).fill(''), hasData: false, clickable: true, info: '焊缝尺寸：表面不高于母材0.5mm，表面不低于母材0.3mm ' },
                { type: 'custom', readonly: true, label: '余高铲磨后表面（粗糙度）', value: Array(10).fill(''), hasData: false, clickable: true, info: '焊缝尺寸：粗糙度50 ' },
                { type: 'custom', readonly: true, label: '柱尾底部到柱身顶部长度', value: Array(3).fill(''), hasData: false, clickable: true, info: '-3 ' },
                { type: 'custom', readonly: true, label: '柱身顶部到柱芯顶部长度', value: Array(3).fill(''), hasData: false, clickable: true, info: '3 ' },
                { type: 'custom', readonly: true, label: '柱身截面长宽', value: Array(2).fill(''), hasData: false, clickable: true, info: '±1.0' },
                { type: 'custom', readonly: true, label: '柱脚截面长宽', value: Array(2).fill(''), hasData: false, clickable: true, info: '±1.0' },
                { type: 'custom', readonly: true, label: '芯柱截面长宽', value: Array(2).fill(''), hasData: false, clickable: true, info: '±1.0' },
                { type: 'custom', readonly: true, label: '方通柱延长度方向的外表弯曲度', value: Array(4).fill(''), hasData: false, clickable: true, info: '使用两米靠尺，从柱尾沿长度方向，测量靠尺与柱尾端间隙值（0,3.0）' },
                { type: 'custom', readonly: true, label: '角柱柱尾分板长宽', readonly: true, value: Array(2).fill(''), hasData: false, clickable: true, info: '±1.0' },
                { type: 'radio', label: '角柱柱尾分板钢筋根数', value: 'rebar', options: ['合格', '不合格'], info: '数量符合深化设计要求' },
                { type: 'custom', readonly: true, label: '泄压孔直径', value: Array(2).fill(''), hasData: false, clickable: true, info: '（0，＋2）' },
                { type: 'custom', readonly: true, label: '连接孔孔长宽', value: Array(4).fill(''), hasData: false, clickable: true, info: '（0，＋2）' },
                { type: 'custom', readonly: true, label: '连接孔孔距', value: Array(4).fill(''), hasData: false, clickable: true, info: '±2' },
                { type: 'radio', label: '泄压孔，连接孔预留孔洞数量', value: 'hole', options: ['合格', '不合格'], info: '不得缺孔、多孔，数量符合深化设计要求' },
                { type: 'radio', label: '角柱柱脚钢板塞焊', value: 'welding', options: ['合格', '不合格'], info: '焊缝表面应光滑平整，无挂渣、裂纹和疏松等缺陷' },
                { type: 'radio', label: '柱脚分板钢筋焊接', value: 'rebarWelding', options: ['合格', '不合格'], info: '全长度焊接，无漏焊、裂纹、夹渣等问题' },
            ];

            // 初始化 form 中的 custom 字段
            items.forEach(item => {
                if (item.type === 'custom') {
                    form[item.label] = Array(10).fill('');
                }
            });

            return items;
        // 其他材料的表单项...
        default:
            return [];
    }
};

// 监听 material 的变化
watch(product, (newValue) => {
    formItems.value = generateFormItems(newValue);
});


const onSubmit = async () => {
    try {
        // 验证必填字段
        if (!form.name) {
            alert('请填写成品名称');
            return;
        }
        if (!form.batch) {
            alert('请填写编号');
            return;
        }
        if (!form.cutface) {
            alert('请填写切面');
            return;
        }
        if (!form.surface) {
            alert('请填写外表面');
            return;
        }
        if (!form.appearance) {
            alert('请填写外观');
            return;
        }
        if (!form.rebarWelding) {
            alert('请填写柱脚分板钢筋焊接');
            return;
        }
        if (!form.hole) {
            alert('请填写预留孔洞数量');
            return;
        }
        if (!form.rebar) {
            alert('请填写柱尾分板钢筋根数');
            return;
        }
        if (!form.welding) {
            alert('请填写角柱柱脚钢板塞焊');
            return;
        }

        // 整合每一项 custom 数据到单独的 keys 中
        const customDataCollections = {};

        // 处理 '连接板与外钢柱' 数据
        const connectionPlateOuterSteelColumnKeys = ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6', '数据7', '数据8', '数据9', '数据10'];
        customDataCollections.connectionPlateOuterSteelColumn = connectionPlateOuterSteelColumnKeys.map((key, index) => `${key}: ${form['连接板与外钢柱'][index] || 0}`).join(', ');

        // 处理 '连接板与芯柱' 数据
        const connectionPlateCoreColumnKeys = ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6', '数据7', '数据8', '数据9', '数据10'];
        customDataCollections.connectionPlateCoreColumn = connectionPlateCoreColumnKeys.map((key, index) => `${key}: ${form['连接板与芯柱'][index] || 0}`).join(', ');

        // 处理 '余高' 数据
        const heightResidualKeys = ['余高1', '余高2', '余高3', '余高4', '余高5', '余高6', '余高7', '余高8', '余高9', '余高10'];
        customDataCollections.heightResidual = heightResidualKeys.map((key, index) => `${key}: ${form['余高'][index] || 0}`).join(', ');

        // 处理 '余高铲磨后表面（横向对接焊缝）' 数据
        const heightSurfaceAfterGrindingWeldKeys = ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6', '数据7', '数据8', '数据9', '数据10'];
        customDataCollections.heightSurfaceAfterGrindingWeld = heightSurfaceAfterGrindingWeldKeys.map((key, index) => `${key}: ${form['余高铲磨后表面（横向对接焊缝）'][index] || 0}`).join(', ');

        // 处理 '余高铲磨后表面（粗糙度）' 数据
        const surfaceRoughnessAfterGrindingKeys = ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6', '数据7', '数据8', '数据9', '数据10'];
        customDataCollections.surfaceRoughnessAfterGrinding = surfaceRoughnessAfterGrindingKeys.map((key, index) => `${key}: ${form['余高铲磨后表面（粗糙度）'][index] || 0}`).join(', ');

        // 处理 '柱尾底部到柱身顶部长度' 数据
        const bottomToTopDistanceKeys = ['数据1', '数据2', '数据3'];
        customDataCollections.bottomToTopDistance = bottomToTopDistanceKeys.map((key, index) => `${key}: ${form['柱尾底部到柱身顶部长度'][index] || 0}`).join(', ');

        // 处理 '柱身顶部到柱芯顶部长度' 数据
        const topToCoreTopDistanceKeys = ['数据1', '数据2', '数据3'];
        customDataCollections.topToCoreTopDistance = topToCoreTopDistanceKeys.map((key, index) => `${key}: ${form['柱身顶部到柱芯顶部长度'][index] || 0}`).join(', ');

        // 处理 '柱身截面长宽' 数据
        const columnSectionDimensionsKeys = ['数据1', '数据2'];
        customDataCollections.columnSectionDimensions = columnSectionDimensionsKeys.map((key, index) => `${key}: ${form['柱身截面长宽'][index] || 0}`).join(', ');

        // 处理 '柱脚截面长宽' 数据
        const columnFootSectionDimensionsKeys = ['数据1', '数据2'];
        customDataCollections.columnFootSectionDimensions = columnFootSectionDimensionsKeys.map((key, index) => `${key}: ${form['柱脚截面长宽'][index] || 0}`).join(', ');

        // 处理 '芯柱截面长宽' 数据
        const coreColumnSectionDimensionsKeys = ['数据1', '数据2'];
        customDataCollections.coreColumnSectionDimensions = coreColumnSectionDimensionsKeys.map((key, index) => `${key}: ${form['芯柱截面长宽'][index] || 0}`).join(', ');

        // 处理 '方通柱延长度方向的外表弯曲度' 数据
        const rectangularColumnBendingAlongLengthKeys = ['数据1', '数据2', '数据3', '数据4'];
        customDataCollections.rectangularColumnBendingAlongLength = rectangularColumnBendingAlongLengthKeys.map((key, index) => `${key}: ${form['方通柱延长度方向的外表弯曲度'][index] || 0}`).join(', ');

        // 处理 '角柱柱尾分板长宽' 数据
        const rectangularColumnTailSectionDimensionsKeys = ['数据1', '数据2'];
        customDataCollections.rectangularColumnTailSectionDimensions = rectangularColumnTailSectionDimensionsKeys.map((key, index) => `${key}: ${form['角柱柱尾分板长宽'][index] || 0}`).join(', ');

        // 处理 '泄压孔直径' 数据
        const pressureReliefHoleDiameterKeys = ['数据1', '数据2'];
        customDataCollections.pressureReliefHoleDiameter = pressureReliefHoleDiameterKeys.map((key, index) => `${key}: ${form['泄压孔直径'][index] || 0}`).join(', ');

        // 处理 '连接孔孔长宽' 数据
        const connectionHoleLengthWidthKeys = ['数据1', '数据2', '数据3', '数据4'];
        customDataCollections.connectionHoleLengthWidth = connectionHoleLengthWidthKeys.map((key, index) => `${key}: ${form['连接孔孔长宽'][index] || 0}`).join(', ');

        // 处理 '连接孔孔距' 数据
        const connectionHoleSpacingKeys = ['数据1', '数据2', '数据3', '数据4'];
        customDataCollections.connectionHoleSpacing = connectionHoleSpacingKeys.map((key, index) => `${key}: ${form['连接孔孔距'][index] || 0}`).join(', ');


        // 整合所有 custom 类型的数据
        const formattedData = {
            name: form.name,
            batch: form.batch,
            cutface: form.cutface,
            surface: form.surface,
            appearance: form.appearance,
            rebarWelding: form.rebarWelding,
            hole: form.hole,
            rebar: form.rebar,
            welding: form.welding,
            connectionPlateOuterSteelColumn: customDataCollections.connectionPlateOuterSteelColumn,
            connectionPlateCoreColumn: customDataCollections.connectionPlateCoreColumn,
            heightResidual: customDataCollections.heightResidual,
            heightSurfaceAfterGrindingWeld: customDataCollections.heightSurfaceAfterGrindingWeld,
            surfaceRoughnessAfterGrinding: customDataCollections.surfaceRoughnessAfterGrinding,
            bottomToTopDistance: customDataCollections.bottomToTopDistance,
            topToCoreTopDistance: customDataCollections.topToCoreTopDistance,
            columnSectionDimensions: customDataCollections.columnSectionDimensions,
            columnFootSectionDimensions: customDataCollections.columnFootSectionDimensions,
            coreColumnSectionDimensions: customDataCollections.coreColumnSectionDimensions,
            rectangularColumnBendingAlongLength: customDataCollections.rectangularColumnBendingAlongLength,
            rectangularColumnTailSectionDimensions: customDataCollections.rectangularColumnTailSectionDimensions,
            pressureReliefHoleDiameter: customDataCollections.pressureReliefHoleDiameter,
            connectionHoleLengthWidth: customDataCollections.connectionHoleLengthWidth,
            connectionHoleSpacing: customDataCollections.connectionHoleSpacing,
        };


        // 打印或验证数据集合
        console.log('Formatted Data:', formattedData);

        // 发送 POST 请求到后端
        const response = await addRectangularAPI(formattedData);

        // 根据后端响应做进一步处理
        console.log('Response:', response.data);
        if (response.msg) {
            alert('提交成功！');
            resetForm();
        } else {
            alert('提交失败，请重试。');
        }
    } catch (error) {
        // console.error('提交表单时发生错误:', error);
        // alert('提交失败，请检查网络连接或稍后再试。');
    }
};

</script>