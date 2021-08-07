const canvasBlock = document.querySelector('#canvas-block');
const ellipse = document.querySelector('#ellipse');
const rectangle = document.querySelector('#rectangle');
const context = canvasBlock.getContext('2d');

context.strokeStyle = 'red';
context.lineWidth = 5;

const elements = [];

let canvasZoneCoords = canvasBlock.getBoundingClientRect();

const mouse = {
    x: 0,
    y: 0,
};

let selected = false;
let active = false;

var Rect = function (x, y, w, h, name, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
    this.color = color;
};
Rect.prototype = {
    drowR: function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.w, this.h);
    },
    drowE: function () {
        context.fillStyle = this.color;
        context.beginPath();
        context.ellipse(this.x, this.y, this.w, this.h, 0, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    },
    strokeR: function () {
        context.strokeRect(this.x, this.y, this.w, this.h);
    },
    strokeE: function () {
        context.fillStyle = 'red';
        context.beginPath();
        context.ellipse(this.x, this.y, this.w, this.h, 0, 0, Math.PI * 2);
        context.closePath();
        context.stroke();
    },
};

//get coords the mouse
const getCoords = () => {
    let coordinates = {
        coordX: 0,
        coordY: 0
    };
    const getCursorCoords = (e) => {
        coordinates = {
            coordX: e.offsetX,
            coordY: e.offsetY
        };
        return coordinates;
    };
    return getCursorCoords;
};

// create figures
const drawRectangle = (coordsData) => {
    if (canvasBlock.getContext) {
        context.fillStyle = 'green';
        elements.push(new Rect(coordsData.coordX - 40, coordsData.coordY - 25, 80, 50, 'rectangle', 'green'));
        render(elements);
    };
};
const drawEllipse = (coordsData) => {
    if (canvasBlock.getContext) {
        context.fillStyle = 'blue';
        elements.push(new Rect(coordsData.coordX, coordsData.coordY, 46, 28, 'ellipse', 'blue'));
        render(elements);
    }
}

// drag to canvas block   
const letDrop = (e) => {
    e.preventDefault();
};
canvasBlock.ondragover = letDrop;


const dragStart = (e) => {
    e.dataTransfer.setData('id', e.target.id);
};
ellipse.ondragstart = dragStart;
rectangle.ondragstart = dragStart;


const drop = (e) => {
    let elemId = e.dataTransfer.getData('id');
    let coords = getCoords();
    elemId === 'rectangle' ? drawRectangle(coords(e)) : drawEllipse(coords(e));
};
canvasBlock.ondrop = drop;

let cursorInFigure = (item) => {
    return mouse.x > item.x && mouse.x < item.x + item.w && mouse.y > item.y && mouse.y < item.y + item.h
}
let figureInZone = (mouseX, mouseY) => {
    return mouseX > canvasZoneCoords.left && mouseX < canvasZoneCoords.right && mouseY > canvasZoneCoords.top && mouseY < canvasZoneCoords.bottom;
}

// render
let render = (elements) => {
    context.clearRect(0, 0, 603, 455);
    elements.forEach((item) => {
        item.name === 'rectangle' ? item.drowR() : item.drowE();
        if (cursorInFigure(item)) {
            item.name === 'rectangle' ? item.strokeR() : item.strokeE();
        }
    });
    if (selected) {
        selected.x = mouse.x - selected.w / 2;
        selected.y = mouse.y - selected.h / 2;
        selected.name === 'rectangle' ? selected.strokeR() : selected.strokeE();
    }
    if (active) {
        elements.push(elements.splice(elements.indexOf(active), 1)[0]);
        active.name === 'rectangle' ? active.strokeR() : active.strokeE();
    }
};

// make active
window.onclick = () => {
    if (!active) {
        elements.forEach((item) => {
            if (cursorInFigure(item)) {
                active = item;
            }
        });
    } else {
        active = false;
        elements.forEach((item) => {
            if (cursorInFigure(item)) {
                active = item;
            }
        });
    };
};

// delete figure
window.onkeydown = function (event) {
    if (event.code == 'Delete') {
        if (active) {
            let index = elements.indexOf(active);
            if (index > -1) {
                elements.splice(index, 1);
            };
            active = false;
        };
    };
};

// d&d in canvas
window.onmousemove = function (e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    render(elements);
};

window.onmousedown = function () {
    if (!selected) {
        elements.forEach((item) => {
            if (cursorInFigure(item)) {
                selected = item;
            };
        });
    };
};

window.onmouseup = function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    elements.forEach((item) => {
        if (!figureInZone(mouseX, mouseY)) {
            if (item === selected) {
                elements.splice(elements.indexOf(item), 1);
            };
        };
    });
    selected = false;
};