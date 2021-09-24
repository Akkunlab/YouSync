var json = require('./room_list.json'); // 部屋リスト

/* クラス */

// 人物クラス
const Person = (() => {
  const Name = Symbol('Name');                                // ユーザ名
  const RoomName = Symbol('RoomName');                        // 部屋名
  
  class Person {
    constructor(socketid) {
      this.SocketId = socketid.replace('/io_set#', '');   // Socket.id
    }

    set MyName(name) { this[Name] = name; }
    set MyRoomName(roomname) { this[RoomName] = roomname; }
    get MyId() { return this[Id]; }
    get MySocketId() { return this.SocketId; }
    get MyName() { return this[Name]; }
    get MyRoomName() { return this[RoomName]; }
  }

  return Person;
})();

// 動画クラス
class Video {
  constructor(id) {
    this.id = id;
  }

  set myTitle(title) { this.title = title; }
  set myChannel(name) { this.channel = name; }
  set myThumbnail(thum) { this.thumbnail = thum; }
  set myComments(com) { this.comments = com; }
  set myDuration(time) { this.duration = time; }

  get myId() { return this.id; }
  get myTitle() { return this.title; }
  get myChannel() { return this.channel; }
  get myThumbnail() { return this.thumbnail; }
  get myComments() { return this.comments; }
  get myDuration() { return this.duration; }
}

const ioSetFunction = {

  set(ioSet, socket) { // 設定
    const user = new Person(socket.id); // userオブジェクト作成
    console.log(user);

    socket.on('playerButton', data => ioSet.emit('playerButton', data)); // プレイヤーボタン操作
  },
  
  time(ioTime, socket) { // 時刻同期
  },

};

module.exports = ioSetFunction;