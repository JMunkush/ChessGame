const board = document.querySelector(".board");
const container = document.querySelector(".container");
const data = "ABCDEFGH";
const letters = document.createElement("div");
letters.classList.add("letters1");

for (let i = 0; i < 8; i++) {
  let letter = document.createElement("div");
  letter.innerText = data.charAt(i);
  letter.classList.add("letter");
  letters.appendChild(letter);
}
container.appendChild(letters);

let isWhite = true;
let number = 8;
let numberLetter = ["A", "B", "C", "D", "E", "F", "G", "H"];
let letterCount = 0;

for (let i = 1; i <= 64; i++) {
  const div = document.createElement("div");
  div.setAttribute("id", number + "-" + numberLetter[letterCount]);
  div.classList.add("row");

  if (isWhite) {
    if (i % 2 == 0) {
      div.classList.add("black__row");
    } else {
      div.classList.add("white__row");
    }
  }

  if (!isWhite) {
    if (i % 2 != 0) {
      div.classList.add("black__row");
    } else {
      div.classList.add("white__row");
    }
  }

  if (i % 8 == 0) {
    number--;
    if (isWhite) {
      isWhite = false;
    } else {
      isWhite = true;
    }
  }
  board.appendChild(div);
  if (letterCount == 7) {
    letterCount = 0;
  } else {
    letterCount++;
  }
}

const main = document.querySelector(".game");
const digits = document.createElement("div");


digits.classList.add("digits");

for (let i = 8; i >= 1; i--) {
  const digit = document.createElement("div");
  digit.classList.add("digit");
  digit.innerText = i;

  digits.appendChild(digit);
}
const st = document.createElement("div");
st.classList.add('step');
digits.appendChild(st)

main.appendChild(digits);


(() => {
  setWhitePawns();
  setBlackPawns();
  setWhiteRooks();
  setBlackRooks();
  setWhiteKnights();
  setBlackKnights();
  setWhiteBishops();
  setBlackBishops();
  setQueens();
  setKings();
})();

let currentUser = "white";

let whiteUserState = false;
let whiteUserStep = [];
let whiteFrom = null;

let blackUserState = false;
let blackUserStep = [];
let blackFrom = null;

function move(el) {
  if (currentUser === "white") {
    if (whiteUserStep) {
      if (whiteUserStep.includes(el.id) && whiteFrom) {
        console.log("moved");
        const current = document.getElementById(whiteFrom).childNodes[0];
        el.innerHTML = "";
        el.appendChild(current);
        current.innerHTML = "";

        whiteUserStep.forEach((s) => {
          document.getElementById(s).classList.remove("greenRow");
        });
        resetUsers();


        currentUser = "black";
      }
    }
  }

  if (currentUser === "black") {
    if (blackUserStep) {
      if (blackUserStep.includes(el.id) && blackFrom) {
        const current = document.getElementById(blackFrom).childNodes[0];
        el.innerHTML = "";
        el.appendChild(current);
        current.innerHTML = "";

        blackUserStep.forEach((s) => {
          document.getElementById(s).classList.remove("greenRow");
        });
        resetUsers();
        currentUser = "white";
      }
    }
  }
}

function resetUsers() {
  resetWhiteUser();
  resetBlackUser();
}

function resetWhiteUser() {
  whiteUserState = false;
  whiteUserStep = [];
}
function resetBlackUser() {
  blackUserState = false;
  blackUserStep = [];
}

function rookStep(rook) {
  if (currentUser === "white") {
    if (rook.id.split("-")[1] === "b") {
      move(rook.parentElement);
      return;
    }
    whiteFrom = rook.parentElement.id;
  } else {
    if (rook.id.split("-")[1] === "w") {
      move(rook.parentElement);
      return;
    }
    blackFrom = rook.parentElement.id;
  }
  const locationDigit = rook.parentElement.id.split("-")[0];
  const locationLetter = rook.parentElement.id.split("-")[1];
  const toStepLocations = [];

  setLocationsToRook(locationLetter, locationDigit, toStepLocations);

  if (currentUser === "white") {
    fillToGreenLocationsForWhite(toStepLocations);
  } else {
    fillToGreenLocationsForBlack(toStepLocations);
  }
}

