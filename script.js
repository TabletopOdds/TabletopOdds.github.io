
const targetText = document.querySelector("#target");
const d4Button = document.querySelector("#d4-button");
const d6Button = document.querySelector("#d6-button");
const d8Button = document.querySelector("#d8-button");
const d10Button = document.querySelector("#d10-button");
const d12Button = document.querySelector("#d12-button");

const diceDisplay = document.querySelector("#dice-selections");
const resultDisplay = document.querySelector("#result");
const diceList = [];

const barGraphSVG = document.querySelector("#bar-graph");


function addDie(evt) {
    const sides = evt.currentTarget.innerHTML.trim().substring(1);
    const dieButton = document.createElement("button");
    const dieNumText = document.createTextNode("d" + sides);
    dieButton.appendChild(dieNumText);
    dieButton.addEventListener(
        "click",
        function() {
            dieButton.remove()
            calculate();
        },
        false
    );
    diceDisplay.appendChild(dieButton);
    calculate();
}


const maxSides = 12;
// Assumes diceList has at least 2 elements
function mainDiceOutcomes(diceList) {

    // This syntax creates a 12×12 2-dimensional array
    let outcomeCounts = Array.from({length: maxSides}, () => Array(maxSides).fill(0));

    // Handles first two dice in list
    for (let i = 1; i <= diceList[0]; i++) {
        for (let j = 1; j <= diceList[1]; j++) {
            const results = [i, j]
            results.sort()
            outcomeCounts[results[1] - 1][results[0] - 1]++;
        }
    }

    // Handles subsequent dice
    for (let d = 2; d < diceList.length; d++) {
        const newOutcomeCounts = Array.from({length: maxSides}, () => Array(maxSides).fill(0));
        for (let i = 1; i <= maxSides; i++) {
            for (let j = 1; j <= maxSides; j++) {
                for (let s = 1; s <= diceList[d]; s++) {
                    const results = [i, j, s]
                    results.sort()
                    newOutcomeCounts[results[2] - 1][results[1] - 1] += outcomeCounts[i - 1][j - 1];
                }
            }
        }
        outcomeCounts = newOutcomeCounts;
    }

    const sumDistribution = Array(maxSides * 2).fill(0);
    for (let i = 1; i <= maxSides; i++) {
        for (let j = 1; j <= maxSides; j++) {
            sumDistribution[i + j - 1] += outcomeCounts[i - 1][j - 1];
        }
    }

    return sumDistribution;
}


const dfSides = 4;
function divineFavorDiceOutcomes(diceList) {
    let outcomeCounts = Array(dfSides).fill(1);

    for (let d = 1; d < diceList.length; d++) {
        const newOutcomeCounts = Array(dfSides).fill(0);

        for (let i = 1; i <= outcomeCounts.length; i++) {
            for (let s = 1; s <= diceList[d]; s++) {
                newOutcomeCounts[Math.max(i, s) - 1] += outcomeCounts[i - 1];
            }
        }
        outcomeCounts = newOutcomeCounts;
    }
    return outcomeCounts;
}


function calculate() {
    const target = targetText.value;
    if (isNaN(target)) {
        resultDisplay.innerHTML = "Target is not a valid number.";
        return;
    }

    const mainDice = [];
    const d4s = [];
    const diceSelected = diceDisplay.children;
    for (let i = 0; i < diceSelected.length; i++) {
        const dieSides = diceSelected[i].innerHTML.substring(1);
        if (dieSides == 4) {
            d4s.push(dieSides);
        } else {
            mainDice.push(dieSides);
        }
    }
    console.log(mainDice);
    console.log(d4s);
    if (mainDice.length < 2) {
        resultDisplay.innerHTML = "Select at least 2 dice with 6 sides or more.";
        barGraphSVG.innerHTML = "";
        return;
    }

    let fullSums;
    const mainDiceSums = mainDiceOutcomes(mainDice);
    if (d4s.length > 0) {
        const divineFavorDiceSums = divineFavorDiceOutcomes(d4s);
        fullSums = Array(mainDiceSums.length + divineFavorDiceSums.length).fill(0);

        for (let i = 1; i <= mainDiceSums.length; i++) {
            for (let j = 1; j <= divineFavorDiceSums.length; j++) {
                fullSums[i + j - 1] += mainDiceSums[i - 1] * divineFavorDiceSums[j - 1];
            }
        }
    
    } else {
        fullSums = mainDiceSums;
    }

    let totalPossibilities = 0;
    let winningPossibilities = 0;
    for (let i = 1; i <= fullSums.length; i++) {
        totalPossibilities += fullSums[i - 1];
        if (i >= target) {
            winningPossibilities += fullSums[i - 1];
        }
    }
    
    const successPercentage = (100 * winningPossibilities / totalPossibilities).toFixed(2);
    const outcomePercents = Array.from(fullSums, (element) => 100 * element / totalPossibilities);
    console.log(winningPossibilities);
    console.log(totalPossibilities);
    console.log(outcomePercents);
    resultDisplay.innerHTML = "Chance of success: " + successPercentage + "%";
    createGraph(outcomePercents, target);
}


function createGraph(outcomePercents, target) {
    let leftCol = '<svg width="1.5em">';
    let graphRects = '<svg x="1.5em">';
    for (let i = 0; i < outcomePercents.length; i++) {
        if (outcomePercents[i] == 0) {
            continue;
        }
        const y = i * 2;
        let coloring;
        if (i + 1 < target) {
            coloring = "stroke:#CD5C5C; fill: #F08080";
        } else {
            coloring = "stroke:#3CB371; fill: #98FB98";
        }
      
        leftCol += "<text x=0 y=" + (y + 1.25) + "em>" + (i + 1) + "</text>";

        graphRects += '<rect x=0 y="' + y + 'em" height="1.5em" width="' + outcomePercents[i] + '%" style="' + coloring + '" />';

        graphRects += "<text x=" + (outcomePercents[i] + 1) + "% y=" + (y + 1.25) + "em>" + outcomePercents[i].toFixed(2) + "%</text>";
    }
    leftCol += "</svg>"
    graphRects += "</svg>"
    barGraphSVG.innerHTML = leftCol + graphRects;
}


targetText.addEventListener("keyup", calculate);
d4Button.addEventListener("click", addDie);
d6Button.addEventListener("click", addDie);
d8Button.addEventListener("click", addDie);
d10Button.addEventListener("click", addDie);
d12Button.addEventListener("click", addDie);
