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
    $('.navigate-btn').on('click', function() {
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
        }, 145);
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
});