<template>
  <div class="app-container">
    <el-card shadow="always">
    <!-- 查询 -->
      <el-form :model="state.queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input
          placeholder="请输入分类名称模糊查询"
          clearable
          @keyup.enter.native="handleQuery"
          v-model="state.queryParams.categoryName"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status" >
        <el-select
          v-model="state.queryParams.status"
          placeholder="分类状态"
          clearable
        >
          <el-option
            v-for="dict in state.statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
          <el-button
                  type="primary"
                  @click="handleQuery"
          >
            <SvgIcon name="ele-Search" />
            搜索</el-button>
          <el-button @click="resetQuery">
            <SvgIcon name="ele-Refresh" />
            重置
          </el-button>
          <el-button type="primary"
                     plain

                     v-auth="'system:category:add'"
                     @click="onOpenAddModule">
            <SvgIcon name="ele-Plus" />
            新增
          </el-button>
        </el-form-item>

    </el-form>

      <!--数据表格-->
      <el-table
      v-loading="state.loading"
      :data="state.tableData"
      row-key="categoryId"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="categoryName"
        label="分类名称"
        width="260"
      ></el-table-column>
      <el-table-column
                prop="createTime"
                label="创建时间"
                width="300"
        >
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100"
      >
        <template #default="scope">
          <el-tag
                  :type="scope.row.status === '1' ? 'danger' : 'success'"
                  disable-transitions
          >{{ statusFormat(scope.row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="leader" width="200">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button

            type="text"
            v-auth="'system:category:edit'"
            @click="onOpenEditModule(scope.row)"
            ><SvgIcon name="ele-Edit" />修改</el-button>
          <el-button

            type="text"
            v-auth="'system:category:add'"
            @click="onOpenAddModule(scope.row)"
            ><SvgIcon name="ele-Plus" />新增</el-button
          >
          <el-button
            v-if="scope.row.parentId != 0"

            type="text"
            v-auth="'system:category:delete'"
            @click="onTabelRowDel(scope.row)"
            ><SvgIcon name="ele-Delete" />删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    </el-card>
    <!-- 添加或修改分类对话框 -->
    <EditModule ref="editModuleRef" :title="state.title" />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, getCurrentInstance, onUnmounted,} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import EditModule from "./component/editModule.vue";
import { delData, listData } from "@/api";
import { handleTree } from "@/utils";
const { proxy } = getCurrentInstance() as any;
const editModuleRef = ref();
const state = reactive({
  // 遮罩层
  loading: true,
  // 弹出层标题
  title: "",
  // 分类表格树数据
  tableData: [] as any,
  // 状态数据字典
  statusOptions: [],
  // 查询参数
  queryParams: {
    categoryName: undefined,
    status: undefined,
  },
});

/** 查询分类列表 */
const handleQuery = () => {
  state.loading = true;
  listData('/cms/category',state.queryParams).then((response: any) => {
    state.tableData = handleTree(response.data.rows,"categoryId","parentId","children");
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.categoryName = undefined;
  state.queryParams.status = undefined;
  handleQuery();
};

// 分类状态字典翻译
const statusFormat = (row: any) => {
  return proxy.selectDictLabel(state.statusOptions, row.status);
};

// 打开新增分类弹窗
const onOpenAddModule = (row: any) => {
  let parentId = row.categoryId;
  row = [];
  row.parentId = parentId;
  state.title = "添加分类";
  editModuleRef.value.openDialog(row);
};
// 打开编辑分类弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改分类";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  ElMessageBox({
    message: '是否确认删除名称为"' + row.categoryName + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delData('/cms/category',row.categoryId).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 页面加载时
onMounted(() => {
  // 查询分类信息
  handleQuery();
  // 查询分类状态数据字典
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data.rows;
  });
  proxy.mittBus.on("onEditCategoryModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditCategoryModule");
});
</script>
