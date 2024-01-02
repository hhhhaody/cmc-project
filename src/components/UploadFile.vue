<template>
    <el-upload class="upload-demo" action="" :http-request="customHttpRequest" :show-file-list="false"
        accept=".pdf, .docx, .txt">
        <el-button type="primary">
            <Upload style="width: 1em; height: 1em; margin-right: 8px" />上传
        </el-button>
    </el-upload>
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineProps, defineExpose } from 'vue';
import { getStsAPI } from "../apis/util";
import { ElMessage } from 'element-plus';
import { uploadFileAPI } from "../apis/files";

// 定义事件发射器
const emit = defineEmits();

// 定义文件映射表
const uidToFileNameMap = ref({});
const dialogImageUrl = ref('');
const dialogVisible = ref(false);

// 定义接收的属性
const props = defineProps({
    folderId: {
        type: String,
        required: true
    }
});

// 从S3删除文件的请求
const requestDeleteFromS3 = (fileName) => {
    deleteFileFromS3(fileName);
}

// 在S3中重命名文件的请求
const requestRenameInS3 = (oldFileName, newFileName) => {
    renameFileInS3(oldFileName, newFileName);
}

// 获取STS令牌，用于连接到S3
const getSts = async () => {
    const res = await getStsAPI()
    const stsCredentials = {
        accessKeyId: res.data.ak,
        secretAccessKey: res.data.sk,
        sessionToken: res.data.token
    };
    AWS.config.credentials = new AWS.Credentials(stsCredentials);
}

// 初始化STS令牌
getSts()

// 自定义HTTP请求方法，用于上传文件
const customHttpRequest = async (options) => {
    const { file } = options;
    const originalFileName = file.name;
    // const encodedFileName = encodeURIComponent(originalFileName);

    // uidToFileNameMap.value[file.uid] = originalFileName;

    // 检查文件大小，如果超过10MB，则提示用户
    if (file.size > 10485760) { // 10MB的大小限制
        ElMessage.warning("文件大小超过10MB，请选择一个较小的文件。");
        return; // 中断上传流程
    }

    // 检查文件类型
    const allowedTypes = ['.pdf', '.docx', '.txt'];
    if (!allowedTypes.some(type => originalFileName.toLowerCase().endsWith(type))) {
        ElMessage.warning("不支持的文件类型，请上传.pdf, .docx, .txt文件。");
        return; // 中断上传流程
    }

    // 首先，调用后端API以检查文件是否存在或是否需要重命名
    const result = await uploadFileAPI(file, props.folderId);
    // console.log("API Response:", result); // 打印API响应
    // const returnedFileName = result.data.fileName || result.data;
    // console.log("Original filename:", originalFileName, "Returned filename:", returnedFileName); // 打印文件名对比

    // 如果后端返回表示文件名重复的响应
    if (result.data === "文件名重复") {
        ElMessage.warning("文件名重复，请修改后重新上传");
        return; // 中断上传流程
    }

    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        endpoint: "https://eos-chengdu-1.cmecloud.cn",
        signatureVersion: 'v2',
        sslEnabled: false,
    });
    const params = {
        Bucket: 'cmc/devicefile',
        Key: originalFileName,
        Body: file,
        ACL: 'public-read'
    };

    try {
        // Step 1: Upload the file to S3
        await s3.upload(params).promise();
        console.log('File uploaded successfully to S3 with name:', originalFileName);
        ElMessage.success("文件上传成功");
        emit('file-uploaded', file);
    } catch (error) {
        console.error('Error uploading file:', error);
        options.onError(error, file, options);
        ElMessage.error("文件上传失败");
    }
}

// 从S3中删除文件的方法
const deleteFileFromS3 = async (fileName) => {

    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        endpoint: "https://eos-chengdu-1.cmecloud.cn",
        signatureVersion: 'v2',
        sslEnabled: false,
    });

    // const encodedFileName = encodeURIComponent(fileName);
    const params = {
        Bucket: 'cmc/devicefile',
        Key: fileName,
    };

    try {
        await s3.deleteObject(params).promise();
        // 当文件从S3删除成功后，发出一个事件
        emit('file-deleted-from-s3', fileName);
        console.log('File deleted successfully from S3');
    } catch (error) {
        console.error('Error deleting file from S3:', error.message);
    }
}

// 在S3中重命名文件的方法
const renameFileInS3 = async (oldFileName, newFileName) => {
    console.log('Starting renameFileInS3 method...');

    const encodedOldFileName = encodeURIComponent(oldFileName);
    const encodedNewFileName = encodeURIComponent(newFileName);

    console.log('Old File Name:', encodedOldFileName);
    console.log('New File Name:', encodedNewFileName);

    if (encodedOldFileName === encodedNewFileName) {
        console.warn("Old and new file names are the same. Skipping rename operation.");
        return;
    }

    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        endpoint: "https://eos-chengdu-1.cmecloud.cn",
        signatureVersion: 'v2',
        sslEnabled: false,
    });

    // 复制文件
    const copyParams = {
        Bucket: 'cmc/devicefile',
        CopySource: `cmc/devicefile/${encodedOldFileName}`,
        Key: encodedNewFileName,
        ACL: 'public-read'
    };

    try {
        console.log('Starting to copy the file...');
        await s3.copyObject(copyParams).promise();
        console.log('File copied successfully');
    } catch (error) {
        console.error('Error copying file in S3:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
        return;  // If copy fails, exit the function
    }

    // 删除原文件
    //     const deleteParams = {
    //         Bucket: 'cmc/devicefile',
    //         Key: oldFileName
    //     };

    //     try {
    //         console.log('Starting to delete the old file...');
    //         await s3.deleteObject(deleteParams).promise();
    //         console.log('Old file deleted successfully');
    //     } catch (error) {
    //         console.error('Error deleting original file from S3:', error.message);
    //     }
    //     emit('file-renamed-in-s3', newFileName);
}

// 文件预览方法
const handlePreview = (file) => {
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
}

// 公开的方法，供外部使用
defineExpose({
    requestDeleteFromS3,
    requestRenameInS3,
    renameFileInS3
});

</script>


