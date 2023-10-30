<template>
    <el-upload class="upload-demo" action="" :http-request="customHttpRequest" :show-file-list="false">
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

    uidToFileNameMap.value[file.uid] = originalFileName;

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

        // Step 2: Call the backend API to get the new filename
        const result = await uploadFileAPI(file, props.folderId);
        const returnedFileName = result.data.fileName || result.data;

        // Step 3: If the returned filename is different, rename the file in S3
        if (returnedFileName !== originalFileName) {
            await requestRenameInS3(originalFileName, returnedFileName);
            console.log(`File renamed in S3 from ${originalFileName} to ${returnedFileName}`);
            ElMessage.success(`文件上传成功，文件名已更改为 ${returnedFileName}`);
        } else {
            ElMessage.success("文件上传成功");
        }

        // Step 4 is handled by the backend, which updates the database record

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

    const encodedFileName = encodeURIComponent(fileName); // 使用encodeURIComponent进行URL编码
    const params = {
        Bucket: 'cmc/devicefile',
        Key: encodedFileName,
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
    console.log('Old File Name:', oldFileName);
    console.log('New File Name:', newFileName);

    if (oldFileName === newFileName) {
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
        CopySource: `cmc/devicefile/${oldFileName}`,
        Key: newFileName,
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
    const deleteParams = {
        Bucket: 'cmc/devicefile',
        Key: oldFileName
    };

    try {
        console.log('Starting to delete the old file...');
        await s3.deleteObject(deleteParams).promise();
        console.log('Old file deleted successfully');
    } catch (error) {
        console.error('Error deleting original file from S3:', error.message);
    }
    emit('file-renamed-in-s3', newFileName);
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


