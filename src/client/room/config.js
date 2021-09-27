const config = {
  host: process.env.HOST, // ホスト名
  timeSyncInterval: 1800000 // 30分
};
const user = {
  device: null,
  delayTime: 0,
  roundtripTime: 0
};
let player;

export { config, user, player };