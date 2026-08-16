
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
    const sides = parseInt(evt.currentTarget.innerHTML.trim().substring(1));
    const dieButton = document.createElement("button");
    const dieNumText = document.createTextNode("d" + sides);
    dieButton.appendChild(dieNumText);
    dieButton.addEventListener(
        "click",
        function () {
            dieButton.remove()
            calculate(sides);
        },
        false
    );
    diceDisplay.appendChild(dieButton);
    calculate(sides);
}


const maxSides = 12;
// Assumes diceList has at least 2 elements
function findTopTwoDistribution(diceList) {

    // This syntax creates a 13×13 2-dimensional array
    let outcomeCounts = Array.from({ length: maxSides + 1 }, () => Array(maxSides + 1).fill(0));
    outcomeCounts[0][0] = 1

    for (const die of diceList) {
        const newOutcomeCounts = Array.from({ length: maxSides + 1 }, () => Array(maxSides + 1).fill(0));
        for (let i = 0; i < outcomeCounts.length; i++) {
            for (let j = 0; j <= i; j++) {
                for (let side = 1; side <= die; side++) {
                    if (side >= i) {
                        newOutcomeCounts[side][i] += outcomeCounts[i][j];
                    } else if (side >= j) {
                        newOutcomeCounts[i][side] += outcomeCounts[i][j];
                    } else {
                        newOutcomeCounts[i][j] += outcomeCounts[i][j];
                    }
                }
            }
        }
        outcomeCounts = newOutcomeCounts;
    }

    const sumDistribution = Array(maxSides * 2 + 1).fill(0);
    for (let i = 0; i < outcomeCounts.length; i++) {
        for (let j = 0; j <= i; j++) {
            sumDistribution[i + j] += outcomeCounts[i][j];
        }
    }

    return sumDistribution;
}


const dfSides = 4;
function findDfDistribution(diceList) {
    let outcomeCounts = Array(dfSides + 1).fill(0);
    outcomeCounts[0] = 1;

    for (const die of diceList) {
        const newOutcomeCounts = Array(dfSides + 1).fill(0);
        for (let i = 0; i < outcomeCounts.length; i++) {
            for (let side = 1; side <= die; side++) {
                newOutcomeCounts[Math.max(i, side)] += outcomeCounts[i]
            }
        }
        outcomeCounts = newOutcomeCounts;
        console.log(outcomeCounts);
    }

    return outcomeCounts;
}


const mainOptions = [6, 8, 10, 12]
const dfOptions = [4]
const allDice = mainOptions.concat(dfOptions)
let mainPoolOutcomes = [1];
let dfOutcomes = [1];
let fullOutcomes = [1];
let target = 0;
function calculate(changedDie) {
    if (allDice.includes(changedDie)) {
        const mainDice = [];
        const d4s = [];
        const diceSelected = diceDisplay.children;
        for (let i = 0; i < diceSelected.length; i++) {
            const dieSides = parseInt(diceSelected[i].innerHTML.substring(1));
            if (dieSides == 4) {
                d4s.push(dieSides);
            } else {
                mainDice.push(dieSides);
            }
        }
        console.log(mainDice);
        console.log(d4s);

        if (changedDie == 4) {
            dfOutcomes = findDfDistribution(d4s);
        } else {
            mainPoolOutcomes = findTopTwoDistribution(mainDice);
        }

        fullOutcomes = Array(mainPoolOutcomes.length + dfOutcomes.length - 1).fill(0);
        for (let i = 0; i < mainPoolOutcomes.length; i++) {
            for (let j = 0; j < dfOutcomes.length; j++) {
                fullOutcomes[i + j] += mainPoolOutcomes[i] * dfOutcomes[j];
            }
        }
    }

    const totalPossibilities = fullOutcomes.reduce((sum, currentValue) => sum + currentValue, 0);

    let newTarget = parseInt(targetText.value);
    if (Number.isInteger(newTarget)){
        target = newTarget;
    }
    const winningPossibilities = fullOutcomes.slice(target).reduce((sum, currentValue) => sum + currentValue, 0);

    const successPercentage = (100 * winningPossibilities / totalPossibilities).toFixed(2);
    const outcomePercents = Array.from(fullOutcomes, (element) => 100 * element / totalPossibilities);
    console.log(winningPossibilities);
    console.log(totalPossibilities);
    console.log(outcomePercents);
    resultDisplay.innerHTML = "Chance of success: " + successPercentage + "%";
    createGraph(outcomePercents, target);
}


function createGraph(outcomePercents, target) {
    let leftCol = '<svg width="1.5em">';
    let graphRects = '<svg x="1.5em">';
    for (let i = 2; i < outcomePercents.length; i++) {
        if (outcomePercents[i] == 0) {
            continue;
        }
        const y = (i - 2) * 2;
        let coloring;
        if (i < target) {
            coloring = "stroke: #CD5C5C; fill: #F08080";
        } else {
            coloring = "stroke: #3CB371; fill: #98FB98";
        }

        leftCol += "<text x=0 y=" + (y + 1.25) + "em>" + i + "</text>";

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


// TO DO
// Make buttons look fancier