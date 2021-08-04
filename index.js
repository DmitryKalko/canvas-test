const canvasBlock = document.querySelector('#canvas-block');
const ellipse = document.querySelector('#ellipse');
const rectangle = document.querySelector('#rectangle');

//get coords the mouse
const getCoords = () => {
	let coordinates = {
		coordX: 0,
		coordY: 0
	}
	const getCursorCoords = (e) => {
		coordinates = {
			coordX: e.offsetX,
			coordY: e.offsetY
		}
		return coordinates;
	}
	return getCursorCoords;
}


// draw canvas elements
const drawRectangle = (coordsData) => {
	if (canvasBlock.getContext) {
		let context = canvasBlock.getContext('2d');
		context.fillRect(coordsData.coordX, coordsData.coordY, 80, 50);
	}
}

const drawEllipse = () => {
	if (canvasBlock.getContext) {
		let context = canvasBlock.getContext('2d');
		context.ellipse(100, 100, 80, 50, 0, 0, Math.PI * 2);
		context.fill();
	}
}

// drag & drop   
const letDrop = (e) => {
	e.preventDefault();
}
canvasBlock.ondragover = letDrop;



const dragStart = (e) => {
	e.dataTransfer.setData('id', e.target.id);
}
ellipse.ondragstart = dragStart;
rectangle.ondragstart = dragStart;


const drop = (e) => {
	let elemId = e.dataTransfer.getData('id');
	console.log(elemId);
	
	console.log(e);
	let coords = getCoords();
	console.log(coords(e));
	drawRectangle(coords(e))
}
canvasBlock.ondrop = drop;
