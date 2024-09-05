const audio = document.getElementById('audio');
const fileInput = document.getElementById('file-input');
const playPauseBtn = document.querySelector('.play-pause');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.previous');
const volumeSlider = document.getElementById('volume');
const progressBar = document.getElementById('progress');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const songTitleSpan = document.getElementById('song-title');
const playlist = document.getElementById('playlist');
const visualizer = document.getElementById('visualizer');

let isPlaying = false;
let isMuted = false;
let currentSong = null;
let playlistSongs = [];
let audioCtx, analyser, source, dataArray;

fileInput.addEventListener('change', handleFileChange);
playPauseBtn.addEventListener('click', playPause);
nextBtn.addEventListener('click', playNextSong);
prevBtn.addEventListener('click', playPreviousSong);
volumeSlider.addEventListener('input', adjustVolume);
progressBar.addEventListener('input', seek);

audio.addEventListener('loadedmetadata', updateDuration);
audio.addEventListener('timeupdate', updateCurrentTime);
audio.addEventListener('ended', playNextSong);

function handleFileChange(event) {
    const file = fileInput.files[0];
    if (file) {
        playSong(file);
        addSongToPlaylist(file);
    }
}

function playPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.querySelector('i').classList.remove('fa-pause');
        playPauseBtn.querySelector('i').classList.add('fa-play');
    } else {
        audio.play();
        playPauseBtn.querySelector('i').classList.remove('fa-play');
        playPauseBtn.querySelector('i').classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
}

function adjustVolume() {
    audio.volume = volumeSlider.value / 100;
}

function seek() {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
}

function updateDuration() {
    durationSpan.textContent = formatTime(audio.duration);
}

function updateCurrentTime() {
    currentTimeSpan.textContent = formatTime(audio.currentTime);
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    updateVisualizer();
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function playNextSong() {
    if (playlistSongs.length > 0) {
        const nextSongIndex = (playlistSongs.indexOf(currentSong) + 1) % playlistSongs.length;
        playSong(playlistSongs[nextSongIndex]);
    }
}

function playPreviousSong() {
    if (playlistSongs.length > 0) {
        const prevSongIndex = (playlistSongs.indexOf(currentSong) - 1 + playlistSongs.length) % playlistSongs.length;
        playSong(playlistSongs[prevSongIndex]);
    }
}

function addSongToPlaylist(file) {
    if (!playlistSongs.includes(file)) {
        playlistSongs.push(file);
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        listItem.addEventListener('click', () => playSong(file));
        playlist.appendChild(listItem);
    }
}

function playSong(file) {
    audio.src = URL.createObjectURL(file);
    audio.load();
    audio.play();
    songTitleSpan.textContent = file.name;
    isPlaying = true;
    playPauseBtn.querySelector('i').classList.remove('fa-play');
    playPauseBtn.querySelector('i').classList.add('fa-pause');
    currentSong = file;
}

function updateVisualizer() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    
    const canvas = visualizer;
    const ctx = canvas.getContext('2d');
    const barWidth = 5;
    const barSpacing = 2;
    const barCount = Math.floor(canvas.width / (barWidth + barSpacing));
    
    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < barCount; i++) {
            const barHeight = dataArray[i] * 2;
            ctx.fillStyle = '#ff6f61';
            ctx.fillRect(i * (barWidth + barSpacing), canvas.height - barHeight, barWidth, barHeight);
        }
    }
    
    draw();
}

// Resize the visualizer on window resize
window.addEventListener('resize', () => {
    visualizer.width = visualizer.clientWidth;
});
let progress = document.getElementById("progress");
let song = document.getElementById("song");
let ctrlIcon = document.getElementById("ctrlIcon");

song.onloadedmetadata = function (){
    progress.max = song.duration;
}

song.ontimeupdate = function() {
    progress.value = song.currentTime;
}

progress.oninput = function() {
    song.currentTime = progress.value;
};

function playpause() {
    if (ctrlIcon.classList.contains("fa-play")) {
        song.play();
        ctrlIcon.classList.remove("fa-play");
        ctrlIcon.classList.add("fa-pause");
    } else {
        song.pause();
        ctrlIcon.classList.remove("fa-pause");
        ctrlIcon.classList.add("fa-play");
    }
}
let progress = document.getElementById("progress");
let song = document.getElementById("song");
let ctrlIcon = document.getElementById("ctrlIcon");

song.onloadedmetadata = function (){
    progress.max = song.duration;
}

song.ontimeupdate = function() {
    progress.value = song.currentTime;
}

progress.oninput = function() {
    song.currentTime = progress.value;
};

