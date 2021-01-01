(function () {
  const links = document.querySelectorAll(".nav-item-link");

  const moreOptionBtn = document.querySelector(".more_option-btn");
  const addTaskExpansion = document.querySelector(".add_task-expansion");
  const addTaskInput = document.querySelector("#add_task-input");
  const dateInput = document.querySelector("#date-input");
  const timeInput = document.querySelector("#time-input");
  const file = document.querySelector("#file_null");
  const messageArea = document.querySelector("#message-textarea");
  const cancelBtn = document.querySelector(".btn-danger");
  const saveBtn = document.querySelector(".btn-primary");

  const items = JSON.parse(localStorage.getItem("items")) || []; // 資料獲取時為字串，需要轉換物件 (注意無資料的處理)
  const itemsList = document.querySelector(".plates");

  const taskStatus = document.querySelector(".tasks-status");

  links.forEach((link) => {
    link.addEventListener("click", function () {
      links.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
      populateList(items, itemsList);
    });
  });

  addTaskInput.addEventListener("click", addTaskExpansionToggle);
  addTaskInput.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) addItem();
  });

  moreOptionBtn.addEventListener("click", addTaskExpansionToggle);

  function addTaskExpansionToggle() {
    addTaskExpansion.classList.toggle("is_expanded");
  }

  function addItem() {
    const date = dateInput.value || "";
    const time = timeInput.value || "";
    const fileName = file.files[0] ? file.files[0].name : "";
    const title = addTaskInput.value;
    const message = messageArea.value || "";

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
    populateList(items, itemsList);
  }

  function editItem(indexOfCard) {
    const titleInput = document.querySelector(
      `#item${indexOfCard} + [type='text']`
    );
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

    titleInput.value = titleInput.value || items[indexOfCard]["title"];
    dateInput.value = dateInput.value || items[indexOfCard]["date"];
    timeInput.value = timeInput.value || items[indexOfCard]["time"];
    fileInput.files[0] = fileInput.files[0] || items[indexOfCard]["fileName"];
    messageArea.value = messageArea.value || items[indexOfCard]["message"];

    items[indexOfCard]["title"] = titleInput.value;
    items[indexOfCard]["date"] = dateInput.value;
    items[indexOfCard]["time"] = timeInput.value;
    items[indexOfCard]["fileName"] = fileInput.files[0]
      ? fileInput.files[0].name
      : "";
    items[indexOfCard]["message"] = messageArea.value;

    localStorage.setItem("items", JSON.stringify(items)); // 字串化傳入Local Storage
    populateList(items, itemsList);
  }

  function starItem(indexOfCard) {
    items[indexOfCard].favorite = !items[indexOfCard].favorite;
    localStorage.setItem("items", JSON.stringify(items));
    populateList(items, itemsList);
  }

  function completedToggle(e) {
    if (!e.target.matches("input[type='checkbox']")) return;
    const el = e.target;
    const index = el.dataset.idx; // 自定義資料屬性(data-idx)
    items[index].completed = !items[index].completed;
    localStorage.setItem("items", JSON.stringify(items));

    populateList(items, itemsList);
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
    populateList(items, itemsList);
  }

  function clearInput() {
    dateInput.value = "";
    timeInput.value = "";
    addTaskInput.value = "";
    messageArea.value = "";
    addTaskExpansion.classList.remove("is_expanded");
  }

  function populateList(data = [], platesList) {
    data
      .sort((a, b) => (a.title > b.title ? 1 : -1))
      .sort((a, b) => !a.favorite - !b.favorite);

    let tasks = [];
    let tasksInProgress = data.filter((item) => item.completed == false);
    let tasksCompleted = data.filter((item) => item.completed == true);
    if (links[1].classList.contains("active")) {
      tasks = tasksInProgress;
    } else if (links[2].classList.contains("active")) {
      tasks = tasksCompleted;
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
            <input type="text" value=${
              value.title
            } class="edit_task-input" disabled>
            <p title=${value.message}>${value.message}</p>
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
            <label class="message-label">
              <i class="far fa-comment-dots icon"></i>
              Message
            </label>
            <textarea name="message" placeholder="Type your memo here…"></textarea>
          </div>
          <div class="expansion-footer">
            <button class="btn btn-danger">
              <i class="fas fa-times icon"></i>
              Cancel
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-plus icon"></i>
              Update
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    taskStatus.innerHTML = `${tasksInProgress.length} in progress<br>${tasksCompleted.length} in completed`;

    const favoriteBtnList = document.querySelectorAll(".favorite-btn");
    const editBtnList = document.querySelectorAll(".edit-btn");
    const deleteBtnList = document.querySelectorAll(".delete-btn");

    const editTaskInput = document.querySelectorAll(".edit_task-input");

    const cardExpansionList = document.querySelectorAll(".card-expansion");
    const updateBtnList = document.querySelectorAll(
      ".card-expansion .btn-primary"
    );

    const cancelBtnList = document.querySelectorAll(
      ".card-expansion .btn-danger"
    );

    if (tasks.length == 0) return;

    for (let i = 0; i < tasks.length; i++) {
      editBtnList[i].addEventListener("click", () => {
        cardExpansionList[i].classList.toggle("is_expanded");
        editTaskInput[i].disabled = !editTaskInput[i].disabled;
      });
      // favoriteBtnList[i].addEventListener("click", this.starItem.bind(this, i));
      favoriteBtnList[i].addEventListener("click", () => starItem(i));
      deleteBtnList[i].addEventListener("click", () => deleteItem(i));
      updateBtnList[i].addEventListener("click", () => editItem(i));
      cancelBtnList[i].addEventListener("click", () => cancelItem(i));
    }
  }

  cancelBtn.addEventListener("click", clearInput);
  saveBtn.addEventListener("click", addItem);
  itemsList.addEventListener("click", completedToggle);

  populateList(items, itemsList);

  /* window.addEventListener("click", (e) => {
    e.preventDefault(); // 停止預設功能(點擊超連結的時候，不執行原本預設的行為)
    // e.stopPropagation(); // 停止後續傳遞(同一個層級的 listener 還是會被執行)
    e.stopImmediatePropagation(); // 停止後續相同事件
  }, true); // 指定為從捕獲階段開始監聽 */
})();
