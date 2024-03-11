<template>
    <el-upload v-model:file-list="fileList" class="upload" :http-request="customHttpRequest" :limit="limit"
        list-type="picture-card" :on-remove="handleRemove" :on-preview="handlePreview" :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload">
        <template #tip>
            <div v-if="limit == 3" class="el-upload__tip">
                图片或pdf格式，不多于3个
            </div>
        </template>
        <el-icon>
            <Plus />
        </el-icon>

    </el-upload>
    <el-dialog v-model="dialogVisible">
        <img v-if="dialogImageUrl" w-full :src="dialogImageUrl" />
        <iframe v-if="dialogPdfUrl" width="100%" height="100%" :src="dialogPdfUrl" frameborder="0"
            scrolling="no"></iframe>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getStsAPI } from "../apis/util";
import type { UploadProps, UploadUserFile } from 'element-plus'
import Snowflake from "@axihe/snowflake"
import { ElMessage } from 'element-plus'

const emit = defineEmits(["uploadImage"])
const props = defineProps({
    dialog: { type: Boolean },
    confirmImage: { type: Boolean },
    uploaded: { type: String, default: null },
    limit: { type: Number, default: 1 }
});
const original = ref()

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
const fileToDelete = ref<UploadUserFile[]>([])

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

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'application/pdf') {
        ElMessage.error('仅支持图片或pdf上传!')
        return false
    }
    // else if (rawFile.size / 1024 / 1024 > 2 {
    //     ElMessage.error('文件大于2MB!')
    //     return false
    // }
    return true
}

const handleRemove: UploadProps['onRemove'] = async (uploadFile, uploadFiles) => {
    const fileName = uidToFileNameMap.value[uploadFile.uid];


    if (original.value.hasOwnProperty(uploadFile.uid)) {
        console.log("delete original files");
        fileToDelete.value.push(uploadFile);
        delete uidToFileNameMap.value[uploadFile.uid];
        console.log(fileToDelete);

    }
    else {
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
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            delete uidToFileNameMap.value[uploadFile.uid];

        } catch (error) {
            ElMessage({
                type: 'info',
                message: '删除取消',
            })
            console.error('Error deleting file:', error);
        }
        // console.log(uploadFile, uploadFiles)
    }
}
const dialogImageUrl = ref('')
const dialogPdfUrl = ref('')
const dialogVisible = ref(false)
const handlePreview: UploadProps['onPreview'] = (file) => {
    console.log(file)

    if (file.name.endsWith('.pdf')) {
        dialogPdfUrl.value = file.url!
    }
    else {
        dialogImageUrl.value = file.url!
    }
    dialogVisible.value = true
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
        `限制上传3个文件`
    )
}


watch([() => props.dialog, () => props.confirmImage], async ([dialogValue, confirmImageValue], [oldDialogValue, oldConfirmImageValue]) => {
    // 在这里处理 props.dialog 和 props.confirmImage 的变化
    console.log('dialog value changed:', dialogValue);
    console.log('confirmImage value changed:', confirmImageValue);

    //如果弹框关闭且用户未点击确认
    if (!dialogValue && !confirmImageValue) {
        // 执行删除文件操作或其他操作
        //   Iterate through uidToFileNameMap and delete files from AWS S3
        console.log("dialog false and confirmImage false");

        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            endpoint: "https://eos-chengdu-1.cmecloud.cn",
            signatureVersion: 'v2',
            sslEnabled: false,
        });

        for (const uid in uidToFileNameMap.value) {
            //不删除开启弹框前已有的图片
            if (!original.value || !original.value.hasOwnProperty(uid)) {
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
    }
    //如果弹框关闭，用户提交确认按钮，删除要删除的图片
    if (!dialogValue && confirmImageValue) {
        // Execute delete file operation for files in fileToDelete
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            endpoint: "https://eos-chengdu-1.cmecloud.cn",
            signatureVersion: 'v2',
            sslEnabled: false,
        });

        fileToDelete.value.forEach(async (fileToDeleteItem) => {
            const fileName = fileToDeleteItem.name
            console.log(fileName);

            const params = {
                Bucket: 'cmc/receipt',
                Key: fileName,
            };

            try {
                await s3.deleteObject(params).promise();
                console.log(`File ${fileName} deleted successfully`);
                // delete uidToFileNameMap.value[fileToDeleteItem.uid];
            } catch (error) {
                console.error(`Error deleting file ${fileName}:`, error);
            }
        });

        // Clear the fileToDelete list
        fileToDelete.value = [];
    }
    // 其他操作...
});

// console.log("original upload", props.uploaded);

watch(() => props.uploaded, (newval, oldval) => {
    // console.log("props uploaded changed");
    // console.log("new", newval);
    // console.log("old", oldval);

    if (newval != null && oldval == null) {
        // console.log("first time");
        original.value = JSON.parse(newval)
        uidToFileNameMap.value = JSON.parse(newval)


        // console.log(uidToFileNameMap);
        fileList.value = Object.keys(uidToFileNameMap.value).map(uid => ({
            uid: uid,
            name: uidToFileNameMap.value[uid],
            status: "success",
            url: "https://cmc.eos-chengdu-1.cmecloud.cn/receipt/" + uidToFileNameMap.value[uid] // Replace with the actual URL
        }));

        // console.log(fileList);

    }

    // 其他操作...
}, { deep: true });

watch(
    uidToFileNameMap,
    (newMap, oldMap) => {
        // console.log('uidToFileNameMap changed:');
        console.log('New uidToFileNameMap:', newMap);
        // console.log('Old uidToFileNameMap:', oldMap);

        emit("uploadImage", newMap);


    },
    { deep: true } // Enable deep monitoring
);
</script>
