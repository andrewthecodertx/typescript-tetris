const cube = document.getElementById("cube");

const canvas = document.getElementById("gamearena");
const ctx = canvas.getContext("2d");
ctx.scale(30, 30);

const bpcanvas = document.getElementById("bullpen");
const bpctx = bpcanvas.getContext("2d");
bpctx.scale(20, 20);

const gamepiece = { position: { x: 0, y: 0, }, matrix: null, };
const bullpenpiece = { position: { x: 0, y: 0, }, matrix: null, };

const canvasSpace = (height, width) => {
  return Array.from({ length: height }, () => new Array(width).fill(0));
};

const gamearena = canvasSpace(20, 10);
const bullpen = canvasSpace(4, 2);

const colors = [
  null,
  "0,     255, 255" /* I cyan */,
  "0,     0,   255" /* J purple */,
  "255,   165,   0" /* L orange */,
  "255,   255,   0" /* O yellow */,
  "0,     128,   0" /* S green */,
  "128,   0,   128" /* T purple */,
  "255,   0,     0" /* Z red */,
];

let standby = assignPiece();
let cancelId = 0;

let dropCounter = 0;
let dropSpeed = 1000;
let time = 0;

let score = 0;
let level = 1;
let lines = 0;

document.addEventListener("keydown", kbcontrols);

function kbcontrols(event) {
  if (event.keyCode === 32) {
    document.removeEventListener("keydown", kbcontrols);
    document.addEventListener("keydown", playercontrols);

    initiateNewGamePiece(standby);
    loadBullpen();

    requestAnimationFrame(run);
  }
}

function playercontrols(event) {
  switch (event.keyCode) {
    case 37:
			/* left arrow; move left   */ shiftShape(-1);
      break;
    case 72:
			/* h; move left   */ shiftShape(-1);
      break;
    case 39:
			/* right arrow; move right */ shiftShape(1);
      break;
    case 76:
			/* l; move right */ shiftShape(1);
      break;
    /* case 38 up arrow dropFast() */
    case 40:
			/* down arrow; drop piece  */ dropShape();
      break;
    case 74:
			/* j; drop piece  */ dropShape();
      break;
    case 83:
			/* s; rotate right         */ rotateShape(1);
      break;
    case 65:
			/* a; rotate left          */ rotateShape(-1);
      break;
  }
}

function assignPiece() {
  const pieces = "TJLOSZI";
  return pieces[(pieces.length * Math.random()) | 0];
}

function clearRow() {
  const rows = 1;

  loop: for (let y = gamearena.length - 1; y > 0; --y) {
    for (let x = 0; x < gamearena[y].length; ++x) {
      if (gamearena[y][x] === 0) {
        continue loop;
      }
    }

    const row = gamearena.splice(y, 1)[0].fill(0);
    gamearena.unshift(row);
    ++y;

    updateScore(rows);
  }

  displayScore();
}

function updateScore(rows) /* and level up! */ {
  rowMultiplier = rows;
  score += rowMultiplier * 10;
  lines += 1;
  if (score > 49 * level) {
    level += 1;
    if (dropSpeed > 200) {
      dropSpeed -= 200;
    }
  }
  rowMultiplier *= 2;
}

function collision() {
  for (let y = 0; y < gamepiece.matrix.length; ++y) {
    for (let x = 0; x < gamepiece.matrix[y].length; ++x) {
      if (
        gamepiece.matrix[y][x] !== 0 &&
        (gamearena[y + gamepiece.position.y] &&
          gamearena[y + gamepiece.position.y][x + gamepiece.position.x]) !== 0
      ) {
        return true;
      }
    }
  }

  return false;
}

function displayScore() {
  document.getElementById("score").innerText = score;
  document.getElementById("level").innerText = level;
  document.getElementById("lines").innerText = lines;
}

function dropShape() {
  gamepiece.position.y++;

  if (collision()) {
    gamepiece.position.y--;
    fuse();
    initiateNewGamePiece(standby);
    loadBullpen();
    clearRow();
  }

  dropCounter = 0;
}

function fuse() {
  gamepiece.matrix.forEach((row, y) => {
    row.forEach((column, x) => {
      if (column !== 0) {
        gamearena[y + gamepiece.position.y][x + gamepiece.position.x] = column;
      }
    });
  });
}

function gameOver() {
  document.removeEventListener("keydown", playercontrols);
  cancelAnimationFrame(cancelId);
  document.addEventListener("keydown", kbcontrols);
  //TODO: create web service track high scores
}

function gamePiece(shape) {
  switch (shape) {
    case "I":
      return [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

    case "J":
      return [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
      ];

    case "L":
      return [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
      ];

    case "O":
      return [
        [4, 4],
        [4, 4],
      ];

    case "S":
      return [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
      ];

    case "T":
      return [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0],
      ];

    case "Z":
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ];
  }
}

function initiateNewGamePiece(n) {
  gamepiece.matrix = gamePiece(n);
  gamepiece.position.x =
    ((gamearena[0].length / 2) | 0) - ((gamepiece.matrix[0].length / 2) | 0);
  gamepiece.position.y = 0;

  if (collision()) {
    gameOver();
  }
}

function loadBullpen() {
  standby = assignPiece();

  bpctx.clearRect(0, 0, bpcanvas.width, bpcanvas.height);
  bpctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  bpctx.fillRect(0, 0, bpcanvas.width, bpcanvas.height);

  bullpenpiece.matrix = gamePiece(standby);

  renderElement(bullpen, { x: 0, y: 1 }, bpctx);
  renderElement(bullpenpiece.matrix, { x: 0, y: 0 }, bpctx);
}

function redrawCanvases() {
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, 10, 20);

  renderElement(gamearena, { x: 0, y: 0 }, ctx);
  renderElement(gamepiece.matrix, gamepiece.position, ctx);
}

function renderElement(element, offset, context) {
  element.forEach((row, ypos) => {
    row.forEach((color, xpos) => {
      if (color !== 0) {
        context.drawImage(cube, xpos + offset.x, ypos + offset.y, 1, 1);
        context.fillStyle = `rgba(${colors[color]}, 0.4)`;
        context.fillRect(xpos + offset.x, ypos + offset.y, 1, 1);
      }
    });
  });
}

function rotate(shape, direction) {
  for (let y = 0; y < shape.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
    }
  }

  if (direction > 0) {
    for (const row of shape) {
      row.reverse();
    }
  } else {
    shape.reverse();
  }
}

function rotateShape(direction) {
  let offset = 1;

  rotate(gamepiece.matrix, direction);

  while (collision()) {
    gamepiece.position += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));

    if (offset > gamepiece.matrix[0].length) {
      rotate(gamepiece.matrix, -direction);
      gamepiece.position.x = gamepiece.position;
      return;
    }
  }
}

function run(t = 0) {
  const newTime = t - time;

  dropCounter += newTime;

  if (dropCounter > dropSpeed) {
    dropShape();
  }

  time = t;

  redrawCanvases();
  cancelId = requestAnimationFrame(run);
}

function shiftShape(offset) {
  gamepiece.position.x += offset;

  if (collision()) {
    gamepiece.position.x -= offset;
  }
}
