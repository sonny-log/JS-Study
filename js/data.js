let id = 0;
const MAX = 4;
let gData = [];
let gNow = 0;

function get_imagedata() {
  const path = 'img/';
  return [
    { id: id++, wrap: 5, card: 0, img: path + 'dog1.png', txt: '[01] Lorem, ipsum.' },
    { id: id++, wrap: 0, card: 1, img: path + 'dog2.png', txt: '[02] Lorem ipsum dolor sit.' },
    {
      id: id++, wrap: 0, card: 2,
      img: path + 'dog3.png',
      txt: '[03] Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    },
    {
      id: id++, wrap: 0, card: 3,
      img: path + 'dog4.png',
      txt: '[04] Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque consequatur eligendi enim eum ducimus consectetur recusandae asperiores cumque aliquam porro? Fugit, illum a. Reiciendis eveniet tenetur reprehenderit, ipsam doloremque expedita!',
    },
    { id: id++, wrap: 1, card: 0, img: path + 'dog5.png', txt: '[05] Lorem, ipsum.' },
    //{ id: id++, wrap: 1, card: 1, img: path + 'dog6.png', txt: '[06] Lorem, ipsum.' },
    { id: id++, wrap: 1, card: 2, img: path + 'dog7.png', txt: '[07] Lorem, ipsum.' },
    { id: id++, wrap: 1, card: 3, img: path + 'dog8.png', txt: '[08] Lorem, ipsum.' },
    { id: id++, wrap: 2, card: 0, img: path + 'dog9.png', txt: '[09] Lorem, ipsum.' },
    { id: id++, wrap: 2, card: 1, img: path + 'dog10.png', txt: '[10] Lorem, ipsum.' },
    //{ id: id++, wrap: 2, card: 2, img: path + 'dog11.png', txt: '[11] Lorem, ipsum.' },
    { id: id++, wrap: 2, card: 3, img: path + 'dog12.png', txt: '[12] Lorem, ipsum.' },
    { id: id++, wrap: 3, card: 0, img: path + 'dog13.png', txt: '[13] Lorem, ipsum.' },
    { id: id++, wrap: 3, card: 1, img: path + 'dog14.png', txt: '[14] Lorem, ipsum.' },
    { id: id++, wrap: 3, card: 2, img: path + 'dog15.png', txt: '[15] Lorem, ipsum.' },
    //{ id: id++, wrap: 3, card: 3, img: path + 'dog16.png', txt: '[16] Lorem, ipsum.' },
    { id: id++, wrap: 4, card: 0, img: path + 'dog17.png', txt: '[17] Lorem, ipsum.' },
    { id: id++, wrap: 4, card: 3, img: path + 'dog18.png', txt: '[18] Lorem, ipsum.' }, 
    //{ id: id++, wrap: 4, card: 2, img: path + 'plus.png', txt: '[19] Lorem, ipsum.' },
    //{ id: id++, wrap: 5, card: 2, img: path + 'plus.png', txt: '[20] Lorem, ipsum.' }, 
    // 배열이 비워져있어도 + 이미지가 나올 수 있도록 만들어야함
    // plus 이미지가 들어가있지 않게 만들어야함
  ];
}

function get_max() {
  return MAX;
}
/*
function set_max(n) {
  MAX = n;
}
*/
function set_data(data) {
  gData = data;
}

function get_data() {
  return gData;
}

function get_now() {
  return gNow;
}

function set_now(index) {
  gNow = index;
}

function update_now(now, dir, size) {
  gNow = now + dir;
  if (gNow < 0) {
    gNow = size;
  } else if (gNow > size) {
    gNow = 0;
  }
}

function load_data(callback) {
  const list = get_imagedata();
  const size = list ? list.length : 0;
  const max = get_max();
  //list.sort((a, b) => a.wrap - b.wrap);
  setTimeout(() => {
    callback({
      list: list,
      size: size,
      max: max,
    });
  }, 100);
}

function sort_data(data) {
  return data.list.sort((a, b) => a.wrap - b.wrap);
  /*
  return {
    list: data.list.sort((a, b) => a.wrap - b.wrap),
    size: data.size,
    max: data.max,
  };
  */
}

function get_page_size() {
  const list = gData.list;
  const last = list.length - 1;
  return last < 0 ? 1 : list[last].wrap; 
  // list[last].wrap 은 card_wrap 의 총 갯수를 의미함
}

