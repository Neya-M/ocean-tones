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
var progress = 0;
var pitch = 0;
var notes = [];
let frequencies = new Map();
frequencies.set("C3", 130.81);
frequencies.set("D3", 146.83);
frequencies.set("E3", 164.81);
frequencies.set("F3", 174.61);
frequencies.set("G3", 196);
frequencies.set("A3", 220);
frequencies.set("B3", 246.94);
frequencies.set("C4", 261.63);
frequencies.set("D4", 293.66);
frequencies.set("E4", 329.63);
frequencies.set("F4", 349.23);
frequencies.set("G4", 392);
frequencies.set("A4", 440);
frequencies.set("B4", 493.88);


pitch = 30;

function frequency() {
	gainNode.gain.setValueAtTime(amplitude, audioCtx.currentTime);
	oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
	gainNode.gain.setValueAtTime(amplitude/2, audioCtx.currentTime + 0.8);
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
}

function stop() {
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
}

audioCtx.resume();
gainNode.gain.value = 0;

function play() {
	for (let i = 0; i < notes.length; i++) {
		frequency(notes[i]);
		animate();
		progress = 0;
	}
}

function addNote(note) {
	pitch = frequencies.get(note);
	notes.push(pitch)
	console.log(notes)
	frequency();
}

function animate() {
  	drawWave();
  	requestAnimationFrame(animate);
	progress += 1;
}

function drawWave() {
    	ctx.clearRect(0, 0, width, height);
    	ctx.beginPath();
	ctx.strokeStyle = `rgb(0, 191, 255)`;
	const gradient = ctx.createLinearGradient(0, 0, 0, height);
	gradient.addColorStop(0, `rgb(0, 191, 255)`);
	gradient.addColorStop(1, `rgb(30, 144, 255)`);
	ctx.fillStyle = gradient;
    	for (let x = 0; x < width; x++) {
        	let y = height/3 + (amplitude/2 * Math.sin(2 * Math.PI * x * pitch/10000));
        	if (x === 0) {
            	ctx.moveTo(x, y + progress);
        	} else {
            	ctx.lineTo(x, y + progress);
        	}
    	}
	ctx.lineTo(width - 1, 0);
    	ctx.lineTo(0, 0);
    	ctx.closePath();
	ctx.fill();
}


