const input = document.getElementById('input');

var interval = null;


// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();
var slider = document.getElementById("slider");


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

var amplitude = 40;
var img_length = 100;
var movement_dist = 1;
var move_count = 0;

notenames = new Map();
notenames.set("A", 440);
notenames.set("B", 493.9);
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392);

function frequency(pitch) {
	gainNode.gain.setValueAtTime(100, audioCtx.currentTime)
	oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime)
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1)
	freq = pitch / 10000;
}

audioCtx.resume();
gainNode.gain.value = 0;

function handle() {
	var userinput = String(input.value)
   	frequency(notenames.get(userinput));
	drawWave()
	while true {
		if movement_dist * move_count >= img_length {
			restart_wave();
			move_count = 0;
		} else {
			move_wave(movement_dist);
			move_count += 1;
		}
		// if slider value changed then change_wave_height(slider value)
	}
}

function handle_slider() {
	change_wave_height(slider.value)
}
//y = height/2 + (amplitude * Math.sin(2 * Math.PI * freq * x + halfpoint))
	
function init() {
	wave.src = "ocean_wave.png";
	window.requestAnimationFrame(draw);
}

function drawWave() {
	ctx.globalCompositeOperation = "destination-over";
	ctx.clearRect(0, 0, 300, 300); // clear canvas
	ctx.drawImage(wave, 0, 0);
}

function change_wave_height(height) {
	ctx.save();
	ctx.scale(1, height); // (width, height)
	ctx.drawImage(wave, 0, 0);
	ctx.restore();
}

function move_wave(distance) {
	ctx.save();
	ctx.translate(distance, 0); // (x, y)
	ctx.drawImage(wave, 0, 0);
	ctx.restore();
}

function restart_wave() {
	ctx.save();
	ctx.translate(-img_length, 0);
	ctx.drawImage(wave, 0, 0);
	ctx.restore();
}
