const input = document.getElementById('input');

var interval = null;
var reset = false;


// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();
const vol_slider = document.getElementById('vol-slider');

// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

oscillator.start();
gainNode.gain.value = 0;

var timepernote = 0;
var length = 0;

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
var width = ctx.canvas.width;
var height = ctx.canvas.height;
ctx.strokeStyle = "blue";



notenames = new Map();
notenames.set("A", 440);
notenames.set("B", 493.9);
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392);

function frequency(pitch) {
	freq = pitch / 10000;
	gainNode.gain.setValueAtTime(vol_slider.value, audioCtx.currentTime);
	setting = setInterval(() => {gainNode.gain.value = vol_slider.value}, 1);
	oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
	setTimeout(() => { clearInterval(setting); gainNode.gain.value = 0; }, (timepernote/1000) - 0.1);
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime + (timepernote/1000) - 0.1)
}

function handle() {
    reset = true;
    audioCtx.resume();
    gainNode.gain.value = 0;

    var usernotes = String(input.value);
    var noteslist = [];

    length = usernotes.length;
    timepernote = (6000 / length);

    for (i = 0; i < usernotes.length; i++) {
        noteslist.push(notenames.get(usernotes.charAt(i)));
    }

    let j = 0;
    repeat = setInterval(() => {
       if (j < noteslist.length) {
           frequency(parseInt(noteslist[j]));
           drawWave();
       j++
       } else {
           clearInterval(repeat)
       }


   }, timepernote)
}

var counter = 0;
function drawWave() {
	clearInterval(interval);
	counter = 0;
	interval = setInterval(line, 20);
	if (reset) {
       		ctx.clearRect(0, 0, width, height);
       		x = 0;
       		y = height/2;
       		ctx.moveTo(x, y);
      		ctx.beginPath();
   	}
	reset = false
}

function line() {
	y = height/2 + (vol_slider.value/100) * 20 * Math.sin(2 * Math.PI * freq * x * (0.5 * length));
	ctx.lineTo(x, y);
	ctx.stroke();
	x += 1;
	counter++;
	if(counter > (timepernote / 20)) {
		clearInterval(interval);
  	}
}
