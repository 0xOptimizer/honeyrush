// Get the audio element and the toggle button
const musicToggleButton = document.getElementById("music-toggle");
const music = document.getElementById("background-music");

// Initially, try to play the music (browser might block it until user interacts)
let musicPlaying = false; 

// Function to toggle music play/pause
$(document).mousemove(function () {
    if (!musicPlaying) {
        musicPlaying = true;
        music.play().catch(error => {
            console.error("Error playing music: ", error);
        });
    }
});
