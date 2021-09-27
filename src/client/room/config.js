const config = {
  host: process.env.HOST // ホスト名
};
const user = {
  device: null,
  delayTime: 0,
  roundtripTime: 0,
  onewayTime: 0
};
let player;

export { config, user, player };