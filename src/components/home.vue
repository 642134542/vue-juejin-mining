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
      <el-button type="primary">重新开始</el-button>
      <el-button type="warning" @click="over">结束</el-button>
      <el-button type="primary">彩蛋</el-button>
    </el-aside>
    <el-main class="home-main">
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
import { start, over, freshMap, command, pico } from "../api/juejin";
import first from "../utils/first";

export default {
  name: "home",
  components: {},
  data() {
    return {
      form: {
        uid: "4142615543166653",
        token: "",
      },
      logData: [],
    };
  },
  methods: {
    start() {
      const time = new Date().getTime();
      const params = {
        roleId: 3,
      };
      start(params, this.form.uid, time).then(
        (res) => {
          this.$message.success("开始成功");
          this.logData.push({
            msg: res.message,
          });
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
      command(params, this.form.uid, time).then(() => {});
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
      const time = new Date().getTime();
      return jwt.sign(
        {
          gameId: this.form.uid,
          time,
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