function bishopStep(bishop){

  if (currentUser === "white") {
    if (bishop.id.split("-")[1] === "b") {
      move(bishop.parentElement);
      return;
    }
    whiteFrom = bishop.parentElement.id;
  } else {
    if (bishop.id.split("-")[1] === "w") {
      move(bishop.parentElement);
      return;
    }
    blackFrom = bishop.parentElement.id;
  }

  const locationDigit = bishop.parentElement.id.split("-")[0];
  const locationLetter = bishop.parentElement.id.split("-")[1];
  const toStepLocations = [];

  setLocationsToBishop(locationLetter, locationDigit, toStepLocations);

  if (currentUser === "white") {
    fillToGreenLocationsForWhite(toStepLocations);
  } else {
    fillToGreenLocationsForBlack(toStepLocations);
  }
}

function setLocationsToBishop(letter, digit, locations){
  if (
    isBlackElement(document.getElementById(digit + "-" + letter)) &&
    currentUser === "white"
  ) {
    return;
  }
  if (
    !isBlackElement(document.getElementById(digit + "-" + letter)) &&
    currentUser === "black"
  ) {
    return;
  }

let tempLetter = letter;


  // upRight
for(let i = (+digit) + 1; i <= 8; i++){
  const next = nextLetter(tempLetter);
  tempLetter = next;

  if(!next){
    break;
  } else {
    const nextId = i + "-" + next;
    const nextElement = document.getElementById(nextId);

    if (nextElement.hasChildNodes()) {
      if (currentUser === "white" && isBlackElement(nextElement)) {
        locations.push(nextId);
        break;
      } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        break;
      }

      if (currentUser === "black" && !isBlackElement(nextElement)) {
        locations.push(nextId);
        break;
      } else if (currentUser === "black" && isBlackElement(nextElement)) {
        break;
      }
    }

    locations.push(nextId);
  }
 
}

 // upLeft
tempLetter = letter;

for(let i = (+digit) + 1; i <= 8; i++){
  const next = previousLetter(tempLetter);
  tempLetter = next;

  if(!next){
    break;
  } else {
    const nextId = i + "-" + next;
    const nextElement = document.getElementById(nextId);

    if (nextElement.hasChildNodes()) {
      if (currentUser === "white" && isBlackElement(nextElement)) {
        locations.push(nextId);
        break;
      } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        break;
      }

      if (currentUser === "black" && !isBlackElement(nextElement)) {
        locations.push(nextId);
        break;
      } else if (currentUser === "black" && isBlackElement(nextElement)) {
        break;
      }
    }

    locations.push(nextId);
  }
 
}


 // downLeft
tempLetter = letter;
for(let i = (+digit) - 1; i >= 1; i--){
  const next = previousLetter(tempLetter);
  tempLetter = next;

  if(!next){
    break;
  } else {
    const nextId = i + "-" + next;
    const nextElement = document.getElementById(nextId);

    if (nextElement.hasChildNodes()) {
      if (currentUser === "white" && isBlackElement(nextElement)) {
        locations.push(nextId);
        break;
      } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        break;
      }

      if (currentUser === "black" && !isBlackElement(nextElement)) {
        locations.push(nextId);
        break;
      } else if (currentUser === "black" && isBlackElement(nextElement)) {
        break;
      }
    }

    locations.push(nextId);
  }
 
}



//downRight
tempLetter = letter;
for(let i = (+digit) - 1; i >= 1; i--){
  const next = nextLetter(tempLetter);
  tempLetter = next;


  if(!next){
    break;
  } else {
    const nextId = i + "-" + next;
    const nextElement = document.getElementById(nextId);

    if (nextElement.hasChildNodes()) {
      if (currentUser === "white" && isBlackElement(nextElement)) {
        locations.push(nextId);
        break;
      } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        break;
      }

      if (currentUser === "black" && !isBlackElement(nextElement)) {
        locations.push(nextId);
        break;
      } else if (currentUser === "black" && isBlackElement(nextElement)) {
        break;
      }
    }

    locations.push(nextId);
  }
  
  
}
}


