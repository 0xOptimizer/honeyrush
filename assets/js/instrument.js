let isSoundMuted = false;
let isMusicMuted = false;
$(document).ready(function() {
    isSoundMuted = JSON.parse(localStorage.getItem('isSoundMuted')) || false;
    isMusicMuted = JSON.parse(localStorage.getItem('isMusicMuted')) || false;

    updateAllSoundsVolume();
    updateAllMusicVolume();

    updateMuteButtonUI($('.mute-sound-btn'), isSoundMuted);
    updateMuteButtonUI($('.mute-music-btn'), isMusicMuted);
});

function toggleMuteAllSounds() {
    isSoundMuted = !isSoundMuted;
    localStorage.setItem('isSoundMuted', JSON.stringify(isSoundMuted));
    updateAllSoundsVolume();
}
function toggleMuteMusic() {
    isMusicMuted = !isMusicMuted;
    localStorage.setItem('isMusicMuted', JSON.stringify(isMusicMuted));
    updateAllMusicVolume();
}


function updateAllSoundsVolume() {
    const sfxElements = document.querySelectorAll('audio:not([loop])');
    sfxElements.forEach(audio => {
        audio.muted = isSoundMuted;
    });
}

function updateAllMusicVolume() {
    const bgmElements = document.querySelectorAll('audio[loop]');
    bgmElements.forEach(audio => {
        audio.muted = isMusicMuted;
    });
}

const tracks = [
    document.getElementById("bgm-festive_mixtape"),
    document.getElementById("bgm-creme_brulee")
];

let currentTrackIndex = 0;

function playNextTrack() {
    const currentTrack = tracks[currentTrackIndex];
    currentTrack.currentTime = 0;
    currentTrack.volume = 0.85;
    currentTrack.play();

    currentTrack.onended = () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        playNextTrack();
    };
}

let musicPlaying = false;
$(document).on('click', function () {
    if (!musicPlaying) {
        musicPlaying = true;
        playNextTrack();
    }
});

const button_click_sfx = document.getElementById("button_click");
const button_click_soft_sfx = document.getElementById("button_click_soft");
const drop_sfx = document.getElementById("drop");
const applause_sfx = document.getElementById("applause");

$(document).ready(function() {
    $('button').on('click', function() {
        const sfx = button_click_sfx.cloneNode(true);
        sfx.volume = 0.33;
        sfx.muted = isSoundMuted;
        sfx.play();
    });
});

$('.mute-sound-btn').on('click', function() {
    toggleMuteAllSounds();
    updateMuteButtonUI($(this), isSoundMuted);
});

$('.mute-music-btn').on('click', function() {
    toggleMuteMusic();
    updateMuteButtonUI($(this), isMusicMuted);
});

function updateMuteButtonUI($button, isActive) {
    const $img = $button.find('img');
    if ($button.hasClass('mute-sound-btn')) {
        if (isActive) {
            $img.attr('src', 'assets/images/volume-mute.png');
        } else {
            $img.attr('src', 'assets/images/volume.png');
        }
    } else {
        if (isActive) {
            $img.attr('src', 'assets/images/music-slash.png');
        } else {
            $img.attr('src', 'assets/images/music.png');
        }
    }
}
