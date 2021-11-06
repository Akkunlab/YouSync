class Video {

  // コンストラクタ
  constructor(id) {
    this.id = id;
    this.createdAt = new Date();
  }

  // ID
  get myId() { return this.id; }
  
  // 作成日時
  get myCreatedAt() { return this.createdAt; }

  // タイトル
  set myTitle(title) { this.title = title; }
  get myTitle() { return this.title; }

  // チャンネル
  set myChannel(name) { this.channel = name; }
  get myChannel() { return this.channel; }

  // サムネイル
  set myThumbnail(thum) { this.thumbnail = thum; }
  get myThumbnail() { return this.thumbnail; }

  // 長さ
  set myDuration(time) { this.duration = time; }
  get myDuration() { return this.duration; }
  
  // コメント
  set myComments(com) { this.comments = com; }
  get myComments() { return this.comments; }
}

module.exports = Video;
