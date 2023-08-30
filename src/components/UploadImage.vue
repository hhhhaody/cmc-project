<template>
    <el-upload v-model:file-list="fileList" class="upload" :http-request="customHttpRequest" list-type="picture-card"
        :on-remove="handleRemove" :on-preview="handlePreview">
        <el-icon>
            <Plus />
        </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getStsAPI } from "../apis/util";
import type { UploadProps, UploadUserFile } from 'element-plus'
import Snowflake from "@axihe/snowflake"
const emit = defineEmits(["uploadImage"])
const props = defineProps({
    dialog: { type: Boolean },
    confirmImage: { type: Boolean }
});

//雪花算法生成id
//#region 
var config = {
    worker_id: 0,
    datacenter_id: 0
}
const idWorker = new Snowflake(config.worker_id, config.datacenter_id);

//需要生成的时候，使用 `.nextId()` 方法
// let id = idWorker.nextId();

// console.log(id, id.toString());

//#endregion

const fileList = ref<UploadUserFile[]>([])

const getSts = async () => {
    const res = await getStsAPI()

    const stsCredentials = {
        accessKeyId: res.data.ak,
        secretAccessKey: res.data.sk,
        sessionToken: res.data.token
    };
    AWS.config.credentials = new AWS.Credentials(stsCredentials);
}

getSts()

const uidToFileNameMap = ref({});

const customHttpRequest = async (options) => {
    const { file, data, headers, withCredentials } = options;

    const newFileName = idWorker.nextId() + '.' + file.name.split('.').pop();
    uidToFileNameMap.value[file.uid] = newFileName;
    // console.log(uidToFileNameMap);

    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        endpoint: "https://eos-chengdu-1.cmecloud.cn",
        signatureVersion: 'v2',
        sslEnabled: false,
    });
    const params = {
        Bucket: 'cmc/receipt',
        Key: newFileName,
        Body: file,
        ACL: 'public-read'
    };

    try {
        await s3.upload(params).promise();
        console.log('File uploaded successfully');

        options.onSuccess(file, options);

    } catch (error) {
        console.error('Error uploading file:', error);
        options.onError(error, file, options);
        alert("上传失败")
    }
    // console.log(file.uid);

}

const handleRemove: UploadProps['onRemove'] = async (uploadFile, uploadFiles) => {
    const fileName = uidToFileNameMap.value[uploadFile.uid];
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        endpoint: "https://eos-chengdu-1.cmecloud.cn",
        signatureVersion: 'v2',
        sslEnabled: false,
    });
    const params = {
        Bucket: 'cmc/receipt',
        Key: fileName,
    };
    try {
        await s3.deleteObject(params).promise();
        console.log('File delete successfully');
        delete uidToFileNameMap.value[uploadFile.uid];

    } catch (error) {
        console.error('Error deleting file:', error);
    }
    // console.log(uploadFile, uploadFiles)

}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePreview: UploadProps['onPreview'] = (file) => {
    console.log(file)
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
}


watch([() => props.dialog, () => props.confirmImage], async ([dialogValue, confirmImageValue], [oldDialogValue, oldConfirmImageValue]) => {
    // 在这里处理 props.dialog 和 props.confirmImage 的变化
    console.log('dialog value changed:', dialogValue);
    console.log('confirmImage value changed:', confirmImageValue);

    if (!dialogValue && !confirmImageValue) {
        // 执行删除文件操作或其他操作
        //   Iterate through uidToFileNameMap and delete files from AWS S3
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            endpoint: "https://eos-chengdu-1.cmecloud.cn",
            signatureVersion: 'v2',
            sslEnabled: false,
        });

        for (const uid in uidToFileNameMap.value) {
            const fileName = uidToFileNameMap.value[uid];
            const params = {
                Bucket: 'cmc/receipt',
                Key: fileName,
            };

            try {
                await s3.deleteObject(params).promise();
                console.log(`File ${fileName} deleted successfully`);
                delete uidToFileNameMap.value[uid];

            } catch (error) {
                console.error(`Error deleting file ${fileName}:`, error);
            }
        }
    }

    // 其他操作...
});

watch(
    uidToFileNameMap,
    (newMap, oldMap) => {
        // console.log('uidToFileNameMap changed:');
        // console.log('New uidToFileNameMap:', newMap);

        // You can perform actions here based on the changes in the uidToFileNameMap
        emit("uploadImage", newMap);

    },
    { deep: true } // Enable deep monitoring
);
</script>
