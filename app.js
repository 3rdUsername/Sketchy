const canvas = document.getElementById("sketchCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let curveNo=0;
let drawingPath = []; // Store the current drawing path
let drawingHistory = []; // Store all drawing paths
let offsetX = 0;
let offsetY = 0;
let topY = 0;
// Check if the device supports touch events
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;



// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
if (isTouchDevice) {
    // If it's a touch device, use the 'wheel' event for touchpad scrolling
    canvas.addEventListener('wheel', scrollCanvas);
} else {
    // If it's not a touch device, use the 'mousewheel' event for mouse wheel scrolling
    canvas.addEventListener('mousewheel', scrollCanvas);
}

// Drawing functions
function startDrawing(e) {
	isDrawing = true;
	draw(e);
}

function draw(e) {
	if (!isDrawing) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    
    drawingPath.push({ x, y ,curveNo});

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
	if (isDrawing) {
		isDrawing = false;
        curveNo+=1;
		drawingHistory.push(drawingPath);
		drawingPath = [];
	}
	ctx.beginPath();
}



function scrollCanvas(event) {
    //stopDrawing()
    const delta = event.deltaY ;
    if (delta > 0 || topY <0) {
        debugger;
        // Adjust the offsetY based on the scroll direction
        offsetY -= delta;
        topY-=delta;
        canvas.height +=Math.abs(delta);
        redrawCanvas();
    }else {
        topY=0;
    }
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawCanvas();
});


// Undo functionality
function undo() {
	if (drawingHistory.length > 0) {
        curveNo-=1;
		drawingHistory.pop(); // Remove the last drawn path
		redrawCanvas();
	}
}

// Redraw the canvas based on the drawing history
function redrawCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawingHistory.forEach((path) => {
		ctx.moveTo(path[0].x, path[0].y);
		for (let i = 1; i < path.length; i++) {
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000';
			ctx.lineTo(path[i].x, path[i].y);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(path[i].x, path[i].y);
		}
	});
}

// Event listener for Ctrl + Z (Windows) or Cmd + Z (Mac) keyboard shortcut
document.addEventListener("keydown", (event) => {
	if ((event.ctrlKey || event.metaKey) && event.key === "z") {
		undo();
	}
});
