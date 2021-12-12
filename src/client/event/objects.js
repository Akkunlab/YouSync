import { events } from './events';

const objects = {

  // ユニットを作成
  createUnits(data) {
    let unitItem, itemInner, itemSettings, number, deley;
    const list = document.getElementById('unit_list');

    list.innerHTML = '';

    for (let i = 0; i < Object.keys(data).length; i++) {
      unitItem = document.createElement('li');
      unitItem.setAttribute('class', 'ms_unit');

      itemInner = document.createElement('div');
      itemInner.setAttribute('class', 'ms_unit_inner');
      itemInner.setAttribute('value', String(i));
      itemInner.addEventListener('click', e => events.onClickUnit(e)); // クリックイベント

      itemSettings = document.createElement('div');
      itemSettings.setAttribute('class', 'ms_unit_settings');

      number = document.createElement('input');
      number.setAttribute('type', 'number');
      number.setAttribute('class', 'ms_unit_number_input');
      number.setAttribute('value', i);

      deley = document.createElement('input');
      deley.setAttribute('type', 'number');
      deley.setAttribute('class', 'ms_unit_deley_input');
      deley.setAttribute('placeholder', '遅延時間');
      
      itemSettings.appendChild(number);
      itemSettings.appendChild(deley);
      itemInner.appendChild(itemSettings);
      unitItem.appendChild(itemInner);

      list.appendChild(unitItem);
    }
  }

};

export { objects };