function queenStep(queen){
  if (currentUser === "white") {
    if (queen.id.split("-")[1] === "b") {
      move(queen.parentElement);
      return;
    }
    whiteFrom = queen.parentElement.id;
  } else {
    if (queen.id.split("-")[1] === "w") {
      move(queen.parentElement);
      return;
    }
    blackFrom = queen.parentElement.id;
  }
  const locationDigit = queen.parentElement.id.split("-")[0];
  const locationLetter = queen.parentElement.id.split("-")[1];
  const toStepLocations = [];

  setLocationsToRook(locationLetter, locationDigit, toStepLocations);
  setLocationsToBishop(locationLetter, locationDigit, toStepLocations);

  if (currentUser === "white") {
    fillToGreenLocationsForWhite(toStepLocations);
  } else {
    fillToGreenLocationsForBlack(toStepLocations);
  }
}

function kingStep(king){
  if (currentUser === "white") {
    if (king.id.split("-")[1] === "b") {
      move(king.parentElement);
      return;
    }
    whiteFrom = king.parentElement.id;
  } else {
    if (king.id.split("-")[1] === "w") {
      move(king.parentElement);
      return;
    }
    blackFrom = king.parentElement.id;
  }
  const locationDigit = king.parentElement.id.split("-")[0];
  const locationLetter = king.parentElement.id.split("-")[1];
  const toStepLocations = [];

  setLocationsToKing(locationLetter, locationDigit, toStepLocations);

  if (currentUser === "white") {
    fillToGreenLocationsForWhite(toStepLocations);
  } else {
    fillToGreenLocationsForBlack(toStepLocations);
  }
}

function setLocationsToKing(letter, digit, locations){
  if (
    isBlackElement(document.getElementById(digit + "-" + letter)) &&
    currentUser === "white"
  ) {
    return;
  }
  if (
    !isBlackElement(document.getElementById(digit + "-" + letter)) &&
    currentUser === "black"
  ) {
    return;
  }

  const tempLocations = [];

  //top
  tempLocations.push(((+digit) + 1) + "-" + letter);

  //down
  tempLocations.push(((+digit) - 1) + "-" + letter);

  //left 
  tempLocations.push(digit + "-" + previousLetter(letter));

  //right
  tempLocations.push(digit + "-" + nextLetter(letter));


  //topRight
  tempLocations.push(((+digit) + 1) + "-" + nextLetter(letter));
  
  //topLeft
  tempLocations.push(((+digit) + 1) + "-" + previousLetter(letter));


  //downRight
  tempLocations.push(((+digit) - 1) + "-" + nextLetter(letter));
  
  //topLeft
  tempLocations.push(((+digit) - 1) + "-" + previousLetter(letter));





  for(const loc of tempLocations){
    addLocationIfValid(loc, locations)
  }

}


function addLocationIfValid(nextId, locations){
  const letter = nextId.split("-")[1];
  const digit = nextId.split("-")[0];



  if(digit < 1 || digit > 8 || letter === 'null'){
    return;
  }

  const nextElement = document.getElementById(nextId);


  if (nextElement && nextElement.hasChildNodes()) {
    if (currentUser === "white" && isBlackElement(nextElement)) {
      locations.push(nextId);
    } 
    if (currentUser === "black" && !isBlackElement(nextElement)) {
      locations.push(nextId);
    } 
  } else {
    locations.push(nextId);
  }
}

function knightStep(knight) {
  if (currentUser === "white") {
    if (knight.id.split("-")[1] === "b") {
      move(knight.parentElement);
      return;
    }
    whiteFrom = knight.parentElement.id;
  } else {
    if (knight.id.split("-")[1] === "w") {
      move(knight.parentElement);
      return;
    }
    blackFrom = knight.parentElement.id;
  }
  const locationDigit = knight.parentElement.id.split("-")[0];
  const locationLetter = knight.parentElement.id.split("-")[1];
  const toStepLocations = [];

  setLocationsToKnight(locationLetter, locationDigit, toStepLocations);

  if (currentUser === "white") {
    fillToGreenLocationsForWhite(toStepLocations);
  } else {
    fillToGreenLocationsForBlack(toStepLocations);
  }
}

