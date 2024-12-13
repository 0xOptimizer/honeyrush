let current_page = 0;
function paginateUpdate(container) {
    if (!container) {
        return;
    }

    $(container).find('.paginate-current-page').text(current_page);
    $(container).find('.paginate-continue-btn').show();
    $(container).find('.paginate-finish-btn').hide();

    let max_page = 0;
    $(container).find('.page-groups').each(function(e) {
        max_page++;
    });
    $(container).find('.paginate-max-page').text(max_page);
};
$(document).ready(function() {
    $(document).on('click', '.navigate-btn', function() {
        $('.navigate-btn').attr('disabled', true);
        const group = $(this).data('group');

        setTimeout(function() {
            $('.container-groups').fadeOut('fast');
        }, 85);
        setTimeout(function() {
            $(`.container-groups[data-group="${group}"]`).fadeIn('fast');
            $('.navigate-btn').attr('disabled', false);
            $(`.container-groups[data-group="${group}"]`).find(`.page-groups[data-page="${current_page}"]`).fadeIn('fast');
        }, 300);
    });
    $('.paginate-btn').on('click', function() {
        // $('.paginate-btn').attr('disabled', true);
        $(this).blur();
        const _this = this;
        const step = $(this).data('step');
        current_page += step;

        let max_page = 0;
        $(_this).closest('.container-groups').find('.page-groups').each(function(e) {
            max_page++;
        });

        console.table('current_page', current_page);
        console.table('max_page', max_page);
        console.log(current_page == max_page - 1);

        if (current_page > 0) {
            setTimeout(function() {
                $('.page-groups').hide();
                $(_this).closest('.container-groups').find(`.page-groups[data-page="${current_page}"]`).fadeIn('fast');
                // $('.paginate-btn').attr('disabled', false);

                if (current_page == max_page) {
                    $(_this).closest('.container-groups').find('.paginate-continue-btn').hide();
                    $(_this).closest('.container-groups').find('.paginate-finish-btn').show();
                } else {
                    paginateUpdate($(_this).closest('.container-groups'));
                }
            }, 75);
        } else {
            setTimeout(function() {
                $('.container-groups').hide();
                $(`.container-groups[data-group="home"]`).fadeIn('fast');
                $('.navigate-btn').attr('disabled', false);
                // $('.paginate-btn').attr('disabled', false);
            }, 75);
        }
    });
    
    // Create and append the modal structure using jQuery
    $("body").append(
        $("<div>", {
            id: "how_to_play",
            css: {
                display: "none",
                position: "fixed",
                top: 0,
                left: 0,
                width: "95%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 9999
            }
        }).append(
            $("<div>", {
                css: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(0.8)",
                    background: "white",
                    width: "100%",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                    fontFamily: "Bunny",
                    textAlign: "center",
                    transition: "transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)"
                }
            }).append(
                $("<h2>", { text: "How to Play!", css: { margin: "0 0 12px", fontSize: "48px" } })
            ).append(
                $("<img>", { src: "assets/images/how_to_play.png" })
            ).append(
                $("<p>", { text: "Tap tiles to switch position;", css: { fontSize: "24px", fontFamily: "Mont", marginTop: "12px" }})
            ).append(
                $("<p>", { text: "Group 3 tiles in a triangle to score sweet points!", css: { fontSize: "24px", fontFamily: "Mont" }})
            ).append(
                $("<button>", {
                    id: "closePlayModal",
                    text: "Okay, let's go!",
                    css: {
                        marginTop: "16px",
                        padding: "10px 20px",
                        background: "#ff4081",
                        fontSize: "24px",
                        fontFamily: "Mont",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }
                })
            )
        )
    );
    $("body").append(
        $("<div>", {
            id: "how_to_powerup",
            css: {
                display: "none",
                position: "fixed",
                top: 0,
                left: 0,
                width: "95%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 9999
            }
        }).append(
            $("<div>", {
                css: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(0.8)",
                    background: "white",
                    width: "100%",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                    fontFamily: "Bunny",
                    textAlign: "center",
                    transition: "transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)"
                }
            }).append(
                $("<h2>", { text: "Powerups!!", css: { margin: "0 0 12px", fontSize: "48px" } })
            ).append(
                $("<img>", { src: "assets/images/how_to_powerup.png", css: { marginLeft: "-10px" } })
            ).append(
                $("<p>", { text: "Tap powerups to activate their effects!", css: { fontSize: "24px", fontFamily: "Mont" }})
            ).append(
                $("<p>", { text: "Angries explode, gifts give!", css: { fontSize: "24px", fontFamily: "Mont" }})
            ).append(
                $("<button>", {
                    id: "closePowerupModal",
                    text: "Okay, let's go!",
                    css: {
                        marginTop: "16px",
                        padding: "10px 20px",
                        background: "#ff4081",
                        fontSize: "24px",
                        fontFamily: "Mont",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }
                })
            )
        )
    );
    $("body").append(
        $("<div>", {
            id: "credits_screen",
            css: {
                display: "none",
                position: "fixed",
                top: 0,
                left: 0,
                width: "95%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 9999
            }
        }).append(
            $("<div>", {
                css: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) scale(0.8)",
                    background: "white",
                    width: "100%",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                    fontFamily: "Bunny",
                    textAlign: "center",
                    transition: "transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)"
                }
            }).append(
                $("<h2>", { text: "Credits!", css: { margin: "0 0 12px", fontSize: "48px" } })
            ).append(
                $("<p>", { text: "Made by Harlene and Joshua", css: { fontSize: "24px", fontFamily: "Mont" }})
            ).append(
                $("<p>", { text: "-----", css: { fontSize: "24px", fontFamily: "Mont" }})
            ).append(
                $("<p>", { text: "-----", css: { fontSize: "24px", fontFamily: "Mont" }})
            ).append(
                $("<button>", {
                    id: "closePowerupModal",
                    text: "Take me back",
                    css: {
                        marginTop: "16px",
                        padding: "10px 20px",
                        background: "#ff4081",
                        fontSize: "24px",
                        fontFamily: "Mont",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }
                })
            )
        )
    );

    // Function to show the modal with animation
    function showPlayModal() {
        const modalContent = $("#how_to_play div");
        $("#how_to_play").fadeIn(300); // Background fades in
        modalContent.css("transform", "translate(-50%, -50%) scale(0.8)"); // Start with a small scale
        setTimeout(() => {
            modalContent.css("transform", "translate(-50%, -50%) scale(1)"); // Expand to full size
        }, 10);
    }
    function showPowerupModal() {
        const modalContent = $("#how_to_powerup div");
        $("#how_to_powerup").fadeIn(300); // Background fades in
        modalContent.css("transform", "translate(-50%, -50%) scale(0.8)"); // Start with a small scale
        setTimeout(() => {
            modalContent.css("transform", "translate(-50%, -50%) scale(1)"); // Expand to full size
        }, 10);
    }

    // Function to close the modal with animation
    function closePlayModal() {
        const modalContent = $("#how_to_play div");
        modalContent.css("transform", "translate(-50%, -50%) scale(0.8)"); // Shrink effect
        $("#how_to_play").fadeOut(300); // Background fades out after shrink
    }
    function closePowerupModal() {
        const modalContent = $("#how_to_powerup div");
        modalContent.css("transform", "translate(-50%, -50%) scale(0.8)"); // Shrink effect
        $("#how_to_powerup").fadeOut(300); // Background fades out after shrink
    }

    // Bind the modal show and close events
    $("#how_to_play").on("click", function (e) {
        if (e.target === this) closePlayModal(); // Close when clicking outside the modal content
    });
    $("#how_to_powerup").on("click", function (e) {
        if (e.target === this) closePowerupModal(); // Close when clicking outside the modal content
    });

    $("#closePlayModal").on("click", closePlayModal);
    $("#closePowerupModal").on("click", closePowerupModal);

    // Trigger the modal
    $(".how_to_play-btn").on("click", showPlayModal);
    $(".how_to_powerup-btn").on("click", showPowerupModal);

});