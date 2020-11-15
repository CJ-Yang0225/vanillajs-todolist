const links = document.querySelectorAll(".nav-item-link");

const moreOption_btn = document.querySelector(".more_option-btn");
const addTask_expansion = document.querySelector(".add_task-expansion");
const addTask_input = document.querySelector("[type=text]");
const date_input = document.querySelector("#date-input");
const time_input = document.querySelector("#time-input");
const file = document.querySelector("#file_null");
const fileName = document.querySelector(".file_name");
const comment_area = document.querySelector("textarea");
const cancel_btn = document.querySelector(".btn-danger");
const save_btn = document.querySelector(".btn-primary");

const items = JSON.parse(localStorage.getItem("items")) || []; // 資料獲取時為字串，需要轉換物件 (注意無資料的處理)
const items_list = document.querySelector(".plates");

links.forEach(link => {
  link.addEventListener("click", function() {
    links.forEach(link => link.classList.remove("active"));
    link.classList.add("active");
  });
});

moreOption_btn.addEventListener("click", function() {
  // if (addTask_expansion.classList.contains("is_expanded")) {
  //   addTask_expansion.classList.remove("is_expanded");
  // } else {
  //   addTask_expansion.classList.add("is_expanded");
  // }

  addTask_expansion.classList.toggle("is_expanded");
});

function addItem() {
  const date = date_input.value || "";
  const time = time_input.value || "";
  const file = file || "";
  const title = addTask_input.value;
  const message = comment_area.value || "";

  // fileName.innerHTML = file.files[0].name;

  if (!title) {
    alert("請輸入 Task");
    return;
  }

  items.push({
    title,
    message,
    file,
    completed: true,
    favorite: false,
    deadline: "",
    date,
    time
  }); // 取 input 的資料放入 items (key跟value值相同可以只寫一個)

  localStorage.setItem("items", JSON.stringify(items)); // 字串化傳入Local Storage
  clearInput();
  populateList(items, items_list);
}

function updateItem(indexOfCard) {
  const dateInput = document.querySelector(
    ".card-expansion [name='name=date']"
  );
  const timeInput = document.querySelector(
    ".card-expansion [name='name=time']"
  );
  const fileInput = document.querySelector("[type='file']");

  const date = dateInput.value;
  const time = timeInput.value;
  const file = fileInput.files;

  items.push({
    file,
    date,
    time
  });
  localStorage.setItem("items", JSON.stringify(items)); // 字串化傳入Local Storage
  clearInput();
  populateList(items, items_list);
}

function clearInput() {
  date_input.value = "";
  time_input.value = "";
  file.files = "";
  addTask_input.value = "";
  comment_area.value = "";
  addTask_expansion.classList.remove("is_expanded");
}

function populateList(data = [], platesList) {
  platesList.innerHTML = data
    .map((value, index) => {
      return `
      <div class="card">
        <li>
          <input type="checkbox" id="item${index}" data-idx="${index}" ${
        value.completed ? "checked" : ""
      } >
          <label for="item${index}" class="title"">${value.title}</label>
          <p>${value.message}</p>
          <span>
            <button title="Star Favorite" class="btn icon favorite-btn">
              <i class="fa-star icon far"></i>
            </button>
            <button title="Edit" class="btn icon edit-btn">
              <i class="far fa-edit icon"></i>
            </button>
            <button title="Delete" class="btn icon delete-btn">
              <i class="far fa-trash-alt"></i>
            </button>
          </span>
        </li>
      </div>
      
      <div class="card-expansion">
        <div class="expansion-body">
          <label for="date-input" class="date-label icon">
            <i class="far fa-calendar-alt icon"></i>
            Deadline
          </label>
          <div>
            <input type="date" name="date" class="input">
            <input type="time" name="time" class="input">
          </div>
          <label>
            <i class="far fa-file icon"></i>
            File
          </label>
          <label for="file_null" class="file-label">
            <i class="fas fa-plus icon"></i>
          </label>
          <input type="file" name="file">
          <label for="" class="comment-label">
            <i class="far fa-comment-dots icon mr-s"></i>
            Comment
          </label>
          <textarea name="" id="comment-textarea"></textarea>
        </div>
        <div class="expansion-footer">
          <button class="btn btn-danger">
            <i class="fas fa-times icon mr-b"></i>
            Cancel
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus icon mr-b"></i>
            Update
          </button>
        </div>
      </div>
    `;
    })
    .join("");

  const editBtn_list = document.querySelectorAll(".edit-btn");
  const card_expansion_list = document.querySelectorAll(".card-expansion");
  const updateBtn_list = document.querySelectorAll(
    ".expansion-footer .btn-primary"
  );

  editBtn_list.forEach((editBtn, index) => {
    editBtn.addEventListener("click", function() {
      card_expansion_list[index].classList.toggle("is_expanded");
    });
  });

  updateBtn_list.forEach((updateBtn, index) =>
    updateBtn.addEventListener("click", updateItem(index))
  );
}

function completedToggle(e) {
  if (!e.target.matches("input")) return;
  const el = e.target;
  const index = el.dataset.idx; // 自定義資料屬性(data-idx)
  items[index].completed = !items[index].completed;
  localStorage.setItem("items", JSON.stringify(items));
  populateList(items, items_list);
}

function _uuid() {
  return "xxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

var uuid = _uuid();

cancel_btn.addEventListener("click", clearInput);
save_btn.addEventListener("click", addItem);
items_list.addEventListener("click", completedToggle);

populateList(items, items_list);
