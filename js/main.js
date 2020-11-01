const links = document.querySelectorAll(".nav-item-link");

links.forEach(link => {
  link.addEventListener("click", function() {
    links.forEach(link => link.classList.remove("active"));
    link.classList.add("active");
  });
});

const btn_more = document.querySelector(".btn_more");
height: 0;
const expansion = document.querySelector(".add_task-expansion");

btn_more.addEventListener("click", function() {
  console.log(this);
  expansion.classList.toggle("is_expanded");
});
