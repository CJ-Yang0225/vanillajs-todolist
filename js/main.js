(function () {
  const links = document.querySelectorAll(".nav-item-link");

  const moreOption_btn = document.querySelector(".more_option-btn");
  const addTask_expansion = document.querySelector(".add_task-expansion");
  const addTask_input = document.querySelector("#add_task-input");
  const date_input = document.querySelector("#date-input");
  const time_input = document.querySelector("#time-input");
  const file = document.querySelector("#file_null");
  const message_area = document.querySelector("#message-textarea");
  const cancel_btn = document.querySelector(".btn-danger");
  const save_btn = document.querySelector(".btn-primary");

  const items = JSON.parse(localStorage.getItem("items")) || []; // 資料獲取時為字串，需要轉換物件 (注意無資料的處理)
  const items_list = document.querySelector(".plates");

  const taskStatus = document.querySelector(".tasks-status");

  links.forEach((link) => {
    link.addEventListener("click", function () {
      links.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
      populateList(items, items_list);
    });
  });

  addTask_input.addEventListener("click", addTaskExpansionToggle);
  addTask_input.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) addItem();
  });

  moreOption_btn.addEventListener("click", addTaskExpansionToggle);

  function addTaskExpansionToggle() {
    addTask_expansion.classList.toggle("is_expanded");
  }

  function addItem() {
    const date = date_input.value || "";
    const time = time_input.value || "";
    const fileName = file.files[0] ? file.files[0].name : "";
    const title = addTask_input.value;
    const message = message_area.value || "";

    // fileName.innerHTML = file.files[0].name;

    if (!title) {
      alert("請輸入 Task");
      return;
    }

    items.push({
      title,
      message,
      fileName,
      completed: false,
      favorite: false,
      deadline: "",
      date,
      time,
    }); // 取 input 的資料放入 items (key跟value值相同可以只寫一個)

    localStorage.setItem("items", JSON.stringify(items)); // 字串化傳入Local Storage
    clearInput();
    populateList(items, items_list);
  }

  function editItem(indexOfCard) {
    const dateInput = document.querySelector(
      `#task${indexOfCard} + .card-expansion [name='date']`
    );
    const timeInput = document.querySelector(
      `#task${indexOfCard} + .card-expansion [name='time']`
    );
    const fileInput = document.querySelector(
      `#task${indexOfCard} + .card-expansion [type='file']`
    );
    const messageArea = document.querySelector(
      `#task${indexOfCard} + .card-expansion textarea`
    );

    dateInput.value = dateInput.value || items[indexOfCard]["date"];
    timeInput.value = timeInput.value || items[indexOfCard]["time"];
    fileInput.value = fileInput.value || items[indexOfCard]["fileName"];
    messageArea.value = messageArea.value || items[indexOfCard]["message"];

    items[indexOfCard]["date"] = dateInput.value;
    items[indexOfCard]["time"] = timeInput.value;
    items[indexOfCard]["fileName"] = fileInput.value;
    items[indexOfCard]["message"] = messageArea.value;

    localStorage.setItem("items", JSON.stringify(items)); // 字串化傳入Local Storage
    populateList(items, items_list);
  }

  function starItem(indexOfCard, event) {
    items[indexOfCard].favorite = !items[indexOfCard].favorite;
    localStorage.setItem("items", JSON.stringify(items));
    populateList(items, items_list);
  }

  function completedToggle(e) {
    if (!e.target.matches("input[type='checkbox']")) return;
    const el = e.target;
    const index = el.dataset.idx; // 自定義資料屬性(data-idx)
    items[index].completed = !items[index].completed;
    localStorage.setItem("items", JSON.stringify(items));

    populateList(items, items_list);
  }

  function cancelItem(indexOfCard) {
    const inputs = document.querySelectorAll(
      `#task${indexOfCard} + .card-expansion input`
    );

    inputs.forEach((input) => (input.value = ""));
    document.querySelector(
      `#task${indexOfCard} + .card-expansion textarea`
    ).value = "";

    document
      .querySelector(`#task${indexOfCard} + .card-expansion`)
      .classList.remove("is_expanded");
  }

  function deleteItem(indexOfCard) {
    items.splice(indexOfCard, 1);
    localStorage.setItem("items", JSON.stringify(items));
    populateList(items, items_list);
  }

  function clearInput() {
    date_input.value = "";
    time_input.value = "";
    addTask_input.value = "";
    message_area.value = "";
    addTask_expansion.classList.remove("is_expanded");
  }

  function populateList(data = [], platesList) {
    data
      .sort((a, b) => (a.title > b.title ? 1 : -1))
      .sort((a, b) => !a.favorite - !b.favorite);

    let tasks = [];
    let tasks_in_progress = data.filter((item) => item.completed == false);
    let tasks_completed = data.filter((item) => item.completed == true);
    if (links[1].classList.contains("active")) {
      tasks = tasks_in_progress;
    } else if (links[2].classList.contains("active")) {
      tasks = tasks_completed;
    } else {
      tasks = data;
    }

    platesList.innerHTML = tasks
      .map((value, index) => {
        return `
        <div class="card" id="task${index}">
          <li class=${value.favorite ? "star" : ""}>
            <input type="checkbox" id="item${index}" data-idx="${index}" ${
          value.completed ? "checked" : ""
        } >
            <label for="item${index}" class="title">${value.title}</label>
            <p>${value.message}</p>
            <span>
              <button title="Star Favorite" class="btn icon favorite-btn">
                <i class="${value.favorite ? "fas" : "far"} fa-star icon"></i>
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
            <label for="" class="message-label">
              <i class="far fa-message-dots icon mr-s"></i>
              message
            </label>
            <textarea name="message"></textarea>
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

    taskStatus.innerHTML = `${tasks_in_progress.length} in progress<br>${tasks_completed.length} in completed`;

    const favoriteBtn_list = document.querySelectorAll(".favorite-btn");
    const editBtn_list = document.querySelectorAll(".edit-btn");
    const deleteBtn_list = document.querySelectorAll(".delete-btn");

    const card_expansion_list = document.querySelectorAll(".card-expansion");
    const updateBtn_list = document.querySelectorAll(
      ".card-expansion .btn-primary"
    );

    const cancelBtn_list = document.querySelectorAll(
      ".card-expansion .btn-danger"
    );

    if (tasks.length == 0) return;

    for (let i = 0; i < tasks.length; i++) {
      editBtn_list[i].addEventListener("click", () =>
        card_expansion_list[i].classList.toggle("is_expanded")
      );
      // favoriteBtn_list[i].addEventListener("click", this.starItem.bind(this, i));
      favoriteBtn_list[i].addEventListener("click", () => starItem(i));
      deleteBtn_list[i].addEventListener("click", () => deleteItem(i));
      updateBtn_list[i].addEventListener("click", () => editItem(i));
      cancelBtn_list[i].addEventListener("click", () => cancelItem(i));
    }
  }

  cancel_btn.addEventListener("click", clearInput);
  save_btn.addEventListener("click", addItem);
  items_list.addEventListener("click", completedToggle);

  populateList(items, items_list);

  /* window.addEventListener("click", (e) => {
    e.preventDefault(); // 停止預設功能(點擊超連結的時候，不執行原本預設的行為)
    // e.stopPropagation(); // 停止後續傳遞(同一個層級的 listener 還是會被執行)
    e.stopImmediatePropagation(); // 停止後續相同事件
  }, true); // 指定為從捕獲階段開始監聽 */
})();
