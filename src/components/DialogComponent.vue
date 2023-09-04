<script setup>
import { ref } from "vue";
import { ElNotification } from 'element-plus'

const props = defineProps({
    dialogTitle: { type: String, default: "新增物料类型" },
    form: {
        type: Object,
        default: {
            name: '',
            spec: '',
            threshold: ''
        }
    }, //表单数据
    image: { type: Boolean, default: false },
    refreshFunc: { type: Function }, //刷新方程
    confirmFunc: { type: Function } //提交方程
});

const emit = defineEmits(["dialogClose", "saveImage"]);


const dialogVisible = ref(false)
const formLabelWidth = '12vh'


const formRef = ref()

//清空表单并关闭弹框
const clear = () => {

    formRef.value.resetFields()
    dialogVisible.value = false
    props.refreshFunc()
    emit("dialogClose");

}

//表单验证
const submitForm = async (form) => {
    if (!form) return
    await form.validate((valid, fields) => {
        if (valid) {
            //向数据库发送增加请求并更新列表

            console.log('submit!')
            push()
            clear()
            if (props.image) emit("saveImage")
            emit("dialogClose");

        } else {
            console.log('error submit!', fields)
        }
    })
}

//发送表单中的数据给数据库, 成功后关闭弹框
const push = async () => {
    const res = await props.confirmFunc(props.form);
    if (res.code === 1) {
        console.log(res);
        if (res.data != null) {
            ElNotification({
                title: '成功',
                message: res.data,
                duration: 0,
                type: "success"
            })
        }

        dialogVisible.value = false
        props.refreshFunc()
    }
    // console.log(res);
};

defineExpose({ dialogVisible })
</script>

<template>
    <el-dialog v-model="dialogVisible" :title="props.dialogTitle" align-center destroy-on-close @close="clear">
        <el-form ref="formRef" :model="props.form" label-position=right :label-width="formLabelWidth" @submit.prevent
            style="padding-right: 4vh;">
            <slot></slot>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="clear">取消</el-button>
                <el-button type="primary" @click="submitForm(formRef)">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>
.el-input {
    width: 50vh;
}

.dialog-footer button:first-child {
    margin-right: 1vh;
}
</style>