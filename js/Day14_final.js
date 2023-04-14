const MAX_CARD_WRAP = 3;

function main() {
  load_data((data) => {
    set_now(0);
    //set_now(2);
    set_data({list: sort_data(data), size: data.size, max: data.max});
    display_body(get_data(), get_now());
  });
}

function display_body(data, now) { 
  const content = document.getElementById('content'); 
  const indicator = document.getElementById('indicator');

  create_content(content, now, data.max);
  create_indicator(indicator, data, now);
  update_card_content(data.list);
  add_touch_event(content, indicator, data);
}

function create_content(content, now, max) { // create
  const size = get_page_size(); 
  let html = '';
  for (let i = 0; i < MAX_CARD_WRAP; i++) {
    html += `<div class='box_wrap'><div id='card_wrap_` + i + `'>`;
    html += create_card(i, size, now, max);
    html += '</div></div>';
  }
  content.innerHTML = html;
  content.style.transform = 'translateX(' + -content.clientWidth + 'px)'; 
}

function create_card(i, size, now, max) { 
  let html = '';
  for (let j = 0; j < max; j++) {
    let item_wrap = get_item_wrap(i, size, now);
    let item_card = get_item_card(j);
    html +=
    `
      <div class="card" id="card_` + item_wrap + `_` + item_card + `">
      <div class="image" style="background-image: url('img/plus.png')"></div>
      <div class="text"> ` + (item_wrap + 1) + `_` + item_card + ` </div>
      </div>
    `;
  }
  return html;
}

function get_item_wrap(i, size, now) {
  let k = now + i - 1;
  if (k < 0) {
    k = size;
  }
  if (k > size) {
    k = 0;
  } 
  return k;
}

function get_item_card(j) {
  return j;
}

function update_card_id(now, max) {
  const size = get_page_size();
  for (let i = 0; i < MAX_CARD_WRAP; i++) {
    for (let j = 0; j < max; j++) {  
      let item_wrap = get_item_wrap(i, size, now);
      let item_card = get_item_card(j);
      
      const card_wrap = document.querySelector('#card_wrap_' + i);
      card_wrap.children[j].setAttribute('id', 'card_' + item_wrap + '_' + item_card); 
      card_wrap.children[j].children[0].style.backgroundImage = 'url("img/plus.png")';
      card_wrap.children[j].children[0].style.backgroundSize = '50% 50%';
      card_wrap.children[j].children[1].innerHTML = (item_wrap + 1) + `_` + item_card;
    }
  }
}

function update_card_content(list) { // update 
  for(let i = 0; i < list.length; i++) {
    const item = list[i];
    const card = document.getElementById('card_' + item.wrap + '_' + item.card);
    if(card) {
      set_image(card, item);
      set_text(card, item);
    }else{
    }
  }
}

function set_image(card, item) {
  const photo = card.querySelector('.image');
  photo.style.backgroundImage = 'url(' + item.img + ')';
  photo.style.backgroundSize = '100% 100%';
}

function set_text(card, item) {
  const txt = card.querySelector('.text');
  txt.innerHTML = item.txt;
}

function create_indicator(indicator, data, now) { // create
  const size = get_page_size() + 1; 
  let html = '';
  
  for (let i = 0; i < size; i++) {
    if (i === now) {
      //html += `<div class="active" onclick="click_indicator(` + i + `)">` + (i + 1) + `</div>`;
      html += `<div class="active">` + (i + 1) + `</div>`;
    } else {
      //html += `<div class="" onclick="click_indicator(` + i + `)">` + (i + 1) + `</div>`;
      html += `<div class="">` + (i + 1) + `</div>`;
    }
  }
  indicator.innerHTML = html;

  for (let j = 0; j < size; j++) {
    indicator.children[j].onclick = () => {
      console.log('[6]click_indicator', j);
      click_indicator(j, data, indicator);
    }
  }
}

function update_indicator(now, dir, indicator) {
  update_now(now, dir, get_page_size());
  //let indicator = document.getElementById('indicator');
  let len = indicator.children.length;
  for (let i = 0; i < len; i++) {
    if (i === get_now()) {
      indicator.children[i].classList.add('active');
    } else {
      indicator.children[i].classList.remove('active');
    }
  } 
}

function click_indicator(now, data, indicator) { // update
  //let data = get_data();
  update_indicator(now, 0, indicator);
  update_card_id(now, data.max);
  update_card_content(data.list);
}

function add_touch_event(content, indicator, data) {
  let stx = 0;
  let edx = 0;
  let x = 0;
  let now = 0;
  content.addEventListener('touchstart', (e) => {
    now = get_now();
    stx = e.touches[0].clientX; 
    content.style.transitionDuration = '0s'; 
  });
  content.addEventListener('touchmove', (e) => {
    x = (-content.clientWidth) + (e.touches[0].clientX - stx);
    content.style.transform = 'translateX(' + x + 'px)';
  }) 
  content.addEventListener('touchend', (e) => {
    edx = e.changedTouches[0].clientX;
    //content.style.transitionDuration = '0.5s';
    stx < edx ? prev_page(content, indicator, now, -1, 0) : next_page(content, indicator, now, +1, 2);
  });
  content.ontransitioncancel = () => {
    content.style.transitionDuration = '0s';
  };
  content.ontransitionend = () => { 
    console.log('[2]change_content');
    
    let idx = get_now(); 
    update_card_id(idx, data.max); 
    update_card_content(data.list); 

    content.style.transitionDuration = '0s';
    content.style.transform = 'translateX(' + -content.clientWidth + 'px)';
  };
}

function prev_page(content, indicator, now, dir, offset) {
  update_indicator(now, dir, indicator);
  animate_slide(content, offset);
}
  
function next_page(content, indicator, now, dir, offset) {
  update_indicator(now, dir, indicator);
  animate_slide(content, offset);
}

function animate_slide(content, offset) { 
  console.log('[1]slide');
  const pos = content.clientWidth * offset;
  content.style.transitionDuration = '0.5s';
  content.style.transform = 'translateX(' + (-pos) + 'px)';
}

function unload_test() {
  console.log('unload_test');
}