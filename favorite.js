const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
let userList = JSON.parse(localStorage.getItem('favoriteData'));
let searchUserList = [];
let female = [];
let male = [];
let currentPage = 1
const onePageUser = 20;
const list = document.querySelector("#list");
const userName = document.querySelector("#userName");
const avatar = document.querySelector("#avatar");
const content = document.querySelector("#content");
const pagination = document.querySelector("#pagination")
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const filter = document.querySelector('#filter')

//生成使用者清單
function userCard(data) {
  if (list.dataset.mode === 'modeCard') {
    data.forEach((element) => {
      list.innerHTML += `
    <div class="card m-2 text-center" style="width: 18rem"  data-id='${element.id}'>
      <img src="${element.avatar}" class="card-img-top" alt="avatar" data-id='${element.id}' data-bs-toggle="modal" data-bs-target="#modal">
      <div class="card-body" data-id='${element.id}'>
        <p class="card-text" data-bs-toggle="modal" data-bs-target="#modal" data-id='${element.id}'>${element.name} ${element.surname}</p>
        <i class="bi bi-heart-fill" data-id='${element.id}'></i>
      </div>
    </div>
    `;
    });
  } else if (list.dataset.mode === 'modeList'){
    list.innerHTML += `
    <li class="list-group-item d-flex justify-content-between">
      <h5 class="card-title col-3 text-center" id='name'>Name</h5>
      <h5 class="card-title col-1 text-center" id='gender'>Gender</h5>
      <h5 class="card-title col-1 text-center" id='listAge'>Age</h5>
      <h5 class="card-title col-1 text-center">favorite</h5>
    </li>
    `
    data.forEach((element) => {
      list.innerHTML += `
    <li class="list-group-item d-flex justify-content-between mouse" data-id='${element.id}'>
      <h5 class="card-title col-3 " data-bs-toggle="modal" data-bs-target="#modal" data-id='${element.id}' id='listName'>${element.name} ${element.surname}</h5>
      <h5 class="card-title col-1 text-center" data-bs-toggle="modal" data-bs-target="#modal" data-id='${element.id}' id='listGender'>${element.gender} </h5>
      <h5 class="card-title col-1 text-center" data-bs-toggle="modal" data-bs-target="#modal" data-id='${element.id}'>${element.age}</h5>
      <div class='col-1 text-center' id='listHeart'>
        <i class="bi bi-heart-fill" data-id='${element.id}'></i>
      </div>
    </li>
    `;
    })
  }
  
}

// 生成分頁清單 &頁碼
function userListPage(data, dataName, currentPage) {
  // 使用者清單
  const page = Math.ceil(data.length / onePageUser)
  const startIndex = (currentPage - 1) * onePageUser
  list.innerHTML = `
    <div class="d-flex justify-content-end" id='mode'>
      <i class="bi bi-list-ul text-end" id='modeList'></i>
      <i class="bi bi-grid-3x3-gap-fill text-end" id='modeCard'></i>
    </div>
   `
  userCard(data.slice(startIndex, startIndex + onePageUser))

  // 頁碼
  if (page >= 5) {
    let pageNumber = currentPage
    let previousPage = currentPage - 1
    let nextPage = currentPage + 1
    if (currentPage === 1) {
      previousPage = 1
      pageNumber = 3
    } else if (currentPage === 2) {
      pageNumber = 3
    } else if (currentPage === page - 1) {
      pageNumber = pageNumber - 1
    } else if (currentPage === page) {
      pageNumber = pageNumber - 2
      nextPage = page
    }
    pagination.innerHTML = `
    <li class="page-item" data-name='${dataName}'>
      <a class="page-link" href="#" aria-label="Previous" id='${previousPage}' data-name='${dataName}'>
        <span aria-hidden="true" id='${previousPage}'>&laquo;</span>
      </a>
    </li>
    <li class="page-item active" id='${pageNumber - 2}' data-name='${dataName}'><a class="page-link" href="#" id='${pageNumber - 2}' data-name='${dataName}'>${pageNumber - 2}</a></li>
    <li class="page-item" id='${pageNumber - 1}' data-name='${dataName}'><a class="page-link" href="#" id='${pageNumber - 1}' data-name='${dataName}'>${pageNumber - 1}</a></li>
    <li class="page-item" id='${pageNumber}' data-name='${dataName}'><a class="page-link" href="#" id='${pageNumber}' data-name='${dataName}'>${pageNumber}</a></li>
    <li class="page-item" id='${pageNumber + 1}' data-name='${dataName}'><a class="page-link" href="#" id='${pageNumber + 1}' data-name='${dataName}'>${pageNumber + 1}</a></li>
    <li class="page-item" id='${pageNumber + 2}' data-name='${dataName}'><a class="page-link" href="#" id='${pageNumber + 2}' data-name='${dataName}'>${pageNumber + 2}</a></li>
    <li class="page-item" data-name='${dataName}'>
      <a class="page-link" href="#" aria-label="Next" id='${nextPage}' data-name='${dataName}'>
        <span aria-hidden="true" id='${nextPage}' >&raquo;</span>
      </a>
    </li>
  `
  } else {
    pagination.innerHTML = ''
    pagination.innerHTML = `
    <li class="page-item active" id='1' data-name='${dataName}'><a class="page-link" href="#" data-page='1' id='1' data-name='${dataName}'>1</a></li>
    `
    for (let x = 2; x <= page; x++) {
      pagination.innerHTML += `
    <li class="page-item" id='${x}' data-name='${dataName}'><a class="page-link" href="#" data-page='${x}' id='${x}' data-name='${dataName}'>${x}</a></li>
    `
    }
  }
}

