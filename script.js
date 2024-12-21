const field = document.querySelector("#field");
const size = document.querySelector("#fieldSize");
const bombs = new Set();
const bombChance = 0.25;

let gamefield = [];
let gameStarted = false;
let fieldWidth = "";

// Начало игры

function startGame() {
  if (size.value > 0 && size.validity.valid) {
    gameStarted = false;
    fieldWidth = size.value;
    gamefield = Array.from({ length: fieldWidth * fieldWidth }, () => -1);
    field.innerHTML = "";
    gamefield.forEach(() => field.appendChild(document.createElement("div")));
    field.style.gridTemplateRows = `repeat(${size.value}, 1fr)`;
  }
}

function fieldClick(event) {
  if (!gameStarted) {
    gameStarted = true;
    startCell = Array.from(event.target.parentNode.children).indexOf(
      event.target
    );
    bombs.clear();
    while (bombs.size < Math.floor(bombChance * gamefield.length)) {
      const bombIndex = Math.floor(Math.random() * gamefield.length);
      if (bombIndex != startCell) {
        bombs.add(bombIndex);
      }
    }
    console.log(bombs);
    openCell(startCell);
    return;
  }
  playedCell = Array.from(event.target.parentNode.children).indexOf(
    event.target
  );
  openCell(playedCell);
}

function openCell(position) {
  //   console.log(position);
  //   код если проиграли
  if (bombs.has(position)) {
    displayCell(position, 9);
    return;
  }
  //  ищем сколько мин вокруг
  count = getCount(position);
  //   console.log(count);
  // код если выиграли
  displayCell(position, count);
  if (count == 0) {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (
          !(y == -1 && !(position % fieldWidth)) &&
          !(y == 1 && !((position + 1) % fieldWidth)) &&
          gamefield[fieldWidth * x + position + y] == -1
        )
          openCell(fieldWidth * x + position + y);
      }
    }
  }
}

function getCount(position) {
  let count = 0;
  //   console.log(position, fieldWidth);
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      currentPosition = fieldWidth * x + position + y;
      //   console.log(x, y, currentPosition, bombs.has(currentPosition), position);
      if (
        bombs.has(currentPosition) &&
        !(y == -1 && !(position % fieldWidth)) &&
        !(y == 1 && !((position + 1) % fieldWidth))
      ) {
        count++;
      }
    }
  }
  gamefield[position] = count;
  return count;
}

function displayCell(position, count) {
  switch (count) {
    case 9:
      console.log("*");
      field.children.item(position).innerHTML = "";
      field.children.item(position).classList.toggle("cell-mine", true);
      break;
    case 0:
      field.children.item(position).classList.toggle("cell-empty", true);
    default:
      console.log(count);
      field.children.item(position).innerHTML = count;
      field.children.item(position).classList.toggle("cell-open", true);
  }
}

// function startGame(WIDTH, HEIGHT, BOMBS_COUNT) {
//   const cellsCount = WIDTH * HEIGHT;
//   field.innerHTML = "";
//   field.style.gridTemplateColumns = `repeat(${WIDTH}, 40px)`;
//   for (let i = 0; i < cellsCount; i++) {
//     const cell = document.createElement("button");
//     field.appendChild(cell);
//   }
//   const cells = [...field.children];

//   let closedCount = cellsCount;

//   const bombs = new Set();
//   while (bombs.size < BOMBS_COUNT) {
//     const bombIndex = Math.floor(Math.random() * cellsCount);
//     bombs.add(bombIndex);
//   }

//   field.addEventListener("mousedown", (event) => {
//     if (event.target.tagName === "BUTTON" && event.button === 0) {
//       const button = event.target;
//       if (
//         !button.classList.contains("opened") &&
//         !button.classList.contains("flag")
//       ) {
//         button.classList.add("opened");
//         if (event.target.tagName !== "BUTTON") {
//           return;
//         }

//         const index = cells.indexOf(event.target);
//         const row = Math.floor(index / WIDTH);
//         const column = index % WIDTH;
//         open(row, column);
//       }
//     }
//   });

//   field.addEventListener("contextmenu", (event) => {
//     event.preventDefault();
//     if (event.target.tagName === "BUTTON") {
//       const button = event.target;
//       if (!button.classList.contains("opened")) {
//         button.classList.add("flag"); // Добавляем/удаляем класс для флажка
//       }
//     }
//   });

//   function isValid(row, column) {
//     return row >= 0 && row < HEIGHT && column >= 0 && column < WIDTH;
//   }

//   function open(row, column) {
//     if (!isValid(row, column)) return;

//     const index = row * WIDTH + column;
//     const cell = cells[index];

//     if (cell.disabled) return;

//     cell.disabled = true;

//     if (isBomb(row, column)) {
//       cell.innerHTML = "💣";
//       field.innerHTML = "";
//       document.querySelector("#handlegameResult").innerHTML = "Вы проиграли!";
//       return;
//     }

//     closedCount--;
//     if (closedCount <= BOMBS_COUNT) {
//       field.innerHTML = "";
//       document.querySelector("#handlegameResult").innerHTML = "Вы выиграли!";
//       return;
//     }

//     const count = getCount(row, column);

//     if (count !== 0) {
//       cell.innerHTML = count;
//       return;
//     }

//     for (let x = -1; x <= 1; x++) {
//       for (let y = -1; y <= 1; y++) {
//         open(row + x, column + y);
//       }
//     }
//   }

//   function isBomb(row, column) {
//     if (!isValid(row, column)) return false;

//     const index = row * WIDTH + column;
//     return bombs.has(index);
//   }
// }

// document.querySelector("button").addEventListener("click", () => {
//   const fieldSizeInput = document.getElementById("fieldSize");
//   const size = parseInt(fieldSizeInput.value);
//   const bombsCount = Math.floor(size * size * 0.25);

//   startGame(size, size, bombsCount);
// });
