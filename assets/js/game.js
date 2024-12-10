function createFloatingText(text, x, y, options) {
    console.log(`createFloatingText: ${text}`);
    // Default settings below!
    const settings = $.extend({
        color: "#000000",
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        duration: 500,
        fadeOut: true,
        fadeOutDuration: 125,
        direction: "up" // Options: "up", "down", "left", "right", "none"
    }, options);

    const $floatingText = $("<div></div>")
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
    const gridHeight = 6;
    const candyData = [
        { color: '#f7a6b6', img: 'assets/images/candy01.png' },
        { color: '#f8bfc6', img: 'assets/images/candy02.png' },
        { color: '#f9d7dd', img: 'assets/images/candy03.png' },
        { color: '#fae0e6', img: 'assets/images/candy04.png' },
        { color: '#EAA221', img: 'assets/images/candy05.png' },
        // { color: '#E66E4C', img: 'assets/images/candy06.png' },
        // { color: '#E45561', img: 'assets/images/candy07.png' },
        // { color: '#E0218C', img: 'assets/images/candy08.png' },
    ];
    const powerupData = [
        { color: 'cyan', img: 'assets/images/powerup01.png', special: 'down' },
        { color: 'cyan', img: 'assets/images/powerup02.png', special: 'refill' },
    ];
    const hexSize = 50;
    const hexWidth = Math.sqrt(3) * hexSize;
    const hexHeight = 2 * hexSize;

    function createGrid() {
        const grid = $('#grid');
        for (let row = 0; row < gridHeight; row++) {
            for (let col = 0; col < gridWidth; col++) {
                let candyInfo = getRandomCandy();
                let candy = $('<div></div>')
                    .addClass('candy')
                    .attr('data-row', row)
                    .attr('data-col', col)
                    .data('candy', candyInfo)
                    .css('background-color', candyInfo.color)
                    .css({
                        'left': (col * hexWidth) + (row % 2 * hexWidth * 0.5),
                        'top': row * (hexHeight * 0.75)
                    })
                    .append(`<img src="${candyInfo.img}" alt="${candyInfo.color}">`);
                grid.append(candy);
                // candy = $('<div></div>')
                //     .addClass('candy')
                //     .attr('data-row', row)
                //     .attr('data-col', col)
                //     .data('candy', candyInfo)
                //     .css('background-color', candyInfo.color)
                //     .css({
                //         'left': (col * hexWidth) +  750,
                //         'top': row * (hexHeight * 0.75)
                //     })
                //     .append(`<img src="${candyInfo.img}" alt="${candyInfo.color}">`);
                // grid.append(candy);
            }
        }
    }

    function getRandomCandy() {
        return candyData[Math.floor(Math.random() * candyData.length)];
    }

    function getRandomPowerup() {
        return powerupData[Math.floor(Math.random() * powerupData.length)];
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
                    $(`.container-groups[data-group="save"]`).fadeIn('fast');
                    $('.navigate-btn').attr('disabled', false);
                    $('.page-groups').hide();
                    paginateUpdate(`.container-groups[data-group="save"]`);
                }, 300);
            }
        }, 400);
    }

    function activatePowerup(tile, special) {
        let points = 0;

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
    
                        belowTile.fadeOut(300, function () {
                            updateTile(belowTile, getRandomCandy());
                            belowTile.fadeIn(300);
                        });
                    }, (r - row) * 500); // Delay for sequential effect
                }
            }
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
                        let candyCounter = 0;

                        matched = true;
                        matchedTiles.push(A[0], B[0], aboveA[0]);
                        [A, B, aboveA].forEach(tile => {
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            candyCounter++;
                            let newCandy;
                            let isPowerup = false;
                            if (candyCounter === 3) {
                                newCandy = getRandomPowerup();
                                candyCounter = 0;
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
                                    createFloatingText(`Special powerup!`, x, y);
                                }
                                tile.fadeIn(300);
                            });
                        });
                        continue; // If a match is found, no need to check further
                    }

                    if (belowA.length && belowA.data('candy') === centerColor) {
                        let candyCounter = 0;

                        matched = true;
                        matchedTiles.push(A[0], B[0], belowA[0]);
                        [A, B, belowA].forEach(tile => {
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            candyCounter++;
                            let newCandy;
                            let isPowerup = false;
                            if (candyCounter === 3) {
                                newCandy = getRandomPowerup();
                                candyCounter = 0;
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
                                    createFloatingText(`Special powerup!`, x, y);
                                }
                                tile.fadeIn(300);
                            });
                        });
                        continue; // If a match is found, no need to check further
                    }
                } else {
                    // If the row is even, check the color above or below B
                    const aboveB = $(`[data-row=${row - 1}][data-col=${neighborCol}]`);
                    const belowB = $(`[data-row=${row + 1}][data-col=${neighborCol}]`);

                    if (aboveB.length && aboveB.data('candy') === neighbor.data('candy')) {
                        let candyCounter = 0;

                        matched = true;
                        matchedTiles.push(A[0], B[0], aboveB[0]);
                        [A, B, aboveB].forEach(tile => {
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            candyCounter++;
                            let newCandy;
                            let isPowerup = false;
                            if (candyCounter === 3) {
                                newCandy = getRandomPowerup();
                                candyCounter = 0;
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
                                    createFloatingText(`Special powerup!`, x, y);
                                }
                                tile.fadeIn(300);
                            });
                        });
                        continue; // If a match is found, no need to check further
                    }

                    if (belowB.length && belowB.data('candy') === neighbor.data('candy')) {
                        let candyCounter = 0;

                        matched = true;
                        matchedTiles.push(A[0], B[0], belowB[0]);
                        [A, B, belowB].forEach(tile => {
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            candyCounter++;
                            let newCandy;
                            let isPowerup = false;
                            if (candyCounter === 3) {
                                newCandy = getRandomPowerup();
                                candyCounter = 0;
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
                                    createFloatingText(`Special powerup!`, x, y);
                                }
                                tile.fadeIn(300);
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
            sfx.play();
        } else {
            if (selectedTile !== this) {
                swapTiles(selectedTile, this);
            }

            const sfx = button_click_sfx.cloneNode(true);
            sfx.volume = 0.33;
            sfx.play();

            checkMatches()
            $(selectedTile).removeClass('selected');
            selectedTile = null;

            bees -= 1;
            checkBees();
        }
    });

    function repopulateLeaderboard() {
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
                response.forEach(player => {
                    leaderboardList.append(
                        `<li>${player.name}: <span class="player-score">${player.points}</span></li>`
                    );
                });
            },
            error: function(xhr) {
                console.error('Error fetching leaderboard data:', xhr.responseText);
            }
        });
    }    

    $('.submit_score-btn').on('click', function() {
        const name = $('input[name="name"]').val();
        $.ajax({
            url: 'https://honeyrush-api.tewi.club/api/score/submit', 
            type: 'POST',
            data: { 
                name: name,
                points: playerPoints
             },
            success: function(response) {
                console.log('Score submitted successfully:', response);
                setTimeout(function() {
                    $('.container-groups').fadeOut('fast');
                }, 85);
                setTimeout(function() {
                    $(`.container-groups[data-group="start"]`).fadeIn('fast');
                    $('.navigate-btn').attr('disabled', false);
                    $('.page-groups').hide();
                    paginateUpdate(`.container-groups[data-group="start"]`);
                }, 300);

                repopulateLeaderboard();
            },
            error: function(xhr) {
                console.error('Submission failed:', xhr.responseText);
            }
        });
        
    });

    createGrid();
    repopulateLeaderboard();
});