const tracks = [
    document.getElementById("bgm-festive_mixtape"),
    document.getElementById("bgm-creme_brulee")
];

let currentTrackIndex = 0;

function playNextTrack() {
    const currentTrack = tracks[currentTrackIndex];
    currentTrack.currentTime = 0;
    currentTrack.play();

    currentTrack.onended = () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        playNextTrack();
    };
}

let musicPlaying = false;
$(document).mousemove(function () {
    if (!musicPlaying) {
        musicPlaying = true;
        playNextTrack();
    }
});

const button_click_sfx = document.getElementById("button_click");
const button_click_soft_sfx = document.getElementById("button_click_soft");

$(document).ready(function() {
    $('button').on('click', function() {
        const sfx = button_click_sfx.cloneNode(true);
        sfx.volume = 0.33;
        sfx.play();
    });
});