class User {

  // コンストラクタ
  constructor(id) {
    this.id = id;
    this.createdAt = new Date();
  }

  // ID
  get myId() { return this.id; }
  
  // 作成日時
  get myCreatedAt() { return this.createdAt; }
}

module.exports = User;
