const input = document.getElementById('input');

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

notenames = new Map();
mapName.set("A", 440);
mapName.set("B", 493.9);
mapName.set("C", 261.6);
mapName.set("D", 293.7);
mapName.set("E", 329.6);
mapName.set("F", 349.2);
mapName.set("G", 392);

function frequency(pitch) {
	gainNode.gain.setValueAtTime(100, audioCtx.currentTime)
	oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime)
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1)	
}

audioCtx.resume();
gainNode.gain.value = 0;

function handle() {
	var userinput = String(input.value)
   	frequency(mapName.get(userinput));
}