function setLocationsToKnight(letter, digit, locations) {
  if (
    isBlackElement(document.getElementById(digit + "-" + letter)) &&
    currentUser === "white"
  ) {
    return;
  }
  if (
    !isBlackElement(document.getElementById(digit + "-" + letter)) &&
    currentUser === "black"
  ) {
    return;
  }

  const rightLetter = nextLetter(nextLetter(letter));
  const leftLetter = previousLetter(previousLetter(letter));
  let upDigit = +digit + 1;
  let downDigit = +digit - 1;

  // x+
  if (rightLetter) {
    if (upDigit >= 1 && upDigit <= 8) {
      const nextId = upDigit + "-" + rightLetter;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
        }
      } else {
        locations.push(nextId);
      }
    }

    if (downDigit >= 1 && downDigit <= 8) {
      const nextId = downDigit + "-" + rightLetter;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
        }
      } else {
        locations.push(nextId);
      }
    }
  }

  // x-
  if (leftLetter) {
    if (upDigit >= 1 && upDigit <= 8) {
      const nextId = upDigit + "-" + leftLetter;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
        }
      } else {
        locations.push(nextId);
      }
    }
    if (downDigit >= 1 && downDigit <= 8) {
      const nextId = downDigit + "-" + leftLetter;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
        }
      } else {
        locations.push(nextId);
      }
    }
  }

  // y+
  upDigit++;
  const yRightLetter = nextLetter(letter);
  const yLeftLetter = previousLetter(letter);

  if (upDigit >= 1 && upDigit <= 8) {
    if (yRightLetter) {

      const nextId = upDigit + "-" + yRightLetter;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
        }
      } else {
        locations.push(nextId);
      }

    }
    if (yLeftLetter) {
      const nextId = upDigit + "-" + yLeftLetter;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
        }
      } else {
        locations.push(nextId);
      }
    }
  }

  // y-
  downDigit--;
  if (downDigit >= 1 && downDigit <= 8) {
    if (yRightLetter) {
      const nextId = downDigit + "-" + yRightLetter;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
        }
      } else {
        locations.push(nextId);
      }
    }
    if (yLeftLetter) {
      const nextId = downDigit + "-" + yLeftLetter;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
        }
      } else {
        locations.push(nextId);
      }
    }
  }
}

function setLocationsToRook(letter, digit, locations) {
  if (
    isBlackElement(document.getElementById(digit + "-" + letter)) &&
    currentUser === "white"
  ) {
    return;
  }
  if (
    !isBlackElement(document.getElementById(digit + "-" + letter)) &&
    currentUser === "black"
  ) {
    return;
  }

  // x+
  let tempX = letter;
  while (true) {
    const next = nextLetter(tempX);
    tempX = next;
    if (next === null) {
      break;
    } else {
      const nextId = digit + "-" + next;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
          break;
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
          break;
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
          break;
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
          break;
        }
      }

      locations.push(nextId);
    }
  }

  // x-
  let tempY = letter;
  while (true) {
    const prevoius = previousLetter(tempY);
    tempY = prevoius;
    if (prevoius === null) {
      break;
    } else {
      const nextId = digit + "-" + prevoius;
      const nextElement = document.getElementById(nextId);

      if (nextElement.hasChildNodes()) {
        if (currentUser === "white" && isBlackElement(nextElement)) {
          locations.push(nextId);
          break;
        } else if (currentUser === "white" && !isBlackElement(nextElement)) {
          break;
        }

        if (currentUser === "black" && !isBlackElement(nextElement)) {
          locations.push(nextId);
          break;
        } else if (currentUser === "black" && isBlackElement(nextElement)) {
          break;
        }
      }

      locations.push(nextId);
    }
  }

  // y+
  for (let i = +digit + 1; i <= 8; i++) {
    const nextId = i + "-" + letter;
    const nextElement = document.getElementById(nextId);

    if (nextElement.hasChildNodes()) {
      if (currentUser === "white" && isBlackElement(nextElement)) {
        locations.push(i + "-" + letter);
        break;
      } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        break;
      }

      if (currentUser === "black" && !isBlackElement(nextElement)) {
        locations.push(i + "-" + letter);
        break;
      } else if (currentUser === "black" && isBlackElement(nextElement)) {
        break;
      }
    }

    locations.push(i + "-" + letter);
  }

  // y-
  for (let i = +digit - 1; i >= 1; i--) {
    const nextId = i + "-" + letter;
    const nextElement = document.getElementById(nextId);

    if (nextElement.hasChildNodes()) {
      if (currentUser === "white" && isBlackElement(nextElement)) {
        locations.push(i + "-" + letter);
        break;
      } else if (currentUser === "white" && !isBlackElement(nextElement)) {
        break;
      }

      if (currentUser === "black" && !isBlackElement(nextElement)) {
        locations.push(i + "-" + letter);
        break;
      } else if (currentUser === "black" && isBlackElement(nextElement)) {
        break;
      }
    }

    locations.push(i + "-" + letter);
  }
}

