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
  const page = document.getElementById('page');
  touch_event(content, data);
  create_card_wrap(content, now);
  create_indicator(page, now, data);
  update_card_content(data.list);
}

function create_card_wrap(content, now) { // create
  const size = get_page_size(); 
  let html = '';
  for (let i = 0; i < 3; i++) {
    html += `<div class='box_wrap'><div id='card_wrap_` + i + `'>`;
    for (let j = 0; j < 4; j++) {
      let card_idx = now + i - 1;
      if (card_idx < 0) {
        card_idx = size;
      }
      if (card_idx > size) {
        card_idx = 0;
      }
      html += create_card(card_idx, j);
    }
    html += '</div></div>';
  }
  content.innerHTML = html;
  content.style.transform = 'translateX(' + -content.clientWidth + 'px)'; 
}

function create_card(i, j) { 
  let html = '';
  html +=
  `
    <div class="card" id="card_` + i + `_` + j + `">
    <div class="image" style="background-image: url('img/plus.png')"></div>
    <div class="text"> ` + (i + 1) + `_` + j + ` </div>
    </div>
  `;
  return html;
}

function update_card(now) {
  const size = get_page_size();
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {  
      let card_idx = now + i - 1;
      if (card_idx < 0) {
        card_idx = size;
      }
      if (card_idx > size) {
        card_idx = 0;
      }
      const card_wrap = document.querySelector('#card_wrap_' + i);
      card_wrap.children[j].setAttribute('id', 'card_' + card_idx + '_' + j); 
      card_wrap.children[j].children[0].style.backgroundImage = 'url("img/plus.png")';
      card_wrap.children[j].children[0].style.backgroundSize = '50% 50%';
      card_wrap.children[j].children[1].innerHTML = (i + 1) + `_` + j;
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

function create_indicator(page, now) { // create
  const size = get_page_size() + 1; 
  let html = '';
  
  for (let i = 0; i < size; i++) {
    if (i === now) {
      html += `<div class="active" onclick="click_indicator(` + i + `)">` + (i + 1) + `</div>`;
    } else {
      html += `<div class="" onclick="click_indicator(` + i + `)">` + (i + 1) + `</div>`;
    }
  }
  page.innerHTML = html;
}

function update_indicator(now) {
  set_now(now);
  let page = document.getElementById('page');
  let len = page.children.length;
  for (let i = 0; i < len; i++) {
    if (i === now) {
      page.children[i].classList.add('active');
    } else {
      page.children[i].classList.remove('active');
    }
  } 
}

function click_indicator(now) { // update
  const content = document.getElementById('content');
  update_indicator(now);
  update_card(now); 
  update_card_content(get_data().list);
  content.style.transform = 'translateX(' + -content.clientWidth + 'px)'; 
}

function touch_event(content, data) {
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
    touch_move(content, x);
  }) 
  content.addEventListener('touchend', (e) => {
    edx = e.changedTouches[0].clientX;
    content.style.transitionDuration = '0.5s';
    stx < edx ? prev_page(content, now) : next_page(content, now);  
  });
  content.ontransitioncancel = () => {
    content.style.transitionDuration = '0s';
  };
  content.ontransitionend = () => { 
    console.log('[2]change_content');
    content.style.transitionDuration = '0s'; 
    let idx = get_now(); 
    update_card(idx); 
    update_card_content(data.list); 
    content.style.transform = 'translateX(' + -content.clientWidth + 'px)'; 
  };
}

function touch_move(content, x) {
  let pos = x;
  content.style.transform = 'translateX(' + pos + 'px)';
}

function prev_page(content, now) {
  now = now - 1;
  update_page(content, now, 0); 
}
  
function next_page(content, now) {
  now = now + 1;
  update_page(content, now, 2);
}

function update_page(content, now, offset) { // update
  const size = get_page_size(); 
  if (now < 0) {   
    now = size;
    update_indicator(now);
    create_slide(content, offset);
  }else if (now > size) { 
    now = 0;
    update_indicator(now);
    create_slide(content, offset);
  }else{
    update_indicator(now);
    create_slide(content, offset);
  }
}

function create_slide(content, offset) { 
  console.log('[1]slide');
  const pos = content.clientWidth * offset;
  content.style.transform = 'translateX(' + (-pos) + 'px)';
}

function unload_test() {
  console.log('unload_test');
}