function main() {
  load_data((data) => {
    //set_now(0);
    set_now(5);
    set_data({list: sort_data(data), size: data.size, max: data.max});
    display_body(get_data(), get_now());
  });
}

function display_body(data, index) {
  const photo = document.getElementById('content');
  const page = document.getElementById('page');
  touch_event(photo, page, data);
  display_div(photo, index);
  display_page(page, index, data);
  jump_page(photo, index, data); 
  display_photo(data.list);
}

function display_div(photo, index) {
  const size = get_page_size() - 1;
  let html = '';
  for (let i = 0; i < 3; i++) {
    html += `<div class='box_wrap'><div id='card_wrap_` + i + `'>`;
    for (let j = 0; j < 4; j++) {
      let k = index + i - 1;
      if (index != 0 && k < 0) {
        k = size + i - 1;
      }
      if (index == 0 && k < 0) {
        k = size;
      }
      if (index != size && k > size) {
        k = k-index;
      }
      if(index == size && k > size) {
        k = k-index-1;
      }
      html += create_div(k, j);
      // -1 >> 4 5 0   // -2-1 0
      // 6 >>  5 0 1  // 5 6 7 
    }
    html += '</div></div>';
  }
  photo.innerHTML = html;
}

function display_page(page, now) {
  const size = get_page_size();
  let html = '';
  
  for (let i = 0; i < size; i++) {
    html += create_page(i, now);
  }
  page.innerHTML = html;
}

function create_div(i, j) {
  let html = '';
  html +=
  `
    <div class="card" id="card_`+ i + `_` + j +`">
    <div class="image" style="background-image: url('img/plus.png')"></div>
    <div class="text"> ` + (i+1) + `_` + j + ` </div>
    </div>
  `;
  return html;
}

function create_page(i, now) {
  if (i === now) {
    return (
      `<div class="active" onclick="click_page(` + i +`)">`+ (i + 1) + `</div>`
    );
  } else {
    return (
      `<div class="" onclick="click_page(` + i + `)">` + (i + 1) + `</div>`
    );
  }
}

function display_photo(list) {
  for(let i = 0; i < list.length; i++) {
    const item = list[i];
    const card = document.getElementById('card_' + item.wrap + '_' + item.card);
    if(card) {
      set_image(card, item);
      set_text(card, item);
    }
  }
}

function set_image(card, item) {
  const photo = card.querySelector('.image');
  photo.style.backgroundImage = 'url('+item.img+')';
  photo.style.backgroundSize = '100% 100%';
}

function set_text(card, item) {
  const txt = card.querySelector('.text');
  txt.innerHTML = item.txt;
}

function click_page(data_index) {
  const div = document.getElementById('content');
  change_page_index(data_index);
  jump_page(div, data_index);
  display_div(div, data_index);
  display_photo(get_data().list);
}

function change_page_index(data_index) {
  let page = document.getElementById('page');
  let len = page.children.length;
  for (let i = 0; i < len; i++) {
    if (i === data_index) {
      page.children[i].classList.add('active');
    } else {
      page.children[i].classList.remove('active');
    }
  }
}

function touch_event(div, page, data) {
  let stx = 0;
  let edx = 0;
  let x = 0;
  let index = 0;
  div.addEventListener('touchstart', (e) => {
    index = get_now();
    stx = e.touches[0].clientX;
    div.style.transitionDuration = '0s'; 
  });
  div.addEventListener('touchmove', (e) => {
    x = (-div.clientWidth) + (e.touches[0].clientX - stx);
    touch_move(div, x);
  }) 
  div.addEventListener('touchend', (e) => { 
    edx = e.changedTouches[0].clientX;
    div.style.transitionDuration = '0.4s';
    stx < edx ? prev_page(div, index) : next_page(div, index);
  });

  div.ontransitioncancel = () => {
    div.style.transitionDuration = '0s';
  };
  div.ontransitionend = () => { 
    div.style.transitionDuration = '0s';
    let idx = get_now();
    display_div(div, idx);
    display_photo(data.list);
    div.style.transform = 'translateX(' + -div.clientWidth + 'px)'
  };
}

function touch_move(div, x) {
  let pos = x;
  div.style.transform = 'translateX(' + pos + 'px)';
}

function slide_event(div, index, offset) {
  console.log(index);
  const pos = div.clientWidth * offset;
  div.style.transform = 'translateX(' + (-pos) + 'px)';
  set_now(index);
}

function loop_event(div, index, offset) {
  const size = get_page_size() - 1;
  if (index < 0) {
    k = size;
    change_page_index(k);
    slide_event(div, k, offset);
  }else if (index > size) {
    k = 0;
    change_page_index(k);
    slide_event(div, k, offset);
  }else{
    change_page_index(index);
    slide_event(div, index, offset);
  }
  
}
function prev_page(div, index) {
  index = index-1;
  loop_event(div, index, 0);
}
  
function next_page(div, index) {
  index = index+1;
  loop_event(div, index, 2);
  
}

function jump_page(div, index) {
  const deviceWidth = div.clientWidth;
  div.style.transform = 'translateX(' + -deviceWidth + 'px)';
  set_now(index);
}

function unload_test() {
  console.log('unload_test');
}