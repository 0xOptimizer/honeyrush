function createFloatingText(text, x, y, options) {
    console.log(`createFloatingText: ${text}`);
    // Default settings below!
    const settings = $.extend({
        color: "#fff",
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
        duration: 500,
        fadeOut: true,
        fadeOutDuration: 125,
        direction: "up" // Options: "up", "down", "left", "right", "none"
    }, options);

    const $floatingText = $("<div></div>")
        .addClass('text-outlined')
        .html(text)
        .css({
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            color: settings.color,
            fontSize: settings.fontSize,
            fontFamily: settings.fontFamily,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0,
            transform: "translateY(0)",
            transition: `opacity 300ms cubic-bezier(0.4, 0, 1, 1.5), transform ${settings.duration}ms cubic-bezier(0.0, 0, 0.2, 1)`
        });

    $("body").append($floatingText);

    // Determine movement based on direction
    let transform;
    switch (settings.direction) {
        case "down":
            transform = "translateY(50px)";
            break;
        case "left":
            transform = "translateX(-50px)";
            break;
        case "right":
            transform = "translateX(50px)";
            break;
        case "up":
            transform = "translateY(-50px)";
            break;
        default:

    }

    // Trigger the animation after appending
    setTimeout(() => {
        $floatingText.css({
            opacity: 1,
            transform: transform
        });

        setTimeout(() => {
            if (settings.fadeOut) {
                $floatingText.css({
                    opacity: 0
                });

                setTimeout(() => {
                    $floatingText.remove();
                }, settings.fadeOutDuration);
            } else {
                $floatingText.remove();
            }
        }, settings.duration);
    }, 10);
}

