function main() {
  load_data((data) => {
    //set_now(0);
    set_now(0);
    set_data({list: sort_data(data), size: data.size, max: data.max});
    display_body(get_data(), get_now());
  });
}

function display_body(data, now) {  // index > now 로 [파라미터명 변경]
  const content = document.getElementById('content');  // photo > content 로 바꿈 [변수명 변경]
  const page = document.getElementById('page');
  touch_event(content, data);
  display_div(content, now);
  display_page(page, now, data);
  jump_page(content, now, data); 
  display_photo(data.list);
}

function display_div(content, now) {
  const size = get_page_size();
  let html = '';
  for (let i = 0; i < 3; i++) { // card_wrap id 고정 // div 3개를 만들어줌
    html += `<div class='box_wrap'><div id='card_wrap_` + i + `'>`;
    for (let j = 0; j < 4; j++) {  // 4로 지정한 이유는 화면내 card를 4개로 한정했기 때문
      let card_idx = now + i - 1;
      if (card_idx < 0) {
        card_idx = size;
      }
      if (card_idx > size) {
        card_idx = 0;
      }
      html += create_div(card_idx, j);
    }
    html += '</div></div>';
  }
  content.innerHTML = html;
}

function create_div(card_idx, j) {
  let html = '';
  html +=
  `
    <div class="card" id="card_` + card_idx + `_` + j + `">
    <div class="image" style="background-image: url('img/plus.png')"></div>
    <div class="text"> ` + (card_idx + 1) + `_` + j + ` </div>
    </div>
  `;
  return html;
}

function display_page(page, now) {
  const size = get_page_size() + 1; // < 만 쓰기위해, size 만큼 page 생성하기 위함
  let html = '';
  
  for (let i = 0; i < size; i++) {
    html += create_page(i, now);
  }
  page.innerHTML = html;
}

function create_page(i, now) {
  if (i === now) {
    return (
      `<div class="active" onclick="click_page(` + i + `)">` + (i + 1) + `</div>`
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
  photo.style.backgroundImage = 'url(' + item.img + ')';
  photo.style.backgroundSize = '100% 100%';
}

function set_text(card, item) {
  const txt = card.querySelector('.text');
  txt.innerHTML = item.txt;
}

function click_page(now) {
  const div = document.getElementById('content');
  change_page_index(now);
  jump_page(div);
  display_div(div, now);
  display_photo(get_data().list);
}

function change_page_index(now) {
  let page = document.getElementById('page');
  let len = page.children.length;
  for (let i = 0; i < len; i++) {
    if (i === now) {
      page.children[i].classList.add('active');
    } else {
      page.children[i].classList.remove('active');
    }
  } set_now(now);
}

function touch_event(content, data) {
  let stx = 0;
  let edx = 0;
  let x = 0;
  let now = 0;
  content.addEventListener('touchstart', (e) => {
    now = get_now();
    stx = e.touches[0].clientX; // stx 는 고정
    content.style.transitionDuration = '0s'; 
  });
  content.addEventListener('touchmove', (e) => {
    x = (-content.clientWidth) + (e.touches[0].clientX - stx); // 터치 시작 위치 조정
    touch_move(content, x);
  }) 
  content.addEventListener('touchend', (e) => { //1. 슬라이드 동작 실행
    edx = e.changedTouches[0].clientX;
    content.style.transitionDuration = '0.4s'; // 슬라이드 동작을 위함
    stx < edx ? prev_page(content, now) : next_page(content, now); // 
  });

  content.ontransitioncancel = () => {
    content.style.transitionDuration = '0s';
  };
  content.ontransitionend = () => { // 2. 슬라이드 동작이 끝남과 동시에 div 새로 생성
    console.log('[2]change_content');
    content.style.transitionDuration = '0s'; // 눈속임 (끝남과 동시에 재 생성)
    let idx = get_now(); // touchstart 와는 다른 idx임 prev 와 next에서 새로 저장된 idx를 불러옴
    display_div(content, idx); // div를 새로 그려줌 
    display_photo(data.list); // data 배치
    content.style.transform = 'translateX(' + -content.clientWidth + 'px)'; // content 이동
  };
}

function touch_move(content, x) {
  let pos = x;
  content.style.transform = 'translateX(' + pos + 'px)';
}

function slide_event(content, offset) { // 슬라이드 동작하는 애니메이션이 일어남
  console.log('[1]slide');
  const pos = content.clientWidth * offset;
  // offset을 0과 2로 줄 수 있는 이유는 div 갯수를 3개로 제한했기 때문임
  // 슬라이드 되는 효과를 줄 수 있음.
  content.style.transform = 'translateX(' + (-pos) + 'px)';
}

function prev_page(content, now) {
  now = now - 1;
  loop_event(content, now, 0); 
}
  
function next_page(content, now) {
  now = now + 1;
  loop_event(content, now, 2);
}

function loop_event(content, now, offset) {
  const size = get_page_size(); // 페이지 갯수 6p 면 5 
  if (now < 0) { // 1페이지(idx=0)에서 -1 되는것을 방지  
    now = size;
    set_content(content, now, offset)
  }else if (now > size) { // 마지막 페이지에서 오버 되는것을 방지
    now = 0;
    set_content(content, now, offset)
  }else{
    set_content(content, now, offset)
  }
}

function set_content(content, now, offset) {  // 함수를 밖으로 꺼냄 * 
  change_page_index(now);
  slide_event(content, offset);
}

function jump_page(content) {
  const deviceWidth = content.clientWidth;
  content.style.transform = 'translateX(' + -deviceWidth + 'px)'; // 3개의 div 중 가운데로 위치 시켜줌
}

function unload_test() {
  console.log('unload_test');
}