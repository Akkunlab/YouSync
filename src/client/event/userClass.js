class User {

  // コンストラクタ
  constructor(createdAt) {
    this.createdAt = createdAt;
    this.deviceDelayTime = 0;
  }

  // デバイス情報
  set setDevice(value) {
    this.device = value;
  }
  get getDevice() {
    return this.device;
  }

  // 端末遅延時間
  set setDeviceDelayTime(value) {
    this.deviceDelayTime = value;
  }
  get getDeviceDelayTime() {
    return this.deviceDelayTime;
  }

  // 遅延時間
  set setDelayTime(value) {
    this.delayTime = value;
  }
  get getDelayTime() {
    return this.delayTime;
  }

  // 往復時間
  set setRoundtripTime(value) {
    this.roundtripTime = value;
  }
  get getRoundtripTime() {
    return this.roundtripTime;
  }
}

export { User };
