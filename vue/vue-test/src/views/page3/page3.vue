<template>
  <div class="boxShadow">
    <div>
      <el-button style="width:90px; font-size: 12px">全部扫描</el-button>
      <el-button style="width:90px; font-size: 12px">全部清除</el-button>
    </div>
    <div>
      <div style="margin-top: 15px;" v-for="(item.pos) in divList">
        <el-input
          placeholder="请输入仓库地址，如有分支则空格隔开加分支名称，默认不加检测master分支。"
          v-model="item.gitUrl"
          class="input-with-select"
        >
          <!-- 编码规则 -->
          <template>
            <el-select
              v-model="item.codeType"
              slot="prepend"
              placeholder="请选择编码规则"
              style="width: 150px"
            >
              <el-option
                v-for="opItem in options"
                :key="opItem.value"
                :label="opItem.label"
                :value="opItem.value"
              >
              </el-option>
            </el-select>
          </template>

          <!-- 删除 -->
          <el-button slot="append" @click="deleteNode(pos)">删除</el-button>
        </el-input>
      </div>

      <div
        style="width: 100%; text-align:center; margin-top: 15px; margin-bottom: 15px"
      >
        <!-- 增加 -->
        <el-button icon="el-icon-plus" @click="addNode()"></el-button>
      </div>

      <el-table
        :data="data"
        :header-cell-style="tableHeaderColor"
        ref="multipleTable"
        border
        stripe
        style="width: 100%; margin-top: 20px; font-size: 10px"
      >
        <el-table-column
          align="center"
          prop="projectName"
          label="仓库名"
          width="200"
        >
          <template slot-scope="scope">
            <div class="tv-branch">{{ scope.row.projectName }}</div>
          </template>
        </el-table-column>

        <el-table-column
          class="tv-branch"
          align="center"
          prop="jiraId"
          label="分支名"
        >
          <template slot-scope="scope">
            <div class="tv-branch">{{ scope.row.jiraId }}</div>
          </template>
        </el-table-column>

        <el-table-column label="文件数" min-width="130px" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.appVos" class="tv-branch">
              {{ item.appName }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="不规范项" min-width="130px" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.appVos" class="tv-branch">
              {{ item.branchName }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="SonarQube地址" min-width="130px" align="center">
          <template slot-scope="scope">
            <div v-for="item in scope.row.appVos" class="tv-branch">
              {{ item.branchName }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          class="tv-branch"
          align="center"
          prop="updatedTime"
          label="扫描时间"
        >
          <template slot-scope="scope">
            <div class="tv-branch">{{ scope.row.updatedTime }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "xxx",

  methods: {
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #f0f9eb";
        // return 'background-color: #f0f9eb; color: #fff; font-weight: 500;'
      }
    },

    //添加标本div
    addNode() {
      this.divList.push({ codeType: "", gitUrl: "" });
    },
    //删除样本div
    deleteNode(i) {
      this.divList.splice(i, 1); //删除index为i,位置的数组元素
    }
  },

  data() {
    return {
      data: [],

      options: [
        {
          value: "选项1",
          label: "Java"
        },
        {
          value: "选项2",
          label: "C#"
        },
        {
          value: "选项3",
          label: "iOS"
        },
        {
          value: "选项4",
          label: "Js"
        },
        {
          value: "选项5",
          label: "Python"
        }
      ],

      divList: [{ codeType: "", gitUrl: "" }]
    };
  }
};
</script>

<style lang="less" scoped>
.clean {
  clear: both;
}

.tv-branch {
  // display: table-cell;
  vertical-align: middle;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
