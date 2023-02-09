let view = {
	displayMessage: function(msg) {
		let messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],
    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];    
            let location = ship.location; 
            let index = ship.locations.indexOf(guess);

            if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
                
                if (this.isSunk(ship)) {
                    view.displayMessage("Вы потопили корабль!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Промах!")
        return false;
    },
    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false
            }       
        }
        return true;
    },
    generateShipLocations: function() {
        let locations;
        for(let i = 0; i <this.numShips; i++) {
            do {
                locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for(let i = 0; i < this.shipLength; i++) {
            if(direction === 1){
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }           
        }
        return newShipLocations;
    },
    collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
};

let controller = {
    guesses: 0,

    processGuess: function(guess) {
        let location = parseGuess(guess);
        
        if(location) {
        this.guesses++;
        let hit = model.fire(location);

            if(hit && model.shipsSunk === model.numShips) {
                view.displayMessage("Вы потопили все коробли за " + this.guesses + " выстрелов!");
            }
        }
    }
};

function parseGuess(guess) {
    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if(guess === null || guess.length !== 2) {
        alert("Введите верную координату");
    } else {
        firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if(isNaN(row) || isNaN(column)) {
            alert("Ошибка");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column <= model.boardSize) {
            alert("Ошибка");
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    model.generateShipLocations();
};

function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
};

window.onload = init;