import { User } from "./userClass";

const config = {
  host: process.env.HOST, // ホスト名
  timeSyncInterval: 1800000, // 同期間隔: 30分
  youtubeURL: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i // YouTubeURLパターン
};

const user = new User(new Date()); // インスタンスを生成

export { config, user };
