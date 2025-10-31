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

const recording_toggle = document.getElementById('record');
var blob, recorder = null;
var chunks = [];

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


slider.onchange = function() {
	sliderDiv.innerHTML = this.value;
	pitch = this.value;
	frequency()
}

function frequency() {
	gainNode.gain.setValueAtTime(amplitude, audioCtx.currentTime)
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
	const gradient = ctx.createLinearGradient(0, 0, 0, height);
	gradient.addColorStop(0, `rgb(0, 191, 255)`);
	gradient.addColorStop(1, `rgb(30, 144, 255)`);
	ctx.fillStyle = gradient;
    	for (let x = 0; x < width; x++) {
        	let y = height/3 + (amplitude/2 * Math.sin(2 * Math.PI * x * freq + phase));
        	if (x === 0) {
            	ctx.moveTo(x, y);
        	} else {
            	ctx.lineTo(x, y);
        	}
    	}
	ctx.lineTo(width - 1, height);
    	ctx.lineTo(0, height);
    	ctx.closePath();
	ctx.fill();
}