function isBlackElement(el) {
  return el.childNodes[0].id.split("-")[1] === "b";
}

function blackPawnStep(pawn) {
  if (currentUser === "white") {
    return;
  }
  blackFrom = pawn.parentElement.id;
  const locationDigit = pawn.parentElement.id.split("-")[0];
  const locationLetter = pawn.parentElement.id.split("-")[1];

  const leftVarId = +locationDigit - 1 + "-" + previousLetter(locationLetter);
  const rightVarId = +locationDigit - 1 + "-" + nextLetter(locationLetter);

  const leftVar = document.getElementById(leftVarId);
  const rightVar = document.getElementById(rightVarId);

  const toStepLocations = [];
  const nextStepId = +locationDigit - 1 + "-" + locationLetter;
  const nextEl = document.getElementById(nextStepId);

  if (blackFrom.split("-")[0] === "7") {
    if (nextEl && !nextEl.hasChildNodes()) {
      toStepLocations.push(nextStepId);
      toStepLocations.push(+locationDigit - 2 + "-" + locationLetter);
    }
  } else {
    if (nextEl && !nextEl.hasChildNodes()) {
      toStepLocations.push(nextStepId);
    }
  }

  if (
    leftVar &&
    leftVar.hasChildNodes() &&
    leftVar.childNodes[0].id.split("-")[1] === "w"
  ) {
    toStepLocations.push(leftVarId);
    leftVar.classList.add("greenRow");
  }

  if (
    rightVar &&
    rightVar.hasChildNodes() &&
    rightVar.childNodes[0].id.split("-")[1] === "w"
  ) {
    toStepLocations.push(rightVarId);
    rightVar.classList.add("greenRow");
  }

  fillToGreenLocationsForBlack(toStepLocations);
}

function whitePawnStep(pawn) {
  if (currentUser === "black") {
    return;
  }
  whiteFrom = pawn.parentElement.id;
  const locationDigit = pawn.parentElement.id.split("-")[0];
  const locationLetter = pawn.parentElement.id.split("-")[1];

  const leftVarId = +locationDigit + 1 + "-" + previousLetter(locationLetter);
  const rightVarId = +locationDigit + 1 + "-" + nextLetter(locationLetter);

  const leftVar = document.getElementById(leftVarId);
  const rightVar = document.getElementById(rightVarId);

  const toStepLocations = [];
  const nextStepId = +locationDigit + 1 + "-" + locationLetter;
  const nextEl = document.getElementById(nextStepId);

  if (whiteFrom.split("-")[0] === "2") {
    if (nextEl && !nextEl.hasChildNodes()) {
      toStepLocations.push(nextStepId);
      toStepLocations.push(+locationDigit + 2 + "-" + locationLetter);
    }
  } else {
    if (nextEl && !nextEl.hasChildNodes()) {
      toStepLocations.push(nextStepId);
    }
  }

  if (
    leftVar &&
    leftVar.hasChildNodes() &&
    leftVar.childNodes[0].id.split("-")[1] === "b"
  ) {
    toStepLocations.push(leftVarId);
    leftVar.classList.add("greenRow");
  }

  if (
    rightVar &&
    rightVar.hasChildNodes() &&
    rightVar.childNodes[0].id.split("-")[1] === "b"
  ) {
    toStepLocations.push(rightVarId);
    rightVar.classList.add("greenRow");
  }

  fillToGreenLocationsForWhite(toStepLocations);
}

