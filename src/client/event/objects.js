import { events } from './events';

const objects = {

  // ユニットを作成
  createUnits(data) {
    let unitItem, itemInner, content, itemSettings, number, deley;
    const list = document.getElementById('unit_list');
    const array = Object.keys(data);

    console.log(array);

    list.innerHTML = '';

    for (let i = 0; i < array.length; i++) {
      unitItem = document.createElement('li');
      unitItem.setAttribute('class', 'ms_unit');

      itemInner = document.createElement('div');
      itemInner.setAttribute('class', 'ms_unit_inner');
      itemInner.setAttribute('value', String(i));
      itemInner.addEventListener('click', e => events.onClickUnit(e)); // クリックイベント

      content = document.createElement('div');
      content.textContent = data[array[i]].name;
      content.setAttribute('class', 'ms_unit_content');

      itemSettings = document.createElement('div');
      itemSettings.setAttribute('class', 'ms_unit_settings');

      number = document.createElement('input');
      number.setAttribute('type', 'text');
      number.setAttribute('class', 'ms_unit_number_input');
      number.setAttribute('value', data[array[i]].name);

      deley = document.createElement('input');
      deley.setAttribute('type', 'number');
      deley.setAttribute('class', 'ms_unit_deley_input');
      deley.setAttribute('placeholder', 'delay');
      
      itemSettings.appendChild(number);
      itemSettings.appendChild(deley);
      itemInner.appendChild(content);
      itemInner.appendChild(itemSettings);
      unitItem.appendChild(itemInner);

      list.appendChild(unitItem);
    }
  }

};

export { objects };
