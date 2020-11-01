const links = document.querySelectorAll(".nav-item-link");
const moreOption_btn = document.querySelector(".btn_more");
const expansion = document.querySelector(".add_task-expansion");
const addTask_input = document.querySelector("[type=text]");
const date_input = document.querySelector("#date-input");
const time_input = document.querySelector("#time-input");
const comment_area = document.querySelector("textarea");
const cancel_btn = document.querySelector(".btn-danger");
const save_btn = document.querySelector(".btn-primary");
const items = JSON.parse(localStorage.getItem("items")) || []; // 資料獲取時為字串，需要轉換物件 (注意無資料的處理)

links.forEach(link => {
  link.addEventListener("click", function() {
    links.forEach(link => link.classList.remove("active"));
    link.classList.add("active");
  });
});

moreOption_btn.addEventListener("click", function() {
  // if (expansion.classList.contains("is_expanded")) {
  //   expansion.classList.remove("is_expanded");
  // } else {
  //   expansion.classList.add("is_expanded");
  // }

  expansion.classList.toggle("is_expanded");
});

function addItem() {
  const date = date_input.value || "";
  const time = time_input.value || "";
  const title = addTask_input.value;
  const message = comment_area.value || "";

  if (!title) {
    alert("請輸入 Task");
    return;
  }

  items.push({
    title,
    message,
    completed: false,
    favorite: false,
    deadline: "",
    date,
    time
  }); // 取 input 的資料放入 items (key跟value值相同可以只寫一個)

  localStorage.setItem("items", JSON.stringify(items)); // 字串化傳入Local Storage
  clearInput();
}

function clearInput() {
  date_input.value = "";
  time_input.value = "";
  addTask_input.value = "";
  comment_area.value = "";
  expansion.classList.remove("is_expanded");
}

cancel_btn.addEventListener("click", clearInput);
save_btn.addEventListener("click", addItem);
