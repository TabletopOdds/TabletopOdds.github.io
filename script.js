
const targetText = document.querySelector("#target");

const diceDisplay = document.querySelector("#dice-selections");
const resultDisplay = document.querySelector("#result");

const barGraphSVG = document.querySelector("#bar-graph");



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


function findTopOneDistribution(diceList) {
    let outcomeCounts = Array(maxSides + 1).fill(0);
    outcomeCounts[0] = 1;

    for (const die of diceList) {
        const newOutcomeCounts = Array(maxSides + 1).fill(0);
        for (let i = 0; i < outcomeCounts.length; i++) {
            for (let side = 1; side <= die; side++) {
                newOutcomeCounts[Math.max(i, side)] += outcomeCounts[i]
            }
        }
        outcomeCounts = newOutcomeCounts;
    }

    return outcomeCounts;
}


let fullOutcomes = [1];
let totalPossibilities = 1;
function updateDiceOutcomes() {

    const mode = document.querySelector('input[name="mode"]:checked').value;
    const allDice = Array.from(diceDisplay.children).map((x) => parseInt(x.innerHTML.substring(1)));
    if (mode == "top2") {
        mainPoolOutcomes = findTopTwoDistribution(allDice.filter((x) => x != 4));
        dfOutcomes = findTopOneDistribution(allDice.filter((x) => x == 4));
        fullOutcomes = Array(mainPoolOutcomes.length + dfOutcomes.length - 1).fill(0);
        for (let i = 0; i < mainPoolOutcomes.length; i++) {
            for (let j = 0; j < dfOutcomes.length; j++) {
                fullOutcomes[i + j] += mainPoolOutcomes[i] * dfOutcomes[j];
            }
        }

    } else if (mode == "top1") {
        fullOutcomes = findTopOneDistribution(allDice);
    }

    totalPossibilities = fullOutcomes.reduce((sum, currentValue) => sum + currentValue);
    updateDisplay();
}


let target = 0;
function updateDisplay() {
    let newTarget = parseInt(targetText.value);
    if (Number.isInteger(newTarget)) {
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
    for (let i = 1; i < outcomePercents.length; i++) {
        if (outcomePercents[i] == 0) {
            continue;
        }
        const y = (i - 1) * 2;
        let coloring;
        if (i < target) {
            coloring = "stroke: #CD5C5C; fill: #F08080;";
        } else {
            coloring = "stroke: #3CB371; fill: #98FB98;";
        }

        leftCol += "<text x=0 y=" + (y + 1.25) + "em>" + i + "</text>";

        graphRects += '<rect x=0 y="' + y + 'em" height="1.5em" width="' + outcomePercents[i] + '%" style="' + coloring + '" />';

        let orGreaterPercent = outcomePercents.slice(i).reduce((sum, currentValue) => sum + currentValue);
        graphRects += "<text x=" + (outcomePercents[i] + 1) + "% y=" + (y + 1.25) + "em>" + outcomePercents[i].toFixed(2) + '% <tspan style="font-style: italic;">(' + orGreaterPercent.toFixed(1) + "%)</tspan></text>";
    }
    leftCol += "</svg>"
    graphRects += "</svg>"
    barGraphSVG.innerHTML = leftCol + graphRects;
}


document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", updateDiceOutcomes);
});

targetText.addEventListener("keyup", updateDisplay);

document.querySelectorAll(".dice-selector").forEach(button => {
    button.addEventListener("click", (evt) => {
        const sides = evt.currentTarget.innerHTML.trim().substring(1);
        const dieButton = document.createElement("button");
        const dieNumText = document.createTextNode("d" + sides);
        dieButton.appendChild(dieNumText);
        dieButton.addEventListener("click", (evt) => {
            dieButton.remove();
            updateDiceOutcomes();
        });
        diceDisplay.appendChild(dieButton);
        updateDiceOutcomes();
    });
});


// TO DO
// Add percentage totals to bar graph
// Make buttons look fancier
