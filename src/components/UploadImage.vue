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

        <canvas v-if="pdf" v-for="pageIndex in pdfPages" :id="`pdf-canvas-` + pageIndex" :key="pageIndex"
            style="display: block;"></canvas>
        <img v-else w-full :src="dialogImageUrl" />

    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, nextTick } from 'vue'
import { getStsAPI } from "../apis/util";
import type { UploadProps, UploadUserFile } from 'element-plus'
import Snowflake from "@axihe/snowflake"
import { ElMessage } from 'element-plus'
// import * as PdfJs from 'pdfjs-dist/legacy/build/pdf.js'
// import Pdf from '@/assets/js.pdf'

import * as pdfjsLib from "pdfjs-dist/build/pdf"

let pdfDoc = reactive({}); // 保存加载的pdf文件流
let pdfPages = ref(0); // pdf文件的页数
//pdf文件的链接
let pdfUrl = ref("https://cmc.eos-chengdu-1.cmecloud.cn/receipt/588191665399791616.pdf");
let pdfScale = ref(1);

//获取pdf文档流与pdf文件的页数
const loadFile = async (url) => {
    //注意我的pdfjs-dist的版本是3.9.179，其他的版本需要更换版本号，不然运行时会报版本不匹配的错
    //外部链接引入，存在安全性问题
    //pdfjsLib.GlobalWorkerOptions.workerSrc =
    //"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js";
    //内部链接引入
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((pdf) => {
        console.log(pdf);
        pdfDoc = pdf;                 //获取pdf文档流
        pdfPages.value = pdf.numPages;//获取pdf文件的页数
        nextTick(() => {
            renderPage(1);
        });
    });
};


const renderPage = (num) => {
    pdfDoc.getPage(num).then((page) => {
        const canvasId = "pdf-canvas-" + num;
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const bsr =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1;
        const ratio = dpr / bsr;
        const viewport = page.getViewport({ scale: pdfScale.value });
        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        canvas.style.width = viewport.width + "px";
        canvas.style.height = viewport.height + "px";
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };
        page.render(renderContext);
        if (num < pdfPages.value) {
            renderPage(num + 1);
        }
    });
};



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
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'application/pdf' && rawFile.type !== 'image/png') {
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
const pdf = ref(false)
const handlePreview: UploadProps['onPreview'] = (file) => {
    //未用到
    console.log(file)

    if (file.name.endsWith('.pdf')) {
        console.log('pdf');

        dialogPdfUrl.value = file.url!
        pdfUrl = ref(file.url);
        pdf.value = true

        loadFile(pdfUrl.value)
    }
    else {
        dialogImageUrl.value = file.url!
        pdf.value = false
    }
    dialogVisible.value = true
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
        `超过文件上传个数限制`
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