function fillToGreenLocationsForBlack(toStepLocations) {
  if (blackUserStep) {
    if (arraysEqual(blackUserStep, toStepLocations)) {
      console.log("cancelling step");
      blackUserStep.forEach((s) => {
        document.getElementById(s).classList.remove("greenRow");
      });
      resetBlackUser();
      return;
    } else {
      blackUserStep.forEach((s) => {
        document.getElementById(s).classList.remove("greenRow");
      });
      console.log("changed step");
      resetBlackUser();
    }
  }

  if (blackUserStep) {
    blackUserStep.forEach((s) => {
      document.getElementById(s).classList.remove("greenRow");
    });
    resetBlackUser();
  }

  if (!blackUserState) {
    blackUserState = true;
    toStepLocations.forEach((s) => {
      blackUserStep.push(s);
    });

    toStepLocations.forEach((s) => {
      const step = document.getElementById(s);
      step.setAttribute("onclick", "move(this)");
      step.classList.add("greenRow");
    });
  }
}

function fillToGreenLocationsForWhite(toStepLocations) {
  if (whiteUserState) {
    if (arraysEqual(whiteUserStep, toStepLocations)) {
      console.log("cancelling step");
      whiteUserStep.forEach((s) => {
        document.getElementById(s).classList.remove("greenRow");
      });
      resetWhiteUser();
      return;
    } else {
      whiteUserStep.forEach((s) => {
        document.getElementById(s).classList.remove("greenRow");
      });
      console.log("changed step");
      resetWhiteUser();
    }
  }

  if (whiteUserStep) {
    whiteUserStep.forEach((s) => {
      document.getElementById(s).classList.remove("greenRow");
    });
    resetWhiteUser();
  }

  if (!whiteUserState) {
    whiteUserState = true;
    toStepLocations.forEach((s) => {
      whiteUserStep.push(s);
    });

    toStepLocations.forEach((s) => {
      const step = document.getElementById(s);
      step.setAttribute("onclick", "move(this)");
      step.classList.add("greenRow");
    });
  }
}

