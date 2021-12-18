import { config, user } from './config';
import { socketEvents } from './socket';
import { initThree } from './three';

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
    const input = document.getElementById('modal_name');

    // 何も入力がない場合
    if (!input.value) {
      input.focus();
      return;
    }

    eventData.displayName = input.value;
    events.onClickBlocker({ target: { tagName: 'DIV' } });
    document.getElementById('entry').remove(); // entryコンポーネントを削除
    socketEvents.send('join', { name: eventData.name, displayName: eventData.displayName }); // 送信
    events.showDisplayName(eventData.displayName); // 表示名を表示
    initThree(); // Three.js初期化
  },

  initManagement() { // 管理モード開始
    document.getElementById('ms').style.display = 'block'; // msコンポーネントを表示
    document.getElementById('entry').remove(); // entryコンポーネントを削除
    socketEvents.send('mJoin', { name: eventData.name, displayName: 'manager' }); // 送信
  },

  initTimeSync() { // 時刻同期初期化
    const interval = config.timeSyncInterval;

    setTimeout(function run() {
      events.timeSync()
      setTimeout(run, interval);
    }, 100);
  },

  timeSync() { // 時刻同期
    const data = { t1: Date.now() };
    socketEvents.send('timeSync', data); // 送信
  },

  getCorrectionTime(time) { // 補正した時間を取得
    return time + user.getDelayTime;
  },

  onClickEntry() { // 入室クリックイベント
    document.getElementById('modal').style.display = 'block';
    events.onClickBlocker({ target: { tagName: 'DIV' } });
  },

  onClickBlocker(e) { // Blockerクリックイベント
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      document.getElementById('blocker').classList.toggle('is-show');
      document.getElementById('modal').classList.toggle('is-show');
    }
  },

  onClickUnit(e) { // Unitクリックイベント
    const target = e.target;

    if (e.target.className === 'ms_unit_content') {
      const input = target.parentNode.lastChild.firstChild;
      target.parentNode.firstChild.classList.toggle('is-hidden');
      target.parentNode.lastChild.classList.toggle('is-show');
      input.select();
    }
    if (e.target.className === 'ms_unit_settings is-show') {
      target.parentNode.firstChild.classList.toggle('is-hidden');
      target.classList.toggle('is-show');
    }
    if (e.target.className === 'ms_unit_inner') {
      target.firstChild.classList.toggle('is-hidden');
      target.lastChild.classList.toggle('is-show');
    }
  },

  onSubmitUnitData(e) { // UnitData送信イベント
    const target = e.target;
    const parent = target.parentNode;
    const children = parent.childNodes;
    const numberInput = children[0];
    const delayInput = children[1];
    const id = 'ms_change_unit_data';
    const value = {
      id: parent.getAttribute('value'),
      number: numberInput.value,
      delay: delayInput.value
    };

    socketEvents.send('MSChange', { id, value }); // 送信

    // 設定画面を非表示
    parent.parentNode.firstChild.textContent = numberInput.value;
    parent.parentNode.firstChild.classList.toggle('is-hidden');
    parent.classList.toggle('is-show');
  },

  onChangeMS(e) { // 管理システム変更イベント
    const id = e.target.id;
    const value = e.target.checked;
    socketEvents.send('MSChange', { id, value }); // 送信
  },

  showDisplayName(name) { // 表示名を表示
    const display = document.getElementById('display_name');
    const text = document.getElementById('display_name_text');
    text.textContent = name;
    display.style.display = 'block';
  },

  hiddenDisplayName() { // 表示名を非表示
    const display = document.getElementById('display_name');
    display.style.display = 'none';
  },

  log(type, obj) { // ログ出力
    console.log(`[${type}]`);
    console.log(JSON.stringify(obj, null, 2));
  }

};

export { events };
