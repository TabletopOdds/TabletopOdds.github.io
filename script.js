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
        result.innerHTML = "A roll always has at least 2 dice with 6 sides or more.";
        return;
    }

    var totalSums = [];
    var mainDiceSums = mainDiceOutcomes(mainDice);
    if (d4s.length > 0) {
        //console.log(d4s);
        var divineFavorDiceSums = divineFavorDiceOutcomes(d4s);
        for (var i = 0; i < mainDiceSums.length + divineFavorDiceSums.length; i++) {
            totalSums.push(0);
        }

        for (var i = 1; i <= mainDiceSums.length; i++) {
            for (var j = 1; j <= divineFavorDiceSums.length; j++) {
                totalSums[i + j - 1] += mainDiceSums[i - 1] * divineFavorDiceSums[j - 1];
            }
        }
    } else {
        totalSums = mainDiceSums;
    }

    var totalPossibilities = 0;
    var winningPossibilities = 0;
    for (var i = 1; i <= totalSums.length; i++) {
        totalPossibilities += totalSums[i - 1];
        if (i >= target) {
            winningPossibilities += totalSums[i - 1];
        }
    }
    console.log(winningPossibilities);
    console.log(totalPossibilities);
    var successPercentage = ((100 * winningPossibilities) / totalPossibilities).toFixed(2);
    result.innerHTML = "Chance of success: " + successPercentage + "%";
}

function mainDiceOutcomes(diceList) {
    //var maxSides = Math.max(diceList[0], diceList[1]);
    var maxSides = 12;
    var outcomeDistribution = [];
    for (var i = 0; i < maxSides; i++) {
        var row = [];
        for (var j = 0; j < maxSides; j++) {
            row.push(0);
        }
        outcomeDistribution.push(row);
    }

    for (var i = 1; i <= diceList[0]; i++) {
        for (var j = 1; j <= diceList[1]; j++) {
            var biggerSide = Math.max(i, j);
            var smallerSide = Math.min(i, j);
            outcomeDistribution[biggerSide - 1][smallerSide - 1]++;
        }
    }

    for (var d = 2; d < diceList.length; d++) {
        var newOutcomeDistribution = [];
        for (var i = 0; i < maxSides; i++) {
            var row = [];
            for (var j = 0; j < maxSides; j++) {
                row.push(0);
            }
            newOutcomeDistribution.push(row);
        }

        for (var i = 1; i <= maxSides; i++) {
            for (var j = 1; j <= maxSides; j++) {
                for (var s = 1; s <= diceList[d]; s++) {
                    var biggestSide = Math.max(i, s);
                    var secondBiggest = Math.max(Math.min(i, s), j);
                    newOutcomeDistribution[biggestSide - 1][secondBiggest - 1] += outcomeDistribution[i - 1][j - 1];
                }
            }
        }
        outcomeDistribution = newOutcomeDistribution;
    }

    //console.log(outcomeDistribution);

    var sumDistribution = [];
    for (var i = 0; i < maxSides * 2; i++) {
        sumDistribution.push(0);
    }
    for (var i = 1; i <= maxSides; i++) {
        for (var j = 1; j <= maxSides; j++) {
            sumDistribution[i + j - 1] += outcomeDistribution[i - 1][j - 1];
        }
    }
    //console.log(sumDistribution);
    return sumDistribution;
}

function divineFavorDiceOutcomes(diceList) {
    var maxSides = 4;
    var outcomeDistribution = [];
    for (var i = 0; i < maxSides; i++) {
        outcomeDistribution.push(0);
    }

    for (var i = 1; i <= diceList[0]; i++) {
        outcomeDistribution[i - 1]++;
    }

    for (var d = 1; d < diceList.length; d++) {
        var newOutcomeDistribution = [];
        for (var i = 0; i < maxSides; i++) {
            newOutcomeDistribution.push(0);
        }

        for (var i = 1; i <= outcomeDistribution.length; i++) {
            for (var s = 1; s <= diceList[d]; s++) {
                var biggestSize = Math.max(i, s);
                newOutcomeDistribution[biggestSize - 1] += outcomeDistribution[i - 1];
            }
        }
        outcomeDistribution = newOutcomeDistribution;
    }
    return outcomeDistribution;
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
