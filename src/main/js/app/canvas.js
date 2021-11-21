import store from "./store";
import {check} from "../api/request";

const MAX_RADIUS = 3

function xToCanvas(x, w) {
    return x * (w * 0.4 / MAX_RADIUS) + w / 2
}

function yToCanvas(y, h) {
    return y * -(h * 0.4 / MAX_RADIUS) + h / 2
}

function canvasToX(clickX, w) {
    return (clickX - w / 2) / (w * 0.4 / MAX_RADIUS)
}

function canvasToY(clickY, h) {
    return (-1) * (clickY - h / 2) / (h * 0.4 / MAX_RADIUS)
}

function drawCanvasPoint(x, y, r, canvas) {
    let context = canvas.getContext("2d");
    let res = isAreaHit(x, y, r)
    context.strokeStyle = "#ffffff";
    if (!res) {
        context.fillStyle = "#FF2A1F";
    } else {
        context.fillStyle = "#5FFF33";
    }
    context.beginPath();
    context.arc(xToCanvas(x, canvas.width), yToCanvas(y, canvas.height), 4, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.closePath();
}

function drawChecks(checks, canvas, r) {
    if (checks !== null && checks !== undefined)
        for (let check of checks) {
            let x = parseFloat(check["coordinateX"])
            let y = parseFloat(check["coordinateY"])
            drawCanvasPoint(x, y, r, canvas);
        }
}

function isAreaHit(x, y, r) {
    x = parseFloat(x)
    y = parseFloat(y)
    r = parseFloat(r)
    return (x >= 0 && y <= 0 && y >= -r && x <= r) ||
        (x >= 0 && y >= 0 && x * x + y * y <= r/2 * r/2) ||
        (x <= 0 && y <= 0 && y >= -r/2 && (y >= (-x - r/2)) && x >= -r/2)
}

function drawAxis(context, w, h, xR, yR) {
    context.beginPath();
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.moveTo(0, h / 2);
    context.lineTo(w, h / 2);
    context.stroke();
    context.beginPath();
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.moveTo(w / 2, h);
    context.lineTo(w / 2, 0);
    context.stroke();
    context.lineWidth = 1
    context.strokeWidth = 0.5
    context.strokeText("1.5", w / 2 + xR / 2, h / 2);
    context.strokeText("3", w / 2 + xR, h / 2);
    context.strokeText("-1.5", w / 2, h / 2 + yR / 2);
    context.strokeText("-3", w / 2, h / 2 + yR);
    context.strokeText("-1.5", w / 2 - xR / 2, h / 2);
    context.strokeText("1.5", w / 2, h / 2 - yR / 2);
    context.strokeText("3", w / 2, h / 2 - yR);
    context.strokeText("-3", w / 2 - xR, h / 2);
    context.strokeText("Y", w / 2, 10);
    context.strokeText("X", w - 10, h / 2);
}

export function drawCanvas(canvas) {
    let context = canvas.getContext("2d");
    let r = store.getState().radius
    let checks = store.getState().checks
    let w = canvas.width
    let xR = w * 0.4
    let h = canvas.height
    let yR = h * 0.4
    context.fillStyle = "#1a1a1a"
    context.fillRect(0, 0, w, h)

    context.fillStyle = "rgba(0, 0, 255, 0.68)";
    context.font = "14px Verdana";
    context.fillRect(w / 2, h / 2, xR * r / MAX_RADIUS, yR * r / MAX_RADIUS);

    context.beginPath();
    context.moveTo(w / 2, h / 2);
    context.lineTo(w / 2, h / 2 + (yR / 2) * r / MAX_RADIUS);
    context.lineTo(w / 2 - xR * r / 2 / MAX_RADIUS, h / 2);
    context.fill();

    context.beginPath();
    context.moveTo(w / 2, h / 2);
    context.arc(w / 2, h / 2, xR * r / 2 / MAX_RADIUS, -Math.PI / 2, 0);
    context.fill();

    drawAxis(context, w, h, xR, yR);
    drawChecks(checks, canvas, r)
}

export function clearCanvas(canvas) {
    let context = canvas.getContext("2d");
    let w = canvas.width
    let xR = w * 0.4
    let h = canvas.height
    let yR = h * 0.4
    context.fillStyle = "#1a1a1a"
    context.fillRect(0, 0, w, h)
    drawAxis(context, w, h, xR, yR)
    drawChecks(store.getState().checks, canvas, 0)
}

export function clicked(event, submitInfo) {
    const canvas = document.querySelector('canvas')
    const rect = canvas.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top
    let r = store.getState().radius
    let x = canvasToX(clickX, canvas.width)
    let y = canvasToY(clickY, canvas.height)
    let information = {
        x: x,
        y: y,
        r: r
    };
    //todo
    console.log(canvas)
    submitInfo(information)
}

export function drawPoint(information, canvas) {
    let x = information.x
    let y = information.y
    drawCanvasPoint(x, y, store.getState().radius, canvas)
}