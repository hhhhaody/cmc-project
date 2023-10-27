<template>
    <!-- 点击按钮时触发 exportData 方法 -->
    <el-button type="primary" @click="exportData">
        <Download style="width: 1em; height: 1em; margin-right: 8px" />导出
    </el-button>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
    props: {
        headers: Array,     // 表头数据，用于生成 Excel 文件的列标题
        tableData: Array,   // 表格数据，用于生成 Excel 文件的内容
        fileName: String,   // 导出的 Excel 文件的名称
        buttonLabel: {  // 按钮的文本
            type: String,
            default: 'Export to Excel'
        },
        filterFunction: {   // 过滤函数，用于在导出之前处理数据
            type: Function,
            default: (data) => data
        },
        modelValue: {   // 选中的行数据，如果提供了的话
            type: Array,
            default: () => []
        },
    },
    methods: {
        exportData() {
            try {
                // 使用选中的行数据（如果有的话）或全部表格数据
                let data = this.modelValue.length > 0 ? this.modelValue : this.tableData;

                // 如果没有要导出的数据，给出提示并中止导出
                if (data.length === 0) {
                    // 如果数据为空，给出提示
                    alert('No data to export');
                    return;
                }

                // 使用过滤函数处理数据（如果提供了的话）
                data = this.filterFunction(data);

                // 将数据转换为 Excel 可以处理的格式
                const excelData = data.map((item) => {
                    const rowData = this.headers.map((header) => item[header.key]);
                    return rowData;
                });

                // 使用 xlsx 库创建和下载 Excel 文件
                const ws = XLSX.utils.aoa_to_sheet([this.headers.map((h) => h.title)].concat(excelData));
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, this.fileName || 'export.xlsx');
            } catch (error) {
                console.error('An error occurred during data export:', error);
                alert('导出数据时发生错误，请稍后再试。');
            }
        }
    }
}
</script>

