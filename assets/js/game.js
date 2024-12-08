function createFloatingText(text, x, y, options) {
    // Default settings below!
    const settings = $.extend({
        color: "#000000",
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        duration: 500,
        fadeOut: true,
        fadeOutDuration: 125,
        direction: "up" // Options: "up", "down", "left", "right"
    }, options);

    const $floatingText = $("<div></div>")
        .text(text)
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
        default:
            transform = "translateY(-50px)";
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

    const gridWidth = 4;
    const gridHeight = 6;
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
    const hexSize = 50;
    const hexWidth = Math.sqrt(3) * hexSize;
    const hexHeight = 2 * hexSize;

    function createGrid() {
        const grid = $('#grid');
        for (let row = 0; row < gridHeight; row++) {
            for (let col = 0; col < gridWidth; col++) {
                const candyInfo = getRandomCandy();
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

    function updateTile(tile, candy) {
        $(tile).data('candy', candy);
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
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            const newCandy = getRandomCandy();
                            tile.fadeOut(300, function () {
                                updateTile(tile, newCandy);
                                tile.fadeIn(300);
                            });
                        });
                        continue; // If a match is found, no need to check further
                    }

                    if (belowA.length && belowA.data('candy') === centerColor) {
                        matched = true;
                        matchedTiles.push(A[0], B[0], belowA[0]);
                        [A, B, belowA].forEach(tile => {
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            const newCandy = getRandomCandy();
                            tile.fadeOut(300, function () {
                                updateTile(tile, newCandy);
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
                        matched = true;
                        matchedTiles.push(A[0], B[0], aboveB[0]);
                        [A, B, aboveB].forEach(tile => {
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            const newCandy = getRandomCandy();
                            tile.fadeOut(300, function () {
                                updateTile(tile, newCandy);
                                tile.fadeIn(300);
                            });
                        });
                        continue; // If a match is found, no need to check further
                    }

                    if (belowB.length && belowB.data('candy') === neighbor.data('candy')) {
                        matched = true;
                        matchedTiles.push(A[0], B[0], belowB[0]);
                        [A, B, belowB].forEach(tile => {
                            const tileOffset = $(tile).offset();
                            const x = tileOffset.left + 25;
                            const y = tileOffset.top + 50;

                            points += 50;
                            createFloatingText(`+${points.toString()}`, x, y);
                            updatePoints(points);

                            const newCandy = getRandomCandy();
                            tile.fadeOut(300, function () {
                                updateTile(tile, newCandy);
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
        if (!selectedTile) {
            selectedTile = this;
            $(this).addClass('selected');
        } else {
            if (selectedTile !== this) {
                swapTiles(selectedTile, this);
            }

            checkMatches()
            $(selectedTile).removeClass('selected');
            selectedTile = null;
        }
    });

    createGrid();
});