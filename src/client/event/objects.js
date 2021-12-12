import { events } from './events';

const objects = {

  // ユニットを作成
  createUnits(data) {
    let unitItem, itemInner;
    const list = document.getElementById('unit_list');

    list.innerHTML = '';

    for (let i = 0; i < Object.keys(data).length; i++) {
      unitItem = document.createElement('li');
      unitItem.setAttribute('class', 'ms_unit');
      itemInner = document.createElement('div');
      itemInner.setAttribute('class', 'ms_unit_inner');
      itemInner.setAttribute('value', String(i));
      itemInner.addEventListener('click', e => events.onClickUnit(e)); // クリックイベント
      unitItem.appendChild(itemInner);
      list.appendChild(unitItem);
    }
  }

};

export { objects };
