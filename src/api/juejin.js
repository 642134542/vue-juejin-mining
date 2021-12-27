// eslint-disable-next-line import/no-cycle
import request from "@/utils/request";

/* 开始 */
/**
 *
 * @param {*} params { roleId: 3 }
 * @param {*} uid
 * @param {*} time
 * @returns
 */
export function start(params, uid, time) {
  return request({
    url: `/game/sea-gold/game/start?uid=${uid}&time=${time}`,
    method: "post",
    data: params,
  });
}

/**
 * 结束
 * @param {*} params {"isButton":1}
 * @param {*} uid
 * @param {*} time
 * @returns
 */
export function over(params, uid, time) {
  return request({
    url: `/game/sea-gold/game/over?uid=${uid}&time=${time}`,
    method: "post",
    params,
  });
}
/**
 * 换图重来
 * @param {*} params {}
 * @param {*} uid
 * @param {*} time
 * @returns
 */
export function freshMap(params, uid, time) {
  return request({
    url: `/game/sea-gold/game/fresh_map?uid=${uid}&time=${time}`,
    method: "post",
    params,
  });
}
/**
 * 发布指令
 * @param {*} params
 * @param {*} uid
 * @param {*} time
 * @returns
 */
export function command(params, uid, time) {
  return request({
    url: `/game/sea-gold/game/command?uid=${uid}&time=${time}`,
    method: "post",
    params,
    header: {
      "Content-Type": "application/json",
    },
  });
}
/**
 * 彩蛋
 * @param {} params  {"deep":100}
 * @param {*} uid
 * @param {*} time
 * @returns
 */
export function pico(params, uid, time) {
  return request({
    url: `/game/sea-gold/game/pico?uid=${uid}&time=${time}`,
    method: "post",
    params,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}