function checkIfNoneExists(a, b) {
  for (let i = 0; i < b.length; i++) {
    if (a.includes(b[i])) {
      return false;
    }
  }
  return true;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function nextLetter(letter) {
  if (letter && letter.length !== 1 || !/[a-hA-H]/.test(letter)) {
    return null;
  }

  const upperCaseLetter = letter.toUpperCase();
  const nextCharCode = upperCaseLetter.charCodeAt(0) + 1;

  if (nextCharCode > 72) {
    return null;
  }

  return String.fromCharCode(nextCharCode);
}

function previousLetter(letter) {
  if (letter.length !== 1 || !/[b-iB-I]/.test(letter)) {
    return null;
  }

  const upperCaseLetter = letter.toUpperCase();
  const prevCharCode = upperCaseLetter.charCodeAt(0) - 1;

  if (prevCharCode < 65) {
    return "H";
  }

  return String.fromCharCode(prevCharCode);
}

function setKings() {
  const rows = document.querySelector(".board").children;

  const img1 = document.createElement("img");
  img1.setAttribute("id", "king-w");
  img1.setAttribute("onclick", "kingStep(this)");
  img1.classList.add("king");
  img1.src = "./images/king-w.png";
  rows[60].appendChild(img1);

  const img2 = document.createElement("img");
  img2.setAttribute("id", "king-b");
  img2.setAttribute("onclick", "kingStep(this)");
  img2.classList.add("king");
  img2.src = "./images/king-b.png";
  rows[4].appendChild(img2);
}

function setQueens() {
  const rows = document.querySelector(".board").children;

  const img1 = document.createElement("img");
  img1.setAttribute("id", "queen-w");
  img1.setAttribute("onclick", "queenStep(this)");
  img1.src = "./images/queen-w.png";
  rows[59].appendChild(img1);

  const img2 = document.createElement("img");
  img2.setAttribute("id", "queen-b");
  img2.setAttribute("onclick", "queenStep(this)");
  img2.src = "./images/queen-b.png";
  rows[3].appendChild(img2);
}

function setWhiteBishops() {
  const rows = document.querySelector(".board").children;

  const img1 = document.createElement("img");
  img1.setAttribute("id", "bishop-w");
  img1.setAttribute("onclick", "bishopStep(this)");
  img1.src = "./images/bishop-w.png";
  rows[61].appendChild(img1);

  const img2 = document.createElement("img");
  img2.setAttribute("id", "bishop-w");
  img2.setAttribute("onclick", "bishopStep(this)");
  img2.src = "./images/bishop-w.png";
  rows[58].appendChild(img2);
}

function setBlackBishops() {
  const rows = document.querySelector(".board").children;

  const img1 = document.createElement("img");
  img1.setAttribute("id", "bishop-b");
  img1.setAttribute("onclick", "bishopStep(this)");
  img1.src = "./images/bishop-b.png";
  rows[2].appendChild(img1);

  const img2 = document.createElement("img");
  img2.setAttribute("id", "bishop-b");
  img2.setAttribute("onclick", "bishopStep(this)");
  img2.src = "./images/bishop-b.png";
  rows[5].appendChild(img2);
}

function setWhiteKnights() {
  const rows = document.querySelector(".board").children;

  const img1 = document.createElement("img");
  img1.setAttribute("id", "knight-w");
  img1.setAttribute("onclick", "knightStep(this)");
  img1.src = "./images/knight-w.png";
  rows[62].appendChild(img1);

  const img2 = document.createElement("img");
  img2.setAttribute("id", "knight-w");
  img2.setAttribute("onclick", "knightStep(this)");
  img2.src = "./images/knight-w.png";
  rows[57].appendChild(img2);
}

function setBlackKnights() {
  const rows = document.querySelector(".board").children;

  const img1 = document.createElement("img");
  img1.setAttribute("id", "knight-b");
  img1.setAttribute("onclick", "knightStep(this)");
  img1.src = "./images/knight-b.png";
  rows[1].appendChild(img1);

  const img2 = document.createElement("img");
  img2.setAttribute("id", "knight-b");
  img2.setAttribute("onclick", "knightStep(this)");
  img2.src = "./images/knight-b.png";
  rows[6].appendChild(img2);
}

function setBlackRooks() {
  const rows = document.querySelector(".board").children;

  const img1 = document.createElement("img");
  img1.setAttribute("id", "rook-b");
  img1.setAttribute("onclick", "rookStep(this)");
  img1.src = "./images/rook-b.png";
  rows[0].appendChild(img1);

  const img2 = document.createElement("img");
  img2.setAttribute("id", "rook-b");
  img2.setAttribute("onclick", "rookStep(this)");
  img2.src = "./images/rook-b.png";
  rows[7].appendChild(img2);
}

function setWhiteRooks() {
  const rows = document.querySelector(".board").children;

  const img1 = document.createElement("img");
  img1.setAttribute("id", "rook-w");
  img1.setAttribute("onclick", "rookStep(this)");
  img1.src = "./images/rook-w.png";
  rows[63].appendChild(img1);

  const img2 = document.createElement("img");
  img2.setAttribute("id", "rook-w");
  img2.setAttribute("onclick", "rookStep(this)");
  img2.src = "./images/rook-w.png";
  rows[56].appendChild(img2);
}

function setBlackPawns() {
  const rows = document.querySelector(".board").children;
  for (let i = 8; i < 16; i++) {
    const figure = document.createElement("img");
    figure.setAttribute("id", "pawn-b");
    figure.setAttribute("onclick", "blackPawnStep(this)");
    figure.src = "./images/pawn-b.png";
    rows[i].appendChild(figure);
  }
}

function setWhitePawns() {
  const rows = document.querySelector(".board").children;
  for (let i = 55; i >= 48; i--) {
    const figure = document.createElement("img");
    figure.setAttribute("id", "pawn-w");
    figure.setAttribute("onclick", "whitePawnStep(this)");
    figure.src = "./images/pawn-w.png";
    rows[i].appendChild(figure);
  }
}

