const gameBoard = document.querySelector("#gameboard");
const infoDisplay = document.querySelector("#info");
const btn = document.querySelector(".btn");
const startCells = [
  "", "", "",
  "", "", "",
  "", "", "",
];
let go = "circle";
infoDisplay.textContent = "Circle's first";


function createBoard() {
  startCells.forEach((_cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("square");
    cellElement.id = index;
    cellElement.addEventListener("click", addGo);
    gameBoard.appendChild(cellElement);
  })
}
createBoard();
btn.addEventListener("click", () => {
  window.location.reload();
})
const allSquares = document.querySelectorAll(".square");

function addGo(e) {
  const goDisplay = document.createElement("div");
  e.target.appendChild(goDisplay);
  go = (go === "circle") ? "cross": "circle";
  goDisplay.classList.add(go);
  infoDisplay.textContent = "it is " + go + " 's turn";
  e.target.removeEventListener("click", addGo);
  checkScore();
}

const winner = (array, className) => array.every(cell => 
  allSquares[cell].firstChild?.classList.contains(className));

function checkScore() {
  const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  combinations.forEach(array => {
    if (winner(array, "circle") || winner(array, "cross")) {
      const result = allSquares[array[0]].firstChild.className;
      infoDisplay.textContent = result === "circle"? "Circle Wins!": "Cross Wins!";
      array.forEach((cell) => {
        allSquares[cell].classList.add('winner');
      });
      allSquares.forEach(square => {
        square.replaceWith(square.cloneNode(true))
      });
      gameBoard.removeEventListener("click", addGo);
    }
  });
}
