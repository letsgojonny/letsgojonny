(function () {
	var puzzle = document.getElementById('puzzle');

	solve();

	function solve() {
		puzzle.innerHTML = '';
		var n = 1;
		for (var i = 0; i <= 3; i++) {
			for (var j = 0; j <= 3; j++) {
				var box = document.createElement('div');
				box.id = 'box-' + i + '-' + j;
				box.style.top = (i * 9 + 1 * i + 1) + 'rem';
				box.style.left = (j * 9 + 1 * j + 1) + 'rem';

				if (n <= 15) {
					box.classList.add('number');
					box.classList.add((i % 2 == 0 && j % 2 > 0 || i % 2 > 0 && j % 2 == 0) ? 'dark' : 'light');
					box.innerHTML = (n++).toString();
				} else {
					box.className = 'empty';
				}
				puzzle.appendChild(box);
			}
		}
	}

		// Listens for click on puzzle boxs
	puzzle.addEventListener('click', function (e) {
		// Enables sliding animation
		puzzle.className = 'animate';
		shiftbox(e.target);
	});

	// Listens for click on control buttons
	document.getElementById('scramble').addEventListener('click', scramble);

	// Shifts number box to the empty box

	function shiftbox(box) {
		// Checks if selected box has number
		if (box.className != 'empty') {

			// Tries to get empty adjacent box
			var emptybox = getEmptyAdjacentbox(box);

			if (emptybox) {
				// Temporary data
				var tmp = { style: box.style.cssText, id: box.id };

				// Exchanges id and style values
				box.style.cssText = emptybox.style.cssText;
				box.id = emptybox.id;
				emptybox.style.cssText = tmp.style;
				emptybox.id = tmp.id;

				// Checks the order of numbers
				setTimeout(checkOrder, 150);
			}
		}

	}
	// Gets specific box by row and column
	function getbox(row, col) {
		return document.getElementById('box-' + row + '-' + col);
	}

	// Gets empty box

	function getEmptybox() {
		return puzzle.querySelector('.empty');
	}

	// Gets empty adjacent box if it exists
	function getEmptyAdjacentbox(box) {

		// Gets all adjacent boxs
		var adjacent = getAdjacentboxs(box);

		// Searches for empty box
		for (var i = 0; i < adjacent.length; i++) {
			if (adjacent[i].className == 'empty') {
				return adjacent[i];
			}
		}

		// Empty adjacent box was not found
		return false;
	}


	// Gets all adjacent boxs

	function getAdjacentboxs(box) {

		var id = box.id.split('-');

		// Gets box position indexes
		var row = parseInt(id[1]);
		var col = parseInt(id[2]);

		var adjacent = [];

		// Gets all possible adjacent boxs
		if (row < 3) { adjacent.push(getbox(row + 1, col)); }
		if (row > 0) { adjacent.push(getbox(row - 1, col)); }
		if (col < 3) { adjacent.push(getbox(row, col + 1)); }
		if (col > 0) { adjacent.push(getbox(row, col - 1)); }

		return adjacent;
	}

	// Checks if the order of numbers is correct

	function checkOrder() {

		// Checks if the empty box is in correct position
		if (getbox(3, 3).className != 'empty') {
			return;
		}

		var n = 1;
		// Goes through all boxs and checks numbers
		for (var i = 0; i <= 3; i++) {
			for (var j = 0; j <= 3; j++) {
				if (n <= 15 && getbox(i, j).innerHTML != n.toString()) {
					// Order is not correct
					return;
				}
				n++;
			}
		}

		// Puzzle is solved, offers to scramble it
		if (confirm('Congrats, You did it! \nScramble the puzzle?')) {
			scramble();
		}
	}

	// Scrambles puzzle
	function scramble() {
		puzzle.removeAttribute('class');

		var previousbox;
		var i = 1;
		var interval = setInterval(function () {
			if (i <= 100) {
				var adjacent = getAdjacentboxs(getEmptybox());
				if (previousbox) {
					for (var j = adjacent.length - 1; j >= 0; j--) {
						if (adjacent[j].innerHTML == previousbox.innerHTML) {
							adjacent.splice(j, 1);
						}
					}
				}
				// Gets random adjacent box and memorizes it for the next iteration
				previousbox = adjacent[rand(0, adjacent.length - 1)];
				shiftbox(previousbox);
				i++;
			} else {
				clearInterval(interval);
			}
		}, 5);
	}
	
	// Generates random number
	function rand(from, to) {
		return Math.floor(Math.random() * (to - from + 1)) + from;
	}

	reset = solve.bind();
	reset(); 
	
	document.getElementById('reset').addEventListener('click', reset);
	
}());