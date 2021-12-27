<template>
  <el-container class="home-container">
    <el-aside width="500px">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="UID">
          <el-input v-model="form.uid"></el-input>
        </el-form-item>
        <el-form-item label="TOKEN">
          <el-input v-model="form.token"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="start">开始</el-button>
      <el-button type="primary" @click="command">发起指令</el-button>
      <el-button type="primary" @click="freshMap">重新开始</el-button>
      <el-button type="warning" @click="over">结束</el-button>
      <el-button type="primary" @click="loopGetPicoDiamond">彩蛋</el-button>
    </el-aside>
    <el-main class="home-main">
      <div class="left-text">
        <p>当前位置：{{deep}}</p>
        <p>当前钻石：{{gameDiamond}}</p>
      </div>
      <div class="log-container left-text">
        <h3 class="left-text">日志:</h3>
        <div class="">
          <p v-for="(item, index) in logData" :key="index">
            {{ index + 1 }}: {{ item.msg }}
          </p>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import jwt from "jsonwebtoken";
import { start, over, freshMap, command, pico, getInfo } from "../api/juejin";
import first from "../utils/first";

let loop = null;
export default {
  name: "home",
  components: {},
  data() {
    return {
      form: {
        uid: "3501309438466462",
        token: "",
      },
      logData: [],
      deep: 0, // 当前位置
      gameId: 0,
      gameDiamond: 0,
    };
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      const time = new Date().getTime();
      getInfo(this.form.uid, time).then(
        (res) => {
          const { data } = res;
          this.$message.success("获取成功");
          this.logData.push({
            msg: res.message,
          });
          this.deep = data.gameInfo.deep;
          this.gameDiamond = data.gameInfo.gameDiamond;
          this.gameId = data.gameInfo.gameId;
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
          this.$message.success("开始成功");
          this.logData.push({
            msg: res.message,
          });
          this.deep = data.deep;
          this.gameDiamond = data.gameDiamond;
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
        this.deep = data.curPos.y;
        this.gameDiamond = data.gameDiamond;
      });
    },
    loopGetPicoDiamond() {
      const deep = Math.ceil(this.deep / 100) * 100; // 向上取整
      this.getPicoDiamond(deep)
    },
    getPicoDiamond(deep) {
      // const deep = Math.ceil(this.deep); // 向上取整
      const params = {
        deep,
      }
      const time = new Date().getTime();
      pico(params, this.form.uid, time).then((res) => {
        this.logData.push({
          msg: res.message,
        });
        if (deep >= 200) {
          setTimeout(() => {
            this.getPicoDiamond(deep - 100);
          }, 2000);
        }
      });
    },
    // 重新开始
    freshMap() {
      const time = new Date().getTime();
      const params = {};
      freshMap(params, this.form.uid, time).then(
        (res) => {
          this.$message.success("开始成功");
          this.logData.push({
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
            this.$message.success("开始成功");
            this.logData.push({
              msg: res.message,
            });
          },
          () => {}
        );
      });
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
