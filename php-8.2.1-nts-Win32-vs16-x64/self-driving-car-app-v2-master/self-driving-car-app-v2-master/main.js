// setare dimensiuni canvas
const carCanvas = document.getElementById("carCanvas");

carCanvas.width = 300;
const roadWidth = carCanvas.width;
const carWidth = 50; // set this to the width of your car image

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);
const N = 1;
const cars = generateCars(N);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "STAND", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "STAND", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "STAND", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "STAND", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "STAND", 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, "STAND", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "STAND", 2),
];

let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}
animate();

//serialize the best brain into the local storage
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
  window.alert("Content saved!");
}

function discard() {
  localStorage.removeItem("bestBrain");
  window.alert("Content deleted!");
}
function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y))); //new array with the y values of the car

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "#008CAF");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "#008CAF", true);

  carCtx.restore();
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate); //apeleaza functia animate pentru a da impresia miscarii
}
