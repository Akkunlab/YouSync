import { socketEvents } from './socket';

/* イベント */
const events = {

  init() { // 初期化
    const entry = document.getElementById('entry');
    const information = document.getElementById('information');
    const message = document.getElementById('information_message');

    if (eventData.state === 0) { // 未開催
      information.style.display = 'block';
      message.textContent = 'このイベントはまだ開催されていません';
    } else if (eventData.state === 1) { // 開催中
      entry.style.display = 'block';
    } else { // 終了
      information.style.display = 'block';
      message.textContent = 'このイベントは終了しました';
    }
  },

  initEnter() { // 入室モード開始
    document.getElementById('entry').remove(); // entryコンポーネントを削除
    socketEvents.send('join', { name: eventData.name }); // 送信
  },

  initManagement() { // 管理モード開始
    document.getElementById('ms').style.display = 'block'; // msコンポーネントを表示
    document.getElementById('entry').remove(); // entryコンポーネントを削除
    socketEvents.send('mJoin', { name: eventData.name }); // 送信
  },

  onClickUnit(e) { // Unitクリックイベント
    console.log(e.target);
  },

  log(type, obj) { // ログ出力
    console.log(`[${type}]`);
    console.log(JSON.stringify(obj, null, 2));
  }

};

export { events };
