const targetText = document.querySelector("#target");
const d4Button = document.querySelector("#d4-button");
const d6Button = document.querySelector("#d6-button");
const d8Button = document.querySelector("#d8-button");
const d10Button = document.querySelector("#d10-button");
const d12Button = document.querySelector("#d12-button");

const diceDisplay = document.querySelector("#dice-selections");

//const calculateButton = document.querySelector("#calculate");

const result = document.querySelector("#result");

var diceList = [];

function removeDie(butRef) {
  butRef.remove();
}

function addDie(sides) {
  var dieButton = document.createElement("button");
  var dieNumText = document.createTextNode("d" + sides);
  dieButton.appendChild(dieNumText);
  dieButton.addEventListener(
    "click",
    function() {
      removeDie(dieButton);
      calculate();
    },
    false
  );
  diceDisplay.appendChild(dieButton);
  calculate();
}

function calculate() {
  var target = targetText.value;
  console.log("Target: " + target);
  if (isNaN(target)) {
    result.innerHTML = "Target is not a valid number.";
    return;
  }

  var mainDice = [];
  var d4s = [];

  var diceSelected = diceDisplay.children;
  for (let i = 0; i < diceSelected.length; i++) {
    let dieSides = diceSelected[i].innerHTML.substring(1);
    if (dieSides == 4) {
      d4s.push(dieSides);
    } else {
      mainDice.push(dieSides);
    }
  }
  console.log(mainDice);
  console.log(d4s);
  if (mainDice.length < 2) {
    result.innerHTML =
      "A roll always has at least 2 dice with 6 sides or more.";
    return;
  }

  //console.log("starting rolling main dice");
  var mainDiceSets = rollDice(mainDice);
  //console.log(mainDiceSets);
  //console.log("finished rolling main dice");
  var d4Sets = rollDice(d4s);

  var fullSums = [];
  var mainDiceTopSums = [];

  for (let mds = 0; mds < mainDiceSets.length; mds++) {
    let biggest = 0;
    let secondBiggest = 0;
    let currentSet = mainDiceSets[mds];
    for (let r = 0; r < currentSet.length; r++) {
      if (currentSet[r] > biggest) {
        secondBiggest = biggest;
        biggest = currentSet[r];
      } else if (currentSet[r] > secondBiggest) {
        secondBiggest = currentSet[r];
      }
    }

    mainDiceTopSums.push(biggest + secondBiggest);
  }


  if (d4Sets.length > 0) {
    let d4SetTops = [];
    for (let d4s = 0; d4s < d4Sets.length; d4s++) {
      let biggest = 0;
      let currentSet = d4Sets[d4s];

      for (let r = 0; r < currentSet.length; r++) {
        if (currentSet[r] > biggest) {
          biggest = currentSet[r];
        }
      }
      d4SetTops.push(biggest);
    }

    for (let i = 0; i < mainDiceTopSums.length; i++) {
      for (let j = 0; j < d4SetTops.length; j++) {
        fullSums.push(mainDiceTopSums[i] + d4SetTops[j]);
      }
    }
  } else {
    fullSums = mainDiceTopSums;
  }

  var successCount = 0;
  for (let i = 0; i < fullSums.length; i++) {
    if (fullSums[i] >= target) {
      successCount++;
    }
  }
  var successPercentage = ((100 * successCount) / fullSums.length).toFixed(2);
  result.innerHTML = "Chance of success: " + successPercentage + "%";
}

//calculateButton.addEventListener("click", calculate, false);

function rollDice(dice) {
  var rollSets = [];

  //adds each value of a face of the first die, contained in a single-item list, to rollSets
  if (dice.length > 0) {
    for (let r = 1; r <= dice[0]; r++) {
      rollSets.push([r]);
    }
  }
  //console.log(rollSets);

  if (dice.length > 1) {
    //console.log("adding additional dice; " + dice.length + " total dice");
    // for each die in the list of dice, after the first die
    for (let d = 1; d < dice.length; d++) {
      let newRollSets = [];

      for (let r = 1; r <= dice[d]; r++) {
        //console.log("current face value: " + r);
        //console.log("total roll sets right now: " + rollSets.length);
        for (let rs = 0; rs < rollSets.length; rs++) {
          let rollList = rollSets[rs].slice();
          //console.log("current roll list:" + rollList);
          rollList.push(r);
          //console.log("current roll list now:" + rollList);
          newRollSets.push(rollList);
        }
      }

      rollSets = newRollSets;
      //console.log(rollSets);
    }
  }

  return rollSets;
}

d4Button.addEventListener(
  "click",
  function() {
    addDie(4);
  },
  false
);
d6Button.addEventListener(
  "click",
  function() {
    addDie(6);
  },
  false
);
d8Button.addEventListener(
  "click",
  function() {
    addDie(8);
  },
  false
);
d10Button.addEventListener(
  "click",
  function() {
    addDie(10);
  },
  false
);
d12Button.addEventListener(
  "click",
  function() {
    addDie(12);
  },
  false
);

targetText.addEventListener("keyup", calculate, false);