// 互動視窗
function modalContent(id) {
  if (!id) {
    return;
  }
  userName.textContent = "";
  avatar.innerHTML = "";
  content.innerHTML = "";
  axios
    .get(INDEX_URL + id)
    .then(function (response) {
      userName.textContent = `${response.data.name} ${response.data.surname}`;
      avatar.innerHTML = `<img src='${response.data.avatar}'alt="avatar" class="img-fluid">`;
      content.innerHTML = `
        <p>gender：${response.data.gender}</p>
        <p>age：${response.data.age}</p>
        <p>region：${response.data.region}</p>
        <p>birthday：${response.data.birthday}</p>
        <p>email：${response.data.email}</p>
        <p>created：${response.data.created_at}</p>
        <p>updated：${response.data.updated_at}</p>
    `;
    })
    .catch((error) => console.log(error));
}

// 判斷資料並產生使用者清單
function chooseData() {
  let dataName = pagination.firstElementChild.dataset.name
  if (dataName === 'searchUserList') {
    userListPage(searchUserList, 'searchUserList', currentPage)
  } else if (dataName === 'female') {
    userListPage(female, 'female', currentPage)
  } else if (dataName === 'male') {
    userListPage(male, 'male', currentPage)
  } else {
    userListPage(userList, 'userList', currentPage)
  }
}

// 標記當前頁面
function markPage() {
  if (pagination.children[1].classList.contains('active')) {
    pagination.children[1].classList.remove('active')
  } else {
    pagination.children[0].classList.remove('active')
  }
  for (let i of pagination.children) {
    if (Number(i.id) === currentPage) {
      i.classList.add('active')
    }
  }
}

//搜尋
searchForm.addEventListener('submit', function (event) {
  event.preventDefault()
  const keyWord = searchInput.value.split(" ").join("").toLowerCase()
  searchUserList = userList.filter(function (item) {
    let name = item.name.toLowerCase() + item.surname.toLowerCase()
    return name.includes(keyWord)
  })
  if (searchUserList.length === 0) {
    return alert(`您輸入的關鍵字：${keyWord} 沒有符合條件的使用者`);
  }
  userListPage(searchUserList, 'searchUserList', 1)
  currentPage = 1
})

// 點擊產生互動視窗 & 最愛移除
list.addEventListener("click", function (event) {
  let dataName = pagination.children[0].dataset.name
  let page = pagination.children
  // 將點擊的清單從本地儲存移除
  if (event.target.matches('.bi-heart-fill')) {
    event.target.classList.remove('bi-heart-fill')
    event.target.classList.add('bi-heart')
    let index = userList.findIndex(function (item) {
      return item.id === Number(event.target.dataset.id)
    })
    if(index === -1) return
    userList.splice(index, 1)
    localStorage.setItem('favoriteData', JSON.stringify(userList))
    // 判斷資料
    if (dataName === 'searchUserList') {
      let index = searchUserList.findIndex(function (item) {
        return item.id === Number(event.target.dataset.id)
      })
      searchUserList.splice(index, 1)
      userListPage(searchUserList, 'searchUserList', currentPage)
    } else if (dataName === 'female') {
      let index = female.findIndex(function (item) {
        return item.id === Number(event.target.dataset.id)
      })
      female.splice(index, 1)
      userListPage(female, 'female', currentPage)
    } else if (dataName === 'male') {
      let index = male.findIndex(function (item) {
        return item.id === Number(event.target.dataset.id)
      })
      male.splice(index, 1)
      userListPage(male, 'male', currentPage)
    } else {
      userListPage(userList, 'userList', currentPage)
    }
  } else {
    modalContent(event.target.dataset.id);
  }
  // 標記當前頁面
  markPage(currentPage)
});

// 篩選 & 排序
filter.addEventListener('click', function (event) {
  currentPage = 1
  let dataName = pagination.children[0].dataset.name
  let data = []
  // 判斷資料
  if (dataName === 'searchUserList') {
    data = searchUserList
  } else if (dataName === 'female') {
    data = female
  } else if (dataName === 'male') {
    data = male
  } else {
    data = userList
  }
  // 篩選 & 排序
  if (event.target.id === 'female') {
    data = searchUserList.length ? searchUserList : userList
    female = data.filter(function (item) {
      return item.gender === 'female'
    })
    userListPage(female, 'female', 1)
  } else if (event.target.id === 'male') {
    data = searchUserList.length ? searchUserList : userList
    male = data.filter(function (item) {
      return item.gender === 'male'
    })
    userListPage(male, 'male', 1)
  } else if (event.target.id === 'old') {
    data = data.sort(function (a, b) {
      return a.age < b.age ? 1 : -1
    })
    userListPage(data, `${dataName}`, 1)
  } else if (event.target.id === 'young') {
    data = data.sort(function (a, b) {
      return a.age > b.age ? 1 : -1
    })
    userListPage(data, `${dataName}`, 1)
  }

})

// 換頁
pagination.addEventListener('click', function (event) {
  if (event.target.matches('#pagination')) return
  currentPage = Number(event.target.id)
  chooseData()
  markPage()
})

// 切換清單模式
list.addEventListener('click', function (event) {
  if (event.target.id === 'modeList') {
    list.dataset.mode = 'modeList'
    chooseData()
  } else if (event.target.id === 'modeCard') {
    list.dataset.mode = 'modeCard'
    chooseData()
  }
  markPage()
})


userListPage(userList, 'userList', 1)