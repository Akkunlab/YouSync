class User {

  // コンストラクタ
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.createdAt = new Date();
  }

  // ID
  get myId() { return this.id; }

  // name
  set myName(name) { this.name = name; }
  get myName() { return this.name; }

  // 作成日時
  get myCreatedAt() { return this.createdAt; }
}

module.exports = User;
