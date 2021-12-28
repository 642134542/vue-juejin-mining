<template>
  <el-container class="home-container">
    <el-aside width="500px">
      <el-form
        ref="form"
        :model="form"
        :rules="formRule"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="UID" prop="uid">
          <el-input v-model="form.uid" @blur="saveLocal"></el-input>
        </el-form-item>
        <el-form-item label="TOKEN" prop="token">
          <el-input v-model="form.token" @blur="saveLocal"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="8">
          <el-button type="primary" @click="submitForm('start')"
            >开始</el-button
          >
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="submitForm('command')"
            >发起指令</el-button
          >
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="submitForm('loopGetPicoDiamond')"
            >彩蛋</el-button
          >
        </el-col>
      </el-row>
      <el-row class="margin-top-20">
        <el-col :span="8">
          <el-button type="primary" @click="submitForm('freshMap')"
            >重新开始</el-button
          >
        </el-col>
        <el-col :span="8">
          <el-button type="warning" @click="submitForm('over')">结束</el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="getRecord(true)">记录</el-button>
        </el-col>
      </el-row>
    </el-aside>
    <el-main class="home-main">
      <div class="left-text log-basic">
        <p>
          用户名：<span class="is-bold">{{ userInfo.name }}</span>
        </p>
        <el-row>
          <el-col :span="12">
            <p>
              今日矿石：<span class="is-bold">{{ userInfo.todayDiamond }}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              今日限制矿石：<span class="is-bold">{{
                userInfo.todayLimitDiamond
              }}</span>
            </p>
          </el-col>
        </el-row>
        <div class="border-bottom"></div>
        <el-row>
          <el-col :span="12">
            <p>
              今日彩蛋矿石：<span class="is-bold">{{
                userInfo.todayTotalPicoDiamond
              }}</span>
            </p>
          </el-col>
        </el-row>
        <div class="border-bottom"></div>
        <el-row>
          <el-col :span="12">
            <p>
              当前位置：<span class="is-bold">{{ deep }}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p>
              当前矿石：<span class="is-bold">{{ gameDiamond }}</span>
            </p>
          </el-col>
        </el-row>
      </div>
      <div class="log-container left-text">
        <h3 class="left-text">日志:</h3>
        <el-button
          class="btn-clear"
          type="primary"
          size="mini"
          @click="clearLog"
          >清空</el-button
        >
        <div class="log-list">
          <p class="log-item" v-for="(item, index) in logData" :key="index">
            <label>{{ index + 1 }}:</label> {{ item.type }}-{{ item.msg }}，{{
              item.typeInfo
            }}
          </p>
        </div>
      </div>
    </el-main>
    <dialog-record-table
      v-if="dialogVisible"
      :recordTableData="recordTableData"
      @closeDialog="dialogVisible = false"
    ></dialog-record-table>
  </el-container>
</template>

<script>
import jwt from "jsonwebtoken";
import {
  start,
  over,
  freshMap,
  command,
  pico,
  getInfo,
  getRecord,
} from "../api/juejin";
import first from "../utils/first";
import dialogRecordTable from "./dialogRecordTable.vue";

