let nBoards;
let size;
let min;
let max;
let incr;
let usedNums;
let sharedNums;
let remainNums;
let draws;
let drawInd;

function genBoards() {
	// read input
	nBoards = parseInt(document.getElementById("nBoards").value);
	size = parseInt(document.getElementById("size").value);
	min = parseInt(document.getElementById("min").value);
	max = parseInt(document.getElementById("max").value);
	incr = parseInt(document.getElementById("incr").value);
	usedNums = [...Array(max + 1).keys()].slice(min);
	usedNums.fill(false);

	// generate shared numbers (half of the board)
	let allNums = shuffleNums([...Array(max + 1).keys()].slice(min));
	sharedNums = allNums.slice(0, Math.floor(size*size*0.5));
	remainNums = allNums.slice(Math.floor(size*size*0.5), Math.min(max-min+1,Math.floor(size*size*1.5)));

	// reset draw number
	let drawNum = document.getElementById("drawNum");
	let pNum = document.getElementById("pNum");
	let mNum = document.getElementById("mNum");

	drawNum.innerHTML = "";
	pNum.value = "";
	pNum.setAttribute("placeholder", "")
	mNum.value = "";
	mNum.setAttribute("placeholder", "")

	// check if there's enough numbers for bingo board
	if((max - min + 1) < size*size) {
		alert("Board size too large for given number range.\nIncrease the number range or decrease board size.");
	} else if((max - min + 1) < 2*incr) {
		alert("Increment too large for given number range.\nIncrease the number range or decrease increment.");
	} else {
		// get div with boards
		let boards = document.getElementById("boards");

		// clear previous boards
		boards.innerHTML = "";

		// fill with boards
		for(let i = 0; i < nBoards; i++) {
			boards.appendChild(newBoard(i));
		}
	}

	let usableNums = [...Array(max + 1).keys()].slice(min);
	usableNums.fill(true);

	for(let i = 0; i < usedNums.length-2*incr; i++) {
		if(!usedNums[2*incr+i] && !usedNums[i]) {
			usableNums[incr+i] = false;
		}
	}

	for(let i = 0; i < incr; i++) {
		if(!usedNums[incr+i]) {
			usableNums[i] = false;
		}
		if(!usedNums[usedNums.length-(incr+i+1)]) {
			usableNums[usedNums.length-(i+1)] = false;
		}
	}

	let nums = [];
	for(let i = 0; i < usedNums.length; i++) {
		if(usableNums[i]) {
			nums.push(min+i);
		}
	}

	// prepare draw numbers
	draws = shuffleNums(nums);
	drawInd = null;
}

function draw() {
	// get number elements
	let drawNum = document.getElementById("drawNum");
	let pNum = document.getElementById("pNum");
	let mNum = document.getElementById("mNum");

	// increase the draw index if possible
	if(drawInd == null) {
		drawInd = 0;
		drawNum.innerHTML = draws[drawInd];
		pNum.value = "";
		pNum.setAttribute("placeholder", draws[drawInd] + "+" + incr)
		mNum.value = "";
		mNum.setAttribute("placeholder", draws[drawInd] + "-" + incr)
	} else if(drawInd < draws.length - 1) {
		drawInd += 1;
		drawNum.innerHTML = draws[drawInd];
		pNum.value = "";
		pNum.setAttribute("placeholder", draws[drawInd] + "+" + incr)
		mNum.value = "";
		mNum.setAttribute("placeholder", draws[drawInd] + "-" + incr)
	} else {
		alert("Out of numbers.");
	}
}

function back() {
	// get number elements
	let drawNum = document.getElementById("drawNum");
	let pNum = document.getElementById("pNum");
	let mNum = document.getElementById("mNum");

	// decrease the draw index if possible
	if(drawInd == 0 || drawInd == null) {
		alert("Can't go back.")
	} else {
		drawInd -= 1;
		drawNum.innerHTML = draws[drawInd];
		pNum.value = "";
		pNum.setAttribute("placeholder", draws[drawInd] + "+" + incr)
		mNum.value = "";
		mNum.setAttribute("placeholder", draws[drawInd] + "-" + incr)
	}
}

function newBoard(nBoard) {
	// create div with board
	let board = document.createElement("DIV");
	board.setAttribute("class", "block")

	// add text box for student's name
	let name = document.createElement("INPUT");
	let namewidth = 0;
	name.className = "name";
	if(min < 100) {
		name.style.width = (size*56+2) + "px";
	} else {
		name.style.width = (size*62+2) + "px";
	}
	name.setAttribute("type", "text");
	name.setAttribute("placeholder", "Player " + (nBoard + 1))
	board.appendChild(name);

	// shuffle number range, enforcing that sharedNums is included
	let nums = shuffleNums(sharedNums.concat(shuffleNums(remainNums).slice(0,size*size - Math.floor(size*size*0.5))));

	// start a <table> node
	let tab = document.createElement("TABLE");

	// assemble rows of the table
	for(let i=0; i < size; i++) {
		let row = document.createElement("TR");

		// fill row with numbers
		for(let j=0; j < size; j++) {
			// pick a number from the shuffled list in order
			let num = nums[i*size + j]
			usedNums[num-min] = true;

			// fill row with number
			let cell = document.createElement("TH");
			cell.className = "cell";
			cell.setAttribute("id", "cell" + nBoard.toString() + i.toString() + j.toString())
			cell.addEventListener("click", function() { toggle(nBoard, i, j) } );
			cell.appendChild(document.createTextNode(num));
			row.appendChild(cell);
		}

		// fill table with row
		tab.appendChild(row);
	}

	// add table to div with boards
	board.appendChild(tab);

	return board;
}

function toggle(nBoard, i, j) {
	// find the cell that was clicked
	let cell = document.getElementById("cell" + nBoard.toString() + i.toString() + j.toString());

	// toggle cell color
	if(cell.style.backgroundColor == "") {
		cell.style.backgroundColor = "DimGray";
	} else {
		cell.style.backgroundColor = "";
	}
}

function shuffleNums(nums) {
	// shuffle array
	let currInd = nums.length;
	let randInd;
	let temp;

	while(currInd != 0) {
		// pick a random index to switch with the current index
		randInd = Math.floor(Math.random() * currInd);
		currInd -= 1;
		temp = nums[currInd];
		nums[currInd] = nums[randInd];
		nums[randInd] = temp;
	}

	return nums;
}