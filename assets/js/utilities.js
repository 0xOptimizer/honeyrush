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
        const _this = this;
        const group = $(this).data('group');

        $(this).find('.tewi-large-btn-icon').animate({
            left: '+=1250',
            duration: 75,                                            
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        });

        setTimeout(function() {
            $('.container-groups').fadeOut('fast');
        }, 85);
        setTimeout(function() {
            $(`.container-groups[data-group="${group}"]`).fadeIn('fast');
            $('.navigate-btn').attr('disabled', false);
            current_page = 1;
            $('.page-groups').hide();
            $(`.container-groups[data-group="${group}"]`).find(`.page-groups[data-page="${current_page}"]`).fadeIn('fast');
            $(_this).find('.tewi-large-btn-icon').animate({
                left: '-=1250',
                duration: 0
            });
            paginateUpdate(`.container-groups[data-group="${group}"]`);
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
            id: "customModal",
            css: {
                display: "none",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
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
                    width: "400px",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                    textAlign: "center",
                    transition: "transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)"
                }
            }).append(
                $("<h2>", { text: "How to Play!", css: { margin: "0 0 10px" } })
            ).append(
                $("<img>", { src: "assets/images/how_to_play.png" })
            ).append(
                $("<p>", { text: "Group 3 tiles in a triangle to score sweet points!", css: "font-size: 18px;"})
            ).append(
                $("<button>", {
                    id: "closeModal",
                    text: "Okay, let's go!",
                    css: {
                        padding: "10px 20px",
                        background: "#ff4081",
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
    function showModal() {
        const modalContent = $("#customModal div");
        $("#customModal").fadeIn(300); // Background fades in
        modalContent.css("transform", "translate(-50%, -50%) scale(0.8)"); // Start with a small scale
        setTimeout(() => {
            modalContent.css("transform", "translate(-50%, -50%) scale(1)"); // Expand to full size
        }, 10);
    }

    // Function to close the modal with animation
    function closeModal() {
        const modalContent = $("#customModal div");
        modalContent.css("transform", "translate(-50%, -50%) scale(0.8)"); // Shrink effect
        $("#customModal").fadeOut(300); // Background fades out after shrink
    }

    // Bind the modal show and close events
    $("#customModal").on("click", function (e) {
        if (e.target === this) closeModal(); // Close when clicking outside the modal content
    });

    $("#closeModal").on("click", closeModal);

    // Trigger the modal
    $(".how_to_play-btn").on("click", showModal);

});