<div align="center">

# YouSync

YouTube の動画や音楽を、離れた相手と同じタイミングで同期視聴できる Web アプリ

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

<img src="docs/hero.jpg" alt="YouSync のルーム画面。左にプレイヤーと再生コントローラ、右にプレイリスト" width="100%">

</div>

## 概要

YouSync は、ルームを開いた参加者同士で YouTube 動画の再生・一時停止・曲送りを同期させる Web アプリケーションです。プレイヤー操作を Socket.IO でリアルタイムに配信し、NTP に似た往復時間の計測で端末ごとの遅延を補正することで、離れた場所にいても同じ瞬間を共有できることを目指しています。プレイリストは Firestore に保存され、YouTube の URL を貼るだけで動画情報を取得して追加できます。

## 特徴

- **再生操作の同期** — 再生 / 一時停止 / 前へ / 次へ の操作を Socket.IO で全参加者に配信し、各クライアントの YouTube IFrame Player を同時に動かす
- **遅延補正** — クライアントとサーバー間で 4 つのタイムスタンプ（t1〜t4）をやり取りして時刻のずれと往復時間を推定し、受信側の再生位置を片道遅延と端末遅延の分だけ進めて補正する。時刻同期は 30 分ごとに再実行
- **URL からプレイリスト追加（PC 版のみ）** — ヘッダーの入力欄に YouTube の URL（`youtube.com` / `youtu.be`）を入れると、YouTube Data API v3 でタイトル・チャンネル名・サムネイル・再生時間を取得してプレイリストに追加
- **ルーム単位の永続化** — `/rooms/<ルーム名>` でルームを開く。ルーム情報とプレイリストは Firestore にルーム単位で保存される。ただし Socket.IO の再生操作・URL 追加イベントは接続中の全クライアントに配信され、ルーム間で分離されていない（同時に使えるのは実質 1 ルーム）
- **PC / モバイルの出し分け** — User-Agent を見て PC 用とモバイル用のビューを切り替える。モバイル版は再生操作と時刻同期のみで、プレイリストのヘッダーをタップして開閉できる。動画の追加と統計パネルは PC 版から行う
- **統計情報パネル（PC 版のみ）** — ヘッダー右上のユーザーアイコンで、補正時刻・片道時間・端末遅延・往復時間などの計測値を表示

## 技術スタック

| 領域 | 技術 |
| --- | --- |
| サーバー | Node.js / Express 4 / EJS 3 |
| リアルタイム通信 | Socket.IO 4 |
| データベース | Cloud Firestore（firebase-admin 11） |
| 外部 API | YouTube Data API v3（googleapis） / YouTube IFrame Player API |
| フロントエンド | Vanilla JS（ES Modules） / Sass |
| ビルド | webpack 5 / Babel / sass-loader / dotenv-webpack |

## セットアップ

### 前提

- Node.js 14 / 16 / 18 / 19 と npm。devDependencies の node-sass 8 がこの範囲にしかプリビルドバイナリを持たず、Node 20 以降では `npm install` が失敗する。sass-loader は同梱の `sass` を優先するため、node-sass を `package.json` から外せば新しい Node でも動く
- Firebase プロジェクト（Firestore を有効化し、サービスアカウントの秘密鍵を取得しておく）
- YouTube Data API v3 の API キー

### インストール

```bash
git clone https://github.com/Akkunlab/YouSync.git
cd YouSync
npm install
```

### 環境変数

リポジトリ直下に `.env` を作成します（`.gitignore` 済み）。

```dotenv
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
YOUTUBE_API_KEY=your-youtube-api-key
HOST=http://localhost:3000
MODE=development
PORT=3000
```

| 変数 | 用途 |
| --- | --- |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK の認証情報。秘密鍵内の改行は `\n` のまま記述する |
| `YOUTUBE_API_KEY` | YouTube Data API v3 のキー |
| `HOST` | クライアントが接続する Socket.IO サーバーの URL。ビルド時にバンドルへ埋め込まれる |
| `MODE` | webpack の `mode`（`development` でソースマップ有効） |
| `PORT` | HTTP サーバーのポート（省略時 3000） |

### Firestore の準備

ルームを作成する画面は無いため、`rooms` コレクションに以下のフィールドを持つドキュメントを手動で作成します。

```text
rooms/<docId>
  name: "myroom"          # URL の /rooms/<name> と一致させる
  playlist_number: 0      # 再生中のプレイリスト番号
  video_start_time: 0     # 再生開始位置（秒）
  playlist/<docId>        # サブコレクション。URL 入力で自動追加される
```

### 起動

```bash
npm run build          # webpack でクライアントを public/js・public/css にビルド
npm start              # サーバーを起動（node ./bin/www）。http://localhost:3000
npm run start_dev      # ビルドしてからサーバーを起動
npm run build_dev      # webpack を watch モードで起動
```

PC のブラウザで `http://localhost:3000/rooms/<ルーム名>` を開き、ヘッダーの入力欄に YouTube の URL を入れて動画を追加します。プレイリストが空の状態ではプレイヤーが生成されないため、最初の 1 本を追加したらページを再読み込みしてください。同じ URL を別の端末で開けば、再生操作が同期されます。

## 構成

```text
app.js              Express アプリ本体（ルーティング・エラーハンドラ）
bin/www             HTTP サーバーの起動と Socket.IO のアタッチ
routes/             `/`（トップ）と `/rooms/:roomName`（ルーム）
src/server/         Socket.IO ハンドラ・Firestore 接続・YouTube Data API 呼び出し
src/client/         ブラウザ側スクリプト（index: トップ / room: ルーム）と Sass
views/              EJS テンプレート（`_m` 付きはモバイル用）
public/             静的ファイル。ビルド成果物の js/css はここに出力される
webpack.config.js   クライアントのビルド設定
```
