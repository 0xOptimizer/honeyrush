// Get the audio element and the toggle button
const musicToggleButton = document.getElementById("music-toggle");
const music = document.getElementById("background-music");

// Initially, try to play the music (browser might block it until user interacts)
let musicPlaying = false; 

// Function to toggle music play/pause
musicToggleButton.addEventListener("click", () => {
    if (musicPlaying) {
        music.pause();
        musicToggleButton.textContent = "Turn On Music";
    } else {
        music.play().catch(error => {
            console.error("Error playing music: ", error);
        });
        musicToggleButton.textContent = "Turn Off Music";
    }
    musicPlaying = !musicPlaying;
});
