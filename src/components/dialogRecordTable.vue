<template>
  <el-dialog
    title="记录"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose"
  >
    <el-table
      :data="tableData"
      border
      show-summary
      style="width: 100%"
      height="500px"
    >
      <el-table-column
        prop="timeTxt"
        label="游戏时间"
        align="center"
        :filters="filterTime"
        :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column prop="roleId" label="游戏角色" align="center">
      </el-table-column>
      <el-table-column prop="deep" label="位置" width="180" align="center">
      </el-table-column>
      <el-table-column prop="diamond" label="矿石" width="180" align="center">
      </el-table-column>
      <el-table-column prop="picoDiamond" label="彩蛋矿石" align="center">
      </el-table-column>
      <el-table-column
        prop="realDiamond"
        label="实际矿石"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="diamond"
        label="gameTime"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="picoDiamond" label="seed" align="center">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "dialogVisible",
  props: {
    recordTableData: Array,
  },
  components: {},
  data() {
    return {
      dialogVisible: true,
      filterTime: [],
      tableData: [],
    };
  },
  watch: {
    recordTableData() {
      this.recordTableData.forEach((n) => {
        this.tableData.push(
          Object.assign(n, { timeTxt: this.timeFormat(n.time) })
        );
      });
    },
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit("closeDialog");
    },
    // 时间戳转日期格式
    timeFormat(d) {
      const time = new Date(+d);
      const month =
        time.getMonth() + 1 < 10
          ? `0${time.getMonth() + 1}`
          : time.getMonth() + 1;
      const day = time.getDate() < 10 ? `0${time.getDate()}` : time.getDate();
      const h = time.getHours();
      const mm =
        time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
      const s =
        time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds();
      return `${time.getFullYear()}-${month}-${day} ${h}:${mm}:${s}`;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
  },
};
</script>
