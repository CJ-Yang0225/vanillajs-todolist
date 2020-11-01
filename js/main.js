const links = document.querySelectorAll(".nav-item-link");
const btn_more = document.querySelector(".btn_more");
const expansion = document.querySelector(".add_task-expansion");
const items = JSON.parse(localStorage.getItem("items")) || []; // 資料獲取時為字串，需要轉換物件 (注意無資料的處理)

links.forEach(link => {
  link.addEventListener("click", function() {
    links.forEach(link => link.classList.remove("active"));
    link.classList.add("active");
  });
});

btn_more.addEventListener("click", function() {
  console.log(this);
  expansion.classList.toggle("is_expanded");
});
