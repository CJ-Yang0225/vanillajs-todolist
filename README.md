# F2E Todo-List Practice

Todo-list with Vanilla JS

---

### 專案說明

使用原生 `JavaScript` 操作 `DOM API`以及練習`SCSS`，順便紀念我的髒髒程式碼 :)

---

### 學習紀錄

#### JavaScript

- IIFE (Immediately Invoked Function Expression): 避免變數污染到 global scope
- Array: `.push()`, `.splice()`, `.sort()`, `.filter()`, `.map()`, `.join()`, `.forEach()`
- `this` & `.bind()` & `Arrow Function`
- JSON: `.parse()`, `.stringify()`

#### Document Object Module

- Element

  - Properties: `.classList`, `.innerHTML`
  - Methods: `.addEventListener()`, `.querySelector()`, `.querySelectorAll()`, `.matches()`

- Events

  - Properties: `target`, `currentTarget`,
  - Methods: `.preventDefault()`, `.stopPropagation()`, `.stopImmediatePropagation()`

- Window
  - localStorage: `.getItem()`, `.setItem()`

---

### 心得

1. 綁定太多 EventListener ，應該使用 Event Delegation（事件委派）的概念，將事件綁在父元素，再透過冒泡向上傳遞至父元素觸發。

2. innerHTML 效能與安全問題需要考量。
