const addPlayerButton = document.querySelector("#add-player-button")
const addMatchButton = document.querySelector("#add-match-button")
const matchList = document.querySelector("#matches")
const emptyList = document.querySelector("#emptyList")
const tablica = document.querySelector("#tablica")
let input = document.querySelector("#nameInput")
let players = [];
let playerCount = 0;

function addPlayer() {
    playerCount++;
    let player = {
        id: `player${playerCount}`,
        name: input.value.trim().toUpperCase(),
        matchesPlayed: 0,
        matchesWon: 0,
    }

    if (player.name.trim() === ""){
        alert("Please add a player");
        return;
    }
    if (players.some(p => p.name === player.name)) { 
        alert("This player is already on the list");
        return;
    }
    if (players.length >= 6){
        alert("You can add up to 6 players per Match");
        return;
    }
    players.push(player)
    input.value = "";
    displayPlayers();
}

function displayPlayers() {
    let list = document.getElementById("playerList");
    list.innerHTML = "";

    players.forEach((player, index) => {
        let li = document.createElement("li");

        let radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "winner";
        radio.id = `player-${index}`;
        radio.value = player.id;
        radio.required = true;

        let label = document.createElement("label");
        label.htmlFor = `player-${index}`;
        label.textContent = "win";

        li.textContent = player.name;
        let removeButton = document.createElement("button");
        removeButton.textContent = "x";
        removeButton.classList.add("remove-btn");
        removeButton.onclick = function() {
            removePlayer(index);
        };
        list.appendChild(removeButton);
        list.appendChild(li);
        li.appendChild(label);
        li.appendChild(radio);
    });
}

function removePlayer(index) {
    players.splice(index, 1);
    displayPlayers();
}

addPlayerButton.addEventListener("click", addPlayer)
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter"){
        addPlayer()
    }
})

addMatchButton.addEventListener("click", function(){

    const winnerRadio = document.querySelector(`input[name="winner"]:checked`)
    if (!winnerRadio){
        alert("Please select a winner!");
        return;
    }
    const winner = winnerRadio.value;

    players.forEach ((player) => { 
        const playerId = `player-${player.id}`
        let playerRow = document.querySelector(`#${player.id}`)
        if (!playerRow){
            let tableRow = document.createElement("tr");

            let tableHeader = document.createElement("th");
            tableHeader.id = playerId;
            tableHeader.innerText = player.name;

            let playedCell = document.createElement("td");
            playedCell.id = `${playerId}-played`;
            playedCell.innerText = 1;

            let wonCell = document.createElement("td");
            wonCell.id = `${playerId}-won`;
            if (player.id === winner){
                wonCell.innerText = 1;
            } else {
                wonCell.innerText = 0;
            }

            let percentCell = document.createElement("td");
            percentCell.id = `${playerId}-percent`;
            if (player.id === winner){
                percentCell.innerText = "100%"
            } else {
                percentCell.innerText = "0%"
            }

            tableRow.append(tableHeader, playedCell, wonCell, percentCell);
            tablica.append(tableRow);
        } else {
            let playedCell = document.querySelector(`#${playerId}-played`)
            let wonCell = document.querySelector(`#${playerId}-won`)
            let percentCell = document.querySelector(`#${playerId}-percent`)

            const played = parseInt(playedCell.innerText) + 1;
            playedCell.innerText = played;
            
            if (player.id === winner){
                const won = parseInt(wonCell.innerText) + 1;
                wonCell.innerText = won;
            }
            const winPercentage = ((parseInt(wonCell.innerText) / played) * 100).toFixed(2);
            percentCell.innerText = `${winPercentage}%`;
        }
    })

    let matchLi = document.createElement("li");
    matchLi.innerText = players.map(p => p.name).join(", ")
    let removeListBtn = document.createElement("button");
    removeListBtn.classList.add("remove-match-btn")
    removeListBtn.textContent = "Remove match";
    removeListBtn.onclick = function () {
        matchLi.remove();
        if (matchList.children.length === 0){
            emptyList.classList.remove("noDisplay")
        }
    };
    matchLi.appendChild(removeListBtn);
    emptyList.classList.add("noDisplay");
    matchList.appendChild(matchLi);
    matchList.classList.remove("noDisplay");    

    players = [];
    displayPlayers();
    document.querySelectorAll('input[name="winner"]').forEach(radio => {
        radio.checked = false;
    });
})