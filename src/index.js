import { DOMElementRotator } from "./domElementRotator";

const domElementRotator = new DOMElementRotator(
  document.querySelector(".cube")
);

const turnHandler = (event) => {
  const classList = event.target.classList;
  if (classList.contains('up')) {
    domElementRotator.rotateAngle([1, 0, 0], Math.PI / 2);
  }
  if (classList.contains('down')) {
    domElementRotator.rotateAngle([1, 0, 0], -Math.PI / 2);
  }
  if (classList.contains('left')) {
    domElementRotator.rotateAngle([0, 1, 0], -Math.PI / 2);
  }
  if (classList.contains('right')) {
    domElementRotator.rotateAngle([0, 1, 0], Math.PI / 2);
  }
};

const upButton = document.querySelector(".turn .up");
const downButton = document.querySelector(".turn .down");
const leftButton = document.querySelector(".turn .left");
const rightButton = document.querySelector(".turn .right");

upButton.onclick = turnHandler;
downButton.onclick = turnHandler;
leftButton.onclick = turnHandler;
rightButton.onclick = turnHandler;