$(document).ready(function() {
    let playerPoints = 0;
    let bees = 20;

    const gridWidth = 4;
    const gridHeight = 7;
    const candyData = [
        { color: '#f7a6b6', img: 'assets/images/candy01.png' },
        { color: '#f8bfc6', img: 'assets/images/candy02.png' },
        { color: '#f9d7dd', img: 'assets/images/candy03.png' },
        { color: '#fae0e6', img: 'assets/images/candy04.png' },
        { color: '#EAA221', img: 'assets/images/candy05.png' },
        { color: '#E66E4C', img: 'assets/images/candy06.png' },
        { color: '#E45561', img: 'assets/images/candy07.png' },
        { color: '#E0218C', img: 'assets/images/candy08.png' },
    ];
    const powerupData = [
        { color: 'cyan', img: 'assets/images/powerup01.png', special: 'down' },
        { color: 'cyan', img: 'assets/images/powerup02.png', special: 'refill' },
    ];
    const beeEmojis = [
        { img: 'assets/images/smile_SoulGIE.png', id: 'smile' },
        { img: 'assets/images/love_SoulGIE.png', id: 'love' },
        { img: 'assets/images/cool_SoulGIE.png', id: 'cool' },
        { img: 'assets/images/scared_SoulGIE.png', id: 'scared' },
        { img: 'assets/images/shocked_SoulGIE.png', id: 'shocked' },
        { img: 'assets/images/smirk_SoulGIE.png', id: 'smirk' },
    ];
    const hexSize = 50;
    const hexWidth = Math.sqrt(3) * hexSize;
    const hexHeight = 2 * hexSize;

    var random = Math.random,
    cos = Math.cos,
    sin = Math.sin,
    PI = Math.PI,
    PI2 = PI * 2,
    timer = undefined,
    frame = undefined,
    confetti = [];
    
    var particles = 10,
    spread = 40,
    sizeMin = 3,
    sizeMax = 12 - sizeMin,
    eccentricity = 10,
    deviation = 100,
    dxThetaMin = -.1,
    dxThetaMax = -dxThetaMin - dxThetaMin,
    dyMin = .13,
    dyMax = .18,
    dThetaMin = .4,
    dThetaMax = .7 - dThetaMin;
    
    var colorThemes = [
        function() { return color(200 * random()|0, 200 * random()|0, 200 * random()|0); },
        function() { var black = 200 * random()|0; return color(200, black, black); },
        function() { var black = 200 * random()|0; return color(black, 200, black); },
        function() { var black = 200 * random()|0; return color(black, black, 200); },
        function() { return color(200, 100, 200 * random()|0); },
        function() { return color(200 * random()|0, 200, 200); },
        function() { var black = 256 * random()|0; return color(black, black, black); },
    ];
    
    function color(r, g, b) {
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    
    function interpolation(a, b, t) {
        return (1-cos(PI*t))/2 * (b-a) + a;
    }
    
    var radius = 1/eccentricity, radius2 = radius+radius;
    function createPoisson() {
        var domain = [radius, 1-radius], measure = 1-radius2, spline = [0, 1];
        while (measure) {
            var dart = measure * random(), i, l, interval, a, b, c, d;
            
            for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
                a = domain[i], b = domain[i+1], interval = b-a;
                if (dart < measure+interval) {
                    spline.push(dart += a-measure);
                    break;
                }
                measure += interval;
            }
            c = dart-radius, d = dart+radius;
            
            for (i = domain.length-1; i > 0; i -= 2) {
                l = i-1, a = domain[l], b = domain[i];
                if (a >= c && a < d)
                    if (b > d) domain[l] = d;
                else domain.splice(l, 2);
                else if (a < c && b > c)
                    if (b <= d) domain[i] = c;
                else domain.splice(i, 0, c, d);
            }
            
            for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
                measure += domain[i+1]-domain[i];
        }
        
        return spline.sort();
    }
    
    var $container = $('<div></div>').css({
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '0',
        overflow: 'visible',
        zIndex: '9999'
    });
    
    function Confetto(theme) {
        this.frame = 0;
        this.$outer = $('<div></div>').css({
            position: 'absolute',
            width: (sizeMin + sizeMax * random()) + 'px',
            height: (sizeMin + sizeMax * random()) + 'px',
            perspective: '50px',
            transform: 'rotate(' + (360 * random()) + 'deg)'
        });
        
        this.$inner = $('<div></div>').css({
            width: '100%',
            height: '100%',
            backgroundColor: theme()
        });
        
        this.$outer.append(this.$inner);
        this.axis = 'rotate3D(' + cos(360 * random()) + ',' + cos(360 * random()) + ',0,';
        this.theta = 360 * random();
        this.dTheta = dThetaMin + dThetaMax * random();
        this.x = $(window).width() * random();
        this.y = -deviation;
        this.dx = sin(dxThetaMin + dxThetaMax * random());
        this.dy = dyMin + dyMax * random();
        
        this.$outer.css({
            left: this.x + 'px',
            top: this.y + 'px'
        });
        
        this.splineX = createPoisson();
        this.splineY = [];
        for (var i = 1, l = this.splineX.length-1; i < l; ++i)
            this.splineY[i] = deviation * random();
        this.splineY[0] = this.splineY[l] = deviation * random();
        
        this.update = function(height, delta) {
            this.frame += delta;
            this.x += this.dx * delta;
            this.y += this.dy * delta;
            this.theta += this.dTheta * delta;
            
            var phi = this.frame % 7777 / 7777, i = 0, j = 1;
            while (phi >= this.splineX[j]) i = j++;
            var rho = interpolation(
                this.splineY[i],
                this.splineY[j],
                (phi-this.splineX[i]) / (this.splineX[j]-this.splineX[i])
            );
            phi *= PI2;
            
            this.$outer.css({
                left: this.x + rho * cos(phi) + 'px',
                top: this.y + rho * sin(phi) + 'px',
                transform: this.axis + this.theta + 'deg)'
            });
            
            return this.y > height+deviation;
        };
    }
    
    function startConfetti() {
        if (!frame) {
            $('body').append($container);
            
            var theme = colorThemes[0];
            (function addConfetto() {
                var confetto = new Confetto(theme);
                confetti.push(confetto);
                $container.append(confetto.$outer);
                timer = setTimeout(addConfetto, spread * random());
            })(0);
            
            var prev;
            function loop(timestamp) {
                var delta = prev ? timestamp - prev : 0;
                prev = timestamp;
                var height = $(window).height();
                
                for (var i = confetti.length-1; i >= 0; --i) {
                    if (confetti[i].update(height, delta)) {
                        confetti[i].$outer.remove();
                        confetti.splice(i, 1);
                    }
                }
                
                if (timer || confetti.length)
                    frame = requestAnimationFrame(loop);
                else {
                    $container.remove();
                    frame = undefined;
                }
            }
            
            frame = requestAnimationFrame(loop);
        }
    }
    
    function stopConfetti() {
        clearTimeout(timer);
        timer = undefined;
    }

    function createGrid() {
        const grid = $('#grid');
        let delay = 500;
        let maxDelay = 0;
    
        for (let row = 0; row < gridHeight; row++) {
            for (let col = 0; col < gridWidth; col++) {
                let candyInfo = getRandomCandy();
                let candy = $('<div></div>')
                    .addClass('candy')
                    .attr('data-row', row)
                    .attr('data-col', col)
                    .data('candy', candyInfo)
                    .css({
                        'background-color': candyInfo.color,
                        'position': 'absolute',
                        'left': (col * hexWidth) + (row % 2 * hexWidth * 0.5),
                        'top': '-100px',
                        'opacity': 0
                    })
                    .append(`<img src="${candyInfo.img}" alt="${candyInfo.color}">`);
    
                grid.append(candy);
    
                setTimeout(() => {
                    candy.animate(
                        {
                            top: row * (hexHeight * 0.75),
                            opacity: 1
                        },
                        {
                            duration: 175,
                            easing: 'easeOutCubic',
                            queue: false
                        }
                    );
                    setTimeout(() => {
                        const sfx = drop_sfx.cloneNode(true);
                        sfx.volume = 0.33;
                        sfx.muted = isSoundMuted;
                        sfx.play();
                    }, 175);
                }, delay);
    
                maxDelay = delay;
                delay += 33;
            }
        }
    
        setTimeout(() => {
            if (!localStorage.getItem("has_viewed_tutorial_play")) {
                $('.how_to_play-btn').trigger('click');
            }
            localStorage.setItem("has_viewed_tutorial_play", true);
        }, maxDelay + 333);
    }

    function getRandomCandy() {
        return candyData[Math.floor(Math.random() * candyData.length)];
    }

    function getRandomPowerup() {
        setTimeout(() => {
            if (!localStorage.getItem("has_viewed_tutorial_powerup")) {
                $('.how_to_powerup-btn').trigger('click');
            }
            localStorage.setItem("has_viewed_tutorial_powerup", true);
        }, 750);
        return powerupData[Math.floor(Math.random() * powerupData.length)];
    }
    function updateBeeEmoji() {
        const emoji = beeEmojis[Math.floor(Math.random() * beeEmojis.length)];
        $('.bee-emoji').attr('src', emoji.img);

        return true;
    }

    function updateTile(tile, candy) {
        $(tile).data('candy', candy);
        $(tile).data('special', candy.special || null);
        $(tile).css('background-color', candy.color);
        $(tile).find('img').attr('src', candy.img).attr('alt', candy.color);
    }    

    function swapTiles(first, second) {
        const firstCandy = $(first).data('candy');
        const secondCandy = $(second).data('candy');

        updateTile(first, secondCandy);
        updateTile(second, firstCandy);
    }

    function updatePoints(amount) {
        playerPoints += amount;
        $('.points').text(playerPoints);
    }

    function checkBees() {
        $('.bees').text(bees.toString());
        setTimeout(function() {
            if (bees <= 0) {
                setTimeout(function() {
                    $('.container-groups').fadeOut('fast');
                }, 85);
                setTimeout(function() {
                    $(`.container-groups[data-group="save"]`).show();
                    $('.navigate-btn').attr('disabled', false);
                    $('.page-groups').hide();
                    paginateUpdate(`.container-groups[data-group="save"]`);

                    $(`.container-groups[data-group="save"]`).animate(
                        {
                            top: 0
                        },
                        {
                            duration: 333,
                            easing: 'easeOutCubic',
                            queue: false
                        }
                    );
                }, 500);
            }
        }, 400);
    }

    function activatePowerup(tile, special) {
        let points = 0;

        updateBeeEmoji();

        if (special === 'down') {
            const row = parseInt(tile.data('row'));
            const col = parseInt(tile.data('col'));
    
            for (let r = row + 1; r < gridHeight; r++) {
                const belowTile = $(`[data-row=${r}][data-col=${col}]`);
                if (belowTile.length) {
                    const tileOffset = belowTile.offset();
                    const x = tileOffset.left + 25;
                    const y = tileOffset.top + 50;
                    const x_ex = tileOffset.left - 10;
                    const y_ex = tileOffset.top - 10;
    
                    setTimeout(() => {
                        points += 50;
                        updatePoints(points);
                        
                        createFloatingText(`<img src="assets/images/smoke_vectorsmarket15.png" width="128" height="128">`, x_ex, y_ex, {direction: "none"});
                        createFloatingText(`+${points.toString()}`, x, y);

                        const sfx = button_click_soft_sfx.cloneNode(true);
                        sfx.volume = 0.33;
                        sfx.muted = isSoundMuted;
                        sfx.play();
    
                        belowTile.fadeOut(300, function () {
                            updateTile(belowTile, getRandomCandy());
                            belowTile.fadeIn(75);
                        });
                    }, (r - row) * 150); // Delay for sequential effect
                }
            }
        }
        if (special === 'refill') {
            const tileOffset = tile.offset();
            const x = tileOffset.left + 25;
            const y = tileOffset.top + 50;

            createFloatingText(`+1 Move!`, x, y);
            bees += 1;
            checkBees();
        }
    }    

    function checkMatches() {
        let matched = false;
        let matchedTiles = [];

        let points = 0;

        for (let row = 0; row < gridHeight; row++) {
            for (let col = 0; col < gridWidth; col++) {
                const centerCandy = $(`[data-row=${row}][data-col=${col}]`);

                // Skip the tile if it has already been matched
                if (matchedTiles.includes(centerCandy[0])) continue;

                const centerColor = centerCandy.data('candy');

                // Check if there is a neighboring tile to the left or right with the same color
                let neighbor = null;
                let neighborCol = -1;
                let isLeftNeighbor = false;
                if (col > 0 && $(`[data-row=${row}][data-col=${col - 1}]`).data('candy') === centerColor) {
                    // Left neighbor matches
                    neighbor = $(`[data-row=${row}][data-col=${col - 1}]`);
                    neighborCol = col - 1;
                    isLeftNeighbor = true;
                } else if (col < gridWidth - 1 && $(`[data-row=${row}][data-col=${col + 1}]`).data('candy') === centerColor) {
                    // Right neighbor matches
                    neighbor = $(`[data-row=${row}][data-col=${col + 1}]`);
                    neighborCol = col + 1;
                }

                // If no neighbor matches, continue to the next tile
                if (!neighbor) continue;

                // Mark the current tile as A, and the neighbor tile as B
                let A;
                let B;
                if (isLeftNeighbor) {
                    A = neighbor;
                    B = centerCandy;   
                } else {
                    A = centerCandy;
                    B = neighbor;   
                }

                const isOddRow = row % 2 === 1;
                
                // If the row is odd, check the color above or below A
                if (isOddRow) {
                    const aboveA = $(`[data-row=${row - 1}][data-col=${neighborCol}]`);
                    const belowA = $(`[data-row=${row + 1}][data-col=${col}]`);

                    if (aboveA.length && aboveA.data('candy') === centerColor) {
                        matched = true;
                        matchedTiles.push(A[0], B[0], aboveA[0]);
                        [A, B, aboveA].forEach(tile => {
                            const tileBGColor = $(tile).css('background-color');
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            updateBeeEmoji();

                            let newCandy;
                            let isPowerup = false;
                            if (Math.random() <= 0.13) {
                                newCandy = getRandomPowerup();
                                isPowerup = true;
                            } else {
                                newCandy = getRandomCandy();
                            }
                            console.table('tile', tile);
                            if (tile.data('special')) {
                                console.table('tile.special', tile.data('special'));
                                // activatePowerup(tile, tile.special);
                            }
                            tile.fadeOut(300, function () {
                                updateTile(tile, newCandy);
                                if (isPowerup) {
                                    createFloatingText(`Special!`, x, y);
                                }
                                tile.fadeIn(75);
                            });
                        });
                        continue; // If a match is found, no need to check further
                    }

                    if (belowA.length && belowA.data('candy') === centerColor) {
                        matched = true;
                        matchedTiles.push(A[0], B[0], belowA[0]);
                        [A, B, belowA].forEach(tile => {
                            const tileBGColor = $(tile).css('background-color');
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            updateBeeEmoji();

                            let newCandy;
                            let isPowerup = false;
                            if (Math.random() <= 0.13) {
                                newCandy = getRandomPowerup();
                                isPowerup = true;
                            } else {
                                newCandy = getRandomCandy();
                            }
                            console.table('tile', tile);
                            if (tile.data('special')) {
                                console.table('tile.special', tile.data('special'));
                                // activatePowerup(tile, tile.special);
                            }
                            tile.fadeOut(300, function () {
                                updateTile(tile, newCandy);
                                if (isPowerup) {
                                    createFloatingText(`Special!`, x, y);
                                }
                                tile.fadeIn(75);
                            });
                        });
                        continue; // If a match is found, no need to check further
                    }
                } else {
                    // If the row is even, check the color above or below B
                    const aboveB = $(`[data-row=${row - 1}][data-col=${neighborCol}]`);
                    const belowB = $(`[data-row=${row + 1}][data-col=${neighborCol}]`);

                    if (aboveB.length && aboveB.data('candy') === neighbor.data('candy')) {
                        matched = true;
                        matchedTiles.push(A[0], B[0], aboveB[0]);
                        [A, B, aboveB].forEach(tile => {
                            const tileBGColor = $(tile).css('background-color');
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            updateBeeEmoji();

                            let newCandy;
                            let isPowerup = false;
                            if (Math.random() <= 0.13) {
                                newCandy = getRandomPowerup();
                                isPowerup = true;
                            } else {
                                newCandy = getRandomCandy();
                            }
                            console.table('tile', tile);
                            if (tile.data('special')) {
                                console.table('tile.special', tile.data('special'));
                                // activatePowerup(tile, tile.special);
                            }
                            tile.fadeOut(300, function () {
                                updateTile(tile, newCandy);
                                if (isPowerup) {
                                    createFloatingText(`Special!`, x, y);
                                }
                                tile.fadeIn(75);
                            });
                        });
                        continue; // If a match is found, no need to check further
                    }

                    if (belowB.length && belowB.data('candy') === neighbor.data('candy')) {
                        matched = true;
                        matchedTiles.push(A[0], B[0], belowB[0]);
                        [A, B, belowB].forEach(tile => {
                            const tileBGColor = $(tile).css('background-color');
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            updateBeeEmoji();

                            let newCandy;
                            let isPowerup = false;
                            if (Math.random() <= 0.13) {
                                newCandy = getRandomPowerup();
                                isPowerup = true;
                            } else {
                                newCandy = getRandomCandy();
                            }
                            console.table('tile', tile);
                            if (tile.data('special')) {
                                console.table('tile.special', tile.data('special'));
                                // activatePowerup(tile, tile.special);
                            }
                            tile.fadeOut(300, function () {
                                updateTile(tile, newCandy);
                                if (isPowerup) {
                                    createFloatingText(`Special!`, x, y);
                                }
                                tile.fadeIn(75);
                            });
                        });
                        continue; // If a match is found, no need to check further
                    }
                }
            }
        }
        
        return matched;
    }

    let selectedTile = null;

    $('#grid').on('click', '.candy', function() {
        const _this = $(this);
        if ($(this).data('special')) {
            const tileOffset = $(this).offset();
            const x = tileOffset.left - 10;
            const y = tileOffset.top - 10;

            newCandy = getRandomCandy();

            if ($(this).data('special') === 'down') {
                createFloatingText(`<img src="assets/images/smoke_vectorsmarket15.png" width="128" height="128">`, x, y, {direction: "none"});
                activatePowerup(_this, _this.data('special'));

                _this.fadeOut(300, function () {
                    updateTile(_this, newCandy);
                    _this.fadeIn(300);
                });
            } else {
                activatePowerup($(this), $(this).data('special'));

                $(this).fadeOut(300, function () {
                    updateTile($(this), newCandy);
                    $(this).fadeIn(300);
                });
            }
            return;
        }
        if (!selectedTile) {
            selectedTile = this;
            $(this).addClass('selected');

            const sfx = button_click_soft_sfx.cloneNode(true);
            sfx.volume = 0.33;
            sfx.muted = isSoundMuted;
            sfx.play();
        } else {
            if (selectedTile !== this) {
                swapTiles(selectedTile, this);
            }

            if (checkMatches()) {
                const sfx = button_click_sfx.cloneNode(true);
                sfx.volume = 0.33;
                sfx.muted = isSoundMuted;
                sfx.play();
            } else {
                const sfx = button_click_soft_sfx.cloneNode(true);
                sfx.volume = 0.33;
                sfx.muted = isSoundMuted;
                sfx.play();
            }

            $(selectedTile).removeClass('selected');
            selectedTile = null;

            bees -= 1;
            checkBees();
        }
    });

    function repopulateLeaderboard() {
        let player_ids = localStorage.getItem('leaderboard_id');
    
        // Ensure compatibility with old single-ID entries
        if (player_ids) {
            try {
                player_ids = JSON.parse(player_ids);
                if (!Array.isArray(player_ids)) {
                    player_ids = [player_ids];
                }
            } catch (e) {
                player_ids = [player_ids];
            }
        } else {
            player_ids = [];
        }
        
        let leaderboard_count = 0;
        $.ajax({
            url: 'https://honeyrush-api.tewi.club/api/score/get',
            type: 'GET',
            success: function(response) {
                // Sort the scores by points in descending order
                response.sort((a, b) => b.points - a.points);
                
                // Get the leaderboard container
                const leaderboardList = $('.leaderboard-list');
                leaderboardList.empty(); // Clear existing list
                
                // Populate with new data
                response.forEach(i => {
                    leaderboard_count++;
                    if (leaderboard_count > 10) {
                        return;
                    }
                
                    let truncatedName = i.name;
                    if (truncatedName.length > 16) {
                        truncatedName = truncatedName.substring(0, 13) + '...';
                    }
                
                    const row = leaderboardList.append(
                        `<li data-id="${i.id}">
                            ${truncatedName}: <span class="player-score">${i.points}</span>
                        </li>`
                    );
                
                    if (player_ids.includes(i.id)) {
                        row.find(`li[data-id="${i.id}"]`).css('background-color', '#a3fff5');
                    }
                });                
            },
            error: function(xhr) {
                console.error('Error fetching leaderboard data:', xhr.responseText);
            }
        });
    }

    $(document).on('click', '.submit_score-btn', function() {
        const _this = this;
        const name = $('input[name="name"]').val();
        $(_this).attr('disabled', true);
        $(_this).html('<span class="text-outlined">Submitting...</span>');
        $.ajax({
            url: 'https://honeyrush-api.tewi.club/api/score/submit', 
            type: 'POST',
            data: { 
                name: name,
                points: playerPoints
             },
            success: function(response) {
                console.log('Score submitted successfully:', response);
                let player_ids = localStorage.getItem('leaderboard_id');

                try {
                    player_ids = JSON.parse(player_ids);
                    if (!Array.isArray(player_ids)) {
                        player_ids = [player_ids];
                    }
                } catch (e) {
                    player_ids = [player_ids];
                }

                if (!player_ids.includes(response.id)) {
                    player_ids.push(response.id);
                }

                localStorage.setItem('leaderboard_id', JSON.stringify(player_ids));
                
                setTimeout(function() {
                    const sfx = applause_sfx.cloneNode(true);
                    sfx.volume = 0.55;
                    sfx.muted = isSoundMuted;
                    sfx.play();
                }, 300);
                setTimeout(function() {
                    $(_this).html('<span class="text-outlined">Submitted!</span>');
                    $('.save-img').attr('src', 'assets/images/hi_SoulGIE.png').addClass('hi_there');
                    
                    startConfetti();
                }, 750);
                setTimeout(function() {
                    $(_this).attr('disabled', false);
                    $(_this).html('<span class="text-outlined">Main Menu</span>');
                    $(_this).removeClass('submit_score-btn').addClass('navigate-btn').attr('data-group', 'start');
                }, 2000);
                // setTimeout(function() {
                //     $('.container-groups').fadeOut('fast');
                // }, 85);
                // setTimeout(function() {
                //     $(`.container-groups[data-group="start"]`).fadeIn('fast');
                //     $('.navigate-btn').attr('disabled', false);
                //     $('.page-groups').hide();
                //     paginateUpdate(`.container-groups[data-group="start"]`);
                // }, 300);

                repopulateLeaderboard();
            },
            error: function(xhr) {
                console.error('Submission failed:', xhr.responseText);
            }
        });
        
    });

    $(document).on('click', '.navigate-btn[data-group="game"]', function() {
        $('#grid').html('');
        
        createGrid();
        stopConfetti();

        playerPoints = 0;
        bees = 20;
        $('.points').text(playerPoints.toString());
        checkBees();

        $('.save-screen-btn').removeClass('navigate-btn').addClass('submit_score-btn');
    });
    repopulateLeaderboard();
});  