window.onload = function (){
    $('.slider').samSlide({
        hd: '.slider_hd',
        bd: '.slider_bd ul',
        direction: 'vertical'
    });
};

$.fn.samSlide = function (options, callback){
    var defaults={
        slide: $(this),
        hd: '.slider_hd',
        bd: '.slider_bd ul',
        pagination: true,
        direction: 'vertical',
        prevBtn: '.prev',
        nextBtn: '.next',
        duration: 450,
        delay: 3500
    };
    var settings=$.extend({},defaults,options);
    var slider = $(settings.slider),
        hd = $(settings.hd),
        bd = $(settings.bd),
        itemsWrap = bd,
        paginationSwitch = settings.pagination || false,
        prevBtn = hd.find(settings.prevBtn) || hd.find('.slider_hd .prev'),
        nextBtn = hd.find(settings.nextBtn) || hd.find('.slider_hd .next'),
        direction = settings.direction || "horizontal",
        duration = settings.duration,
        delay = settings.delay;

    // option
    var items = bd.find('li');
    var itemWidth = parseInt(items.width());
    var itemHeight = parseInt(items.height());
    var itemLen = items.length;
    var pagination = null;
    var pageItem = null;

    // init slider;
    bd.css({ "left": '0', "top": "0"});

    function createPagination(){
        var i = 0, len = itemLen;
        var pagesStr = '<ul class="pagination">';

        for (; i < len; i++) {
            pagesStr += '<li>' + (i+1) +'</li>';
        }
        pagesStr += '</ul>';
        hd.append(pagesStr);
        pagination = hd.find('.pagination');
        pageItem = pagination.find('li');
        pageItem.eq(0).addClass('active');
    }

    if (paginationSwitch) { createPagination();}

    // *** slider core begin;
    var loopIndex = 0;

    // init slider wrap css direction;
    if ( direction == 'horizontal') {
        bd.find('li').css({"float": "left"});
    } else if (direction == 'vertical') {
        bd.find('li').css({"float": "none"});
    } else {
        bd.find('li').css({"float": "left"});
    }

    function moveNext(){
        ++loopIndex;

        if ( direction == 'horizontal') {
            moveHorizontal();
        } else if (direction == 'vertical') {
            moveVertical();
        } else {
            moveHorizontal();
        }

        function moveHorizontal(){
            if (loopIndex == itemLen) {
                bd.stop().animate({ 'left': 0}, duration);
                loopIndex = 0;
                pageItem.eq(loopIndex).addClass('active').siblings().removeClass('active');
            } else {

                bd.stop().animate({ 'left': -loopIndex * itemWidth + 'px'}, duration);
                pageItem.eq(loopIndex).addClass('active').siblings().removeClass('active');
            }
        }

        function moveVertical(){
            if (loopIndex == itemLen) {
                bd.stop().animate({ 'top': 0}, duration);
                loopIndex = 0;
                pageItem.eq(loopIndex).addClass('active').siblings().removeClass('active');
            } else {

                bd.stop().animate({ 'top': -loopIndex * itemHeight + 'px'}, duration);
                pageItem.eq(loopIndex).addClass('active').siblings().removeClass('active');
            }
        }
    }

    function movePrev(){
        --loopIndex;

        if ( direction == 'horizontal') {
            moveHorizontal();
        } else if (direction == 'vertical') {
            moveVertical();
        } else {
            moveHorizontal();
        }

        function moveHorizontal(){
            if (loopIndex < 0) {

                // if now want to move to last slider, execute below;
                bd.stop().animate({ 'left': -itemWidth * (itemLen - 1) + "px"}, duration);
                loopIndex = itemLen - 1;
                pageItem.eq(loopIndex).addClass('active').siblings().removeClass('active');
                return true;
            } else {
                console.log(loopIndex);
                var nowPosition = parseInt(bd.css('left'));
                bd.stop().animate({ 'left': -itemWidth*loopIndex + 'px'}, duration);
                pageItem.eq(loopIndex).addClass('active').siblings().removeClass('active');
                return true;
            }

            ++loopIndex;
        }

        function moveVertical(){
            if (loopIndex < 0) {

                // if now want to move to last slider, execute below;
                bd.stop().animate({ 'top': -itemHeight * (itemLen - 1) + "px"}, duration);
                loopIndex = itemLen - 1;
                pageItem.eq(loopIndex).addClass('active').siblings().removeClass('active');
                return true;
            } else {
                var nowPosition = parseInt(bd.css('left'));
                bd.stop().animate({ 'top': -loopIndex*itemHeight + 'px'}, duration);
                pageItem.eq(loopIndex).addClass('active').siblings().removeClass('active');
                return true;
            }

            ++loopIndex;
        }
    }

    var sliderTimer = setInterval(moveNext, delay);

    // bind slider button;
    prevBtn.click( function (){
        clearInterval(sliderTimer);
        movePrev();
        sliderTimer = setInterval(moveNext, delay);
    });
    nextBtn.click( function (){
        clearInterval(sliderTimer);
        moveNext();
        sliderTimer = setInterval(moveNext, delay);
    });

    pageItem.each( function (){
        $(this).mouseover( function (){
            clearInterval(sliderTimer);

            var index = parseInt($(this).index());
            if ( direction == 'horizontal') {
                bd.stop().animate({ 'left': -index*itemWidth + 'px'}, duration);
            } else if (direction == 'vertical') {
                bd.stop().animate({ 'top': -index*itemHeight + 'px'}, duration);
            } else {
                bd.stop().animate({ 'left': -index*itemWidth + 'px'}, duration);
            }
            pageItem.eq(index).addClass('active').siblings().removeClass('active');

            sliderTimer = setInterval(moveNext, delay);
        });
    });
}