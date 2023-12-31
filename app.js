"use strict";
const canvas = document.getElementById("sketchCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let curveNo = 0;
let drawingPath = []; // Explicitly type the path array
let drawingHistory = []; // Type the history array
let offsetX = 0;
let offsetY = 0;
let topY = 0;
// Check for touch support using type guards
const isTouchDevice = (() => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0;
})();
// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Event listeners with type annotations
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("wheel", scrollCanvas);
// Drawing functions with type annotations
function startDrawing(e) {
    isDrawing = true;
    draw(e);
}
function draw(e) {
    if (!isDrawing)
        return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    drawingPath.push({ x, y, curveNo });
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}
function stopDrawing() {
    if (isDrawing || !drawingPath) {
        isDrawing = false;
        curveNo += 1;
        drawingHistory.push(drawingPath);
        drawingPath = [];
    }
    ctx.beginPath();
}
function scrollCanvas(event) {
    const delta = event.deltaY;
    if (delta > 0 || topY < 0) {
        offsetY -= delta;
        topY -= delta;
        canvas.height += Math.abs(delta);
        redrawCanvas();
    }
    else {
        topY = 0;
    }
}
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawCanvas();
});
function undo() {
    if (drawingHistory.length > 0) {
        curveNo -= 1;
        drawingHistory.pop();
        redrawCanvas();
    }
}
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory.forEach((path) => {
        for (let i = 0; i < path.length; i++) {
            let point = path[i];
            let currCurveNum = point.curveNo;
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.strokeStyle = "#000";
            ctx.lineTo(path[i].x, path[i].y);
            ctx.stroke();
            ctx.beginPath();
            if (i != path.length - 1)
                ctx.moveTo(path[i].x, path[i].y);
        }
    });
}
document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        undo();
    }
});
