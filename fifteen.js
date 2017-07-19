(function(){
	"use strict";

	var tableSize = 4;
	var emptyRow = tableSize -1;
	var emptyCol = tableSize -1;
	var cellSize = parseInt(400 / tableSize);
	var start = 0;
	var moveCount = 0; 



	window.addEventListener("load", startTimer, false);

	window.onload = function() {

		var shuffleBtn = document.getElementById("shufflebutton");
		shuffleBtn.onclick = shuffle;


		var size = document.getElementById("size");
		size.onchange = changeSize;

		makecells();
		enableImageChange();



	};


	function startTimer(){
		var timer = setInterval(updateTime, 1000);		
		
	}

	function updateTime(){
		start++;
		document.getElementById("time").innerHTML = "Time spent:" + start + "sec";
	}
	

	function changeSize() {
		tableSize = this.value;
		cellSize = parseInt(400 / tableSize);
		makecells();		
	}

	function checkWin() {
		var cells = document.querySelectorAll(".cell");
		for(var i = 0; i < cells.length; i++) {
			if(cells[i].id != cells[i].dataset.initial) {
				return false;
			}
		}
		return true;

	}	
	
	function enableImageChange() {
		
		var alts = document.querySelectorAll('.alt-img');
		for(var i = 0; i < alts.length; i++) {
			alts[i].onclick = function() {
				document.querySelector('.current').classList.remove('current');
				this.classList.add('current');
				selectedImage();
			};
		}
	}

		function assignIds() {
		var cells = document.querySelectorAll(".cell");
		for(var i = 0; i < cells.length; i++) {
			var row = parseInt(cells[i].style.top) / cellSize;
			var col = parseInt(cells[i].style.left) / cellSize;
			cells[i].id = "cell_" + row + "_" + col;
		}
	}


	function getNeighbors() {
		assignIds();

		var oldNeighbors = document.querySelectorAll(".neighbor");
		for(var i = 0; i < oldNeighbors.length; i++) {
			oldNeighbors[i].classList.remove("neighbor");
			oldNeighbors[i].onclick = null;
		}
		
		var neighbors = [];
		
		var left = "cell_" + emptyRow + "_" + (emptyCol - 1);
		var top = "cell_" + (emptyRow - 1) + "_" + emptyCol;
		var right = "cell_" + emptyRow + "_" + (emptyCol + 1);
		var down = "cell_" + (emptyRow + 1) + "_" + emptyCol;

		var possibleNeighbors = [left, top, right, down];
		
		for(var i = 0; i < possibleNeighbors.length; i++) {
			if(document.getElementById(possibleNeighbors[i])) {
				neighbors.push(document.getElementById(possibleNeighbors[i]));
			}
		}
		
		return neighbors;		
	}

	function selectedImage() {
		var img = document.querySelector('.current').getElementsByTagName('img')[0];
		var cells = document.querySelectorAll('.cell');

		for(var i = 0; i < cells.length; i++) {					
			cells[i].style.backgroundImage = "url('"+ img.src + "')";
		}

		moveCount = 0;
		document.getElementById("moveCounter").innerHTML = "move: " + moveCount;
	}

	function makecells() {
		emptyRow = emptyCol = tableSize -1;
		var row = 0;
		var col = 0;
		var fontClass = "fontdefault"; //size of font

		var imageSize = cellSize * tableSize;

		var area = document.getElementById("puzzleTable");
		area.innerHTML = "";

		for(var i = 0; i < (tableSize * tableSize) -1; i++) {
			
			if(i > 0 && i % tableSize == 0) {
				row++;
				col = 0;
			}

			var cell = document.createElement("div");
			cell.classList.add("cell");
			cell.classList.add(fontClass);

			cell.style.width = cell.style.height = cellSize - 2 + "px";
			cell.style.backgroundSize = imageSize + "px " + imageSize + "px";
			cellPosition(cell, row, col);

			var initialPos = "cell_" + row + "_" + col;
			cell.dataset.initial = initialPos;

			var num = document.createElement("p");
			num.innerHTML = i + 1;
			cell.appendChild(num);
			area.appendChild(cell);
			
			col++;
		}
		movable(getNeighbors());
		selectedImage();


	}

	function move(neighbor) {		
		var left = emptyCol * cellSize + "px";
		var top = emptyRow * cellSize + "px";
		
		emptyRow = parseInt(neighbor.style.top) / cellSize;
		emptyCol = parseInt(neighbor.style.left) / cellSize;
		neighbor.style.top = top;
		neighbor.style.left = left;	
		moveCount ++;
		document.getElementById("moveCounter").innerHTML = "move: " + moveCount;
	}


	function shuffle() {
		winShow(false);
		for(var i = 0; i < 1000; i++) { 
			var neighbors = getNeighbors();				
			var rand = parseInt(Math.random() * neighbors.length);
			var neighbor = neighbors[rand];
			move(neighbor);			
		}
		movable(getNeighbors());
				moveCount = 0;
				document.getElementById("moveCounter").innerHTML = "move: " + moveCount;

		}
	
	function movable(neighbors) {
		for(var i = 0; i < neighbors.length; i++) {
			neighbors[i].classList.add("neighbor");
			
			//assign handlers
			neighbors[i].onclick = function() {
				move(this);
				movable(getNeighbors());
				if(checkWin()) {
					winShow(true);
				}
			};
		}
	}
	
	function cellPosition(cell, row, col) {
		var xCoord = col * cellSize;
		var yCoord = row * cellSize;
		cell.style.top = yCoord + "px";
		cell.style.left = xCoord + "px";
		cell.style.backgroundPosition = (xCoord * -1) + "px " + (yCoord * -1) + "px";
	}

	//Reset Timer if Win or Shuffle//	Show/Hide Win
	function winShow(bool) {
		var win = document.getElementById("win");
		var timerstop = document.getElementById("time");
		var timerstop1 = document.getElementById("timetracker");
		var string1 = timerstop.innerHTML;

		if(bool) {
			win.style.display = "block";
			timerstop.style.display = "none";
			timerstop.innerHTML = "";
			start = 0;


		} else {
			win.style.display = "none";
			start = 0;
			timerstop.innerHTML = "";
			timerstop.style.display = "block";

		}
	}	




})();