// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();


// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

oscillator.start();
gainNode.gain.value = 0;

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
var width = ctx.canvas.width;
var height = ctx.canvas.height;
const wave = new Image();

var amplitude = 20;
var phase = 0;
var freq = 0;
var pitch = 0;

// slider
var slider = document.getElementById('slider'),
    sliderDiv = document.getElementById("sliderAmount");

sliderDiv.innerHTML = slider.value;
pitch = slider.value;

slider.onchange = function() {
	sliderDiv.innerHTML = this.value;
	pitch = this.value;
	frequency()
}

function frequency() {
	gainNode.gain.setValueAtTime(20, audioCtx.currentTime)
	oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime)
	freq = pitch / 10000;
}

function stop() {
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
}

audioCtx.resume();
gainNode.gain.value = 0;

function handle() {
	frequency()
}

function animate() {
  drawWave();
  phase -= 0.1;
  requestAnimationFrame(animate);
}
animate();

function drawWave() {
    	ctx.clearRect(0, 0, width, height);
    	ctx.beginPath();
	ctx.strokeStyle = `rgb(0, 191, 255)`;
	const gradient = ctx.createLinearGradient(0, 0, 0, 0);
	gradient.addColorStop(0, `rgb(0, 191, 255)`);
	gradient.addColorStop(1, `rgb(30, 144, 255)`);
	ctx.fillStyle = gradient;
    	for (let x = 0; x < width; x++) {
        	let y = height/2 + (amplitude * Math.sin(2 * Math.PI * x * freq + phase));
        	if (x === 0) {
            	ctx.moveTo(x, y);
        	} else {
            	ctx.lineTo(x, y);
        	}
    	}
	ctx.lineTo(width - 1, height);
    	ctx.lineTo(0, height);
    	ctx.closePath();
}