export default {
  name: "home",
  components: {
    dialogRecordTable,
  },
  data() {
    return {
      form: {
        // uid: "3501309438466462",
        uid: "",
        token: "",
      },
      formRule: {
        uid: [{ required: true, message: "请输入uid", trigger: "blur" }],
        token: [{ required: true, message: "请输入token", trigger: "blur" }],
      },
      logData: [],
      deep: 0, // 当前位置
      gameId: 0,
      gameDiamond: 0,
      userInfo: {
        name: "",
        todayDiamond: 0,
        todayLimitDiamond: 0,
        todayTotalPicoDiamond: 0,
      },
      recordTableData: [], // 记录
      dialogVisible: false,
    };
  },
  created() {
    this.getLocal();
    if (this.form.uid && this.form.token) {
      // this.getInfo();
      // this.getRecord();
    }
  },
  methods: {
    // 获取历史记录
    getRecord(show = false) {
      this.dialogVisible = show;
      const time = new Date().getTime();
      getRecord(this.form.uid, time).then(
        (res) => {
          const { data } = res;
          this.recordTableData = data.record;
          const todayStamp = +new Date(
            new Date().setHours(0, 0, 0, 0)
          ).getTime();
          const todayRecord = data.record.filter((v) => v.time >= todayStamp);
          todayRecord.forEach((v) => {
            this.userInfo.todayTotalPicoDiamond += v.picoDiamond;
          });
        },
        () => {}
      );
    },
    getLocal() {
      this.form.uid = localStorage.getItem("uid");
      this.form.token = localStorage.getItem("token");
    },
    // 保存本地
    saveLocal() {
      localStorage.setItem("uid", this.form.uid);
      localStorage.setItem("token", this.form.token);
    },
    submitForm(funName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this[funName]();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getInfo() {
      const time = new Date().getTime();
      getInfo(this.form.uid, time).then(
        (res) => {
          const { data } = res;
          this.logData.push({
            type: "getInfo",
            typeInfo: "获取游戏基本信息",
            msg: res.message,
          });
          this.deep = data.gameInfo ? data.gameInfo.deep : 0;
          this.gameDiamond = data.gameInfo ? data.gameInfo.gameDiamond : 0;
          this.gameId = data.gameInfo ? data.gameInfo.gameId : 0;
          this.userInfo.name = data.userInfo.name;
          this.userInfo.todayDiamond = data.userInfo.todayDiamond;
          this.userInfo.todayLimitDiamond = data.userInfo.todayLimitDiamond;
        },
        () => {}
      );
    },
    start() {
      const time = new Date().getTime();
      const params = {
        roleId: 3,
      };
      start(params, this.form.uid, time).then(
        (res) => {
          const { data } = res;
          this.logData.push({
            type: "start",
            typeInfo: "开始游戏",
            msg: res.message,
          });
          this.deep = data.curPos.y;
          this.gameDiamond = 0;
          this.gameId = data.gameId;
        },
        () => {}
      );
    },
    // 发出指令
    command() {
      const time = new Date().getTime();
      const params = {
        command: first.command,
      };
      console.log(params);
      const xGameId = this.getXGameId();
      command(params, this.form.uid, time, xGameId).then((res) => {
        const { data } = res;
        this.logData.push({
          type: "command",
          typeInfo: "发出指令",
          msg: res.message,
        });
        this.deep = data.curPos.y;
        this.gameDiamond = data.gameDiamond;
      });
    },
    loopGetPicoDiamond() {
      const deep = Math.ceil(this.deep / 100) * 100; // 向上取整
      this.getPicoDiamond(deep);
    },
    getPicoDiamond(deep) {
      // const deep = Math.ceil(this.deep); // 向上取整
      const params = {
        deep,
      };
      const time = new Date().getTime();
      pico(params, this.form.uid, time).then((res) => {
        const { data } = res;
        let otherMsg = "";
        if (res.code === 0) {
          if (data.diamond) {
            otherMsg = `获得矿石，数量为${data.diamond}`;
          } else {
            otherMsg = `获得道具，编号为${data.pico}`;
          }
        }
        this.logData.push({
          type: "pico",
          typeInfo: otherMsg,
          msg: res.message,
        });
        if (deep >= 200) {
          setTimeout(() => {
            this.getPicoDiamond(deep - 100);
          }, 2000);
        } else {
          this.getInfo();
          this.getRecord();
        }
      });
    },
    // 重新开始
    freshMap() {
      const time = new Date().getTime();
      const params = {};
      freshMap(params, this.form.uid, time).then(
        (res) => {
          this.logData.push({
            type: "freshMap",
            typeInfo: "更换地图",
            msg: res.message,
          });
        },
        () => {}
      );
    },
    // 结束
    over() {
      this.$confirm("此操作将结束游戏, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const time = new Date().getTime();
        const params = {
          isButton: 1,
        };
        over(params, this.form.uid, time).then(
          (res) => {
            const { data } = res;
            this.logData.push({
              type: "over",
              typeInfo: `结束游戏，位置${data.deep}, 矿石${data.gameDiamond}，实际获取矿石${data.realDiamond}, 彩蛋矿石${data.picoDiamond}`,
              msg: res.message,
            });
          },
          () => {}
        );
      });
    },
    // 清空日志
    clearLog() {
      this.logData = [];
    },
    getXGameId() {
      const time = +new Date().getTime();
      return jwt.sign(
        {
          gameId: this.gameId,
          time: time,
          // eslint-disable-next-line max-len
        },
        "-----BEGIN EC PARAMETERS-----\nBggqhkjOPQMBBw==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIDB7KMVQd+eeKt7AwDMMUaT7DE3Sl0Mto3LEojnEkRiAoAoGCCqGSM49\nAwEHoUQDQgAEEkViJDU8lYJUenS6IxPlvFJtUCDNF0c/F/cX07KCweC4Q/nOKsoU\nnYJsb4O8lMqNXaI1j16OmXk9CkcQQXbzfg==\n-----END EC PRIVATE KEY-----\n",
        {
          algorithm: "ES256",
          expiresIn: 2592e3,
          header: {
            alg: "ES256",
            typ: "JWT",
          },
        }
      );
    },
  },
};
</script>

<style></style>
