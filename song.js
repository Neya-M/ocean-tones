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
const gradient = ctx.createLinearGradient(0, 0, 0, height);
gradient.addColorStop(0, `rgb(30, 144, 255)`);
gradient.addColorStop(0.7, `rgb(0, 191, 255)`);
gradient.addColorStop(1, "white");

const recording_toggle = document.getElementById('record');
var blob, recorder = null;
var chunks = [];
var amplitude = 20;
var restart = false;
var reverse = false;
var endpoint = 0;
var progress = 0;
var pitchSave = 0;
var pitch = 30;
var notes = [];
var noteLetters = [];
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

function frequency() {
	gainNode.gain.setValueAtTime(amplitude, audioCtx.currentTime);
	oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.99);
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
}

var is_recording = false;
function toggle() {
   is_recording = !is_recording; 
   if(is_recording){
       recording_toggle.innerHTML = "Stop Recording";
       startRecording(); 
   } else {
       recording_toggle.innerHTML = "Start Recording";
       recorder.stop();
   }
}

function startRecording() {
	const canvasStream = canvas.captureStream(20); // Frame rate of canvas
	const audioDestination = audioCtx.createMediaStreamDestination();
	gainNode.connect(audioDestination);
	const combinedStream = new MediaStream();
	canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
	audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
	recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
	recorder.ondataavailable = e => {
		if (e.data.size > 0) {
			chunks.push(e.data);
		}
	};


	recorder.onstop = () => {
		const blob = new Blob(chunks, { type: 'video/webm' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'recording.webm';
		a.click();
		URL.revokeObjectURL(url);
	};
	recorder.start();
}

function stop() {
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
}

audioCtx.resume();
gainNode.gain.value = 0;

const delay = ms => new Promise(res => setTimeout(res, ms));

const play = async () => {
	stop();
	restart = true;
	for (let i = 0; i < notes.length; i++) {
		reverse = false;
		pitch = notes[i];
		frequency();
		animate();
		await delay(500);
		reverse = true;
		endpoint = progress;
		pitchSave = pitch;
		await delay(500);
		restart = true;
		stop();
	}
}

function stop() {
	cancelAnimationFrame(animationId);
	progress = 0;
	animationId = null;
}

function addNote(note) {
	pitch = frequencies.get(note);
	notes.push(pitch);
	noteLetters.push(" " + note);
	document.getElementById("notes").textContent = noteLetters.toString();	
	console.log(notes);
	frequency();
}

let animationId;

function animate() {
	drawWetSand();
  	drawWave();
	animationId = requestAnimationFrame(animate);
	if (restart) {
		progress = -14;
		restart = false;
	} else if (reverse) {
		progress -= 3;
	} else {
		progress += 3;
	}
}

function drawWave() {
    	ctx.beginPath();
	ctx.fillStyle = gradient;
    	for (let x = 0; x < width; x++) {
        	let y = (amplitude/2 * Math.sin(2 * Math.PI * x * pitch/10000));
            	ctx.lineTo(x, y + progress);
    	}
	ctx.lineTo(width - 1, 0);
    	ctx.lineTo(0, 0);
    	ctx.closePath();
	ctx.fill();
}
function drawWetSand() {
    	ctx.clearRect(0, 0, width, height);
    	ctx.beginPath();
	ctx.fillStyle = `rgb(222, 184, 135)`;
    	for (let x = 0; x < width; x++) {
        	let y = (amplitude/2 * Math.sin(2 * Math.PI * x * pitchSave/10000));
            	ctx.lineTo(x, y + endpoint);
    	}
	ctx.lineTo(width - 1, 0);
    	ctx.lineTo(0, 0);
    	ctx.closePath();
	ctx.fill();
}
