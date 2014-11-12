$(function (index){
    function pageInit(){
		
		// init tooltips;
		$('.tooltip').tooltipster({});
	
		eleme.unit.topSearchBar();
		eleme.unit.mainBackgroundGo();
	
        // when restaurant item click, open new page with this restaurant's url;
        $('.rest_item_group').on('click', '.rest_item', function (){
            var realHref = $(this).find('a:first').attr('href');
            $('.goToHref').attr('href', realHref);
            $('.goToHref')[0].click();
        });

        // *** my favorite
        $('.m_myFavorite .btn_cancel, .rest_item .favorite').click( function (event){
            event.stopPropagation();
        });
        $('.restaurant_list .rest_item .favorite_off').click( function(){
            $(this).parents('.rest_item').toggleClass('favorite_added')
        });

		// set restaurant item's hover info-panel how to present;
        $('.rest_item_group').on('mouseenter', '.rest_item', function (){
            var that = $(this);
            var itemHover = function(){
                that.find('.rest_hover_info').show();
            };
            var timer = setTimeout(itemHover, 150);

            $('.rest_item_group').on('mouseleave', '.rest_item', function (){
                $(this).find('.rest_hover_info').hide();
                clearTimeout(timer);
            });
        });



        $('.rest_item_group').on('mouseout', '.rest_hover_info', function (){
            $(this).hide();
        });

        // restaurant item's hover info-panel in the narrow screen && items in the bottom rows;
        function itemHoverPanelFix(){
            var windowWidth = window.screen.width;
            if (windowWidth < 1600 && eleme.core.isIE(8)) {
                $('.rest_item:nth-child(5n-1) .rest_hover_info, .rest_item:nth-child(5n) .rest_hover_info')
                    .addClass('narrowScreen');
            }

            var lastRestListGroup = $('.m_lastRestListRow li');
            if (lastRestListGroup.length <= 15){
                $('.m_lastRestListRow .rest_item .rest_hover_info').addClass('bottomHover');
            } else {
                $('.m_lastRestListRow .restaurant_list li:gt(' + (lastRestListGroup.length - 15-1) + ') .rest_hover_info').addClass('bottomHover');
            }
        }
        itemHoverPanelFix();

        /** restaurant category mealType dropdown select */
        $('.mealType').click( function (){
            $(this).addClass('active');
            $('.mealType_bd').show();
            $('.mealType_bd li').click( function (event){
                event.stopPropagation();

                if ($(this).html() != "全部") {
                    $('.mealType .mealType_hd').text($(this).text());
                    $('.m_restCategory').addClass('mealTypeFilter');
                } else {
                    $('.mealType .mealType_hd').text("口味");
                    $('.m_restCategory').removeClass('mealTypeFilter');
                }
                $('.mealType_bd').hide();
                $('.mealType').removeClass('active');
            });
        });
        $('.mealType').mouseout( function (){
            var timer = setTimeout("$('.mealType_bd').hide(); $('.mealType').removeClass('active');", 20);
            $('.mealType *').mouseover( function (){
                clearTimeout(timer);
            });
        });

    }
    pageInit();

    // *** top focus banner;
    $('.m_focus').samSlide({
        slide: '.m_focus',
        hd: '.focus_hd',
        bd: '.focus_bd ul',
        pagination: true,
        direction: 'vertical',
        prevBtn: '.prev',
        nextBtn: '.next'
    });

	/** MODULE: restaurant category filter */
    function restaurantCategory(){
        function showHotRestList(){
            $('.mealType .mealType_hd').text("口味");
            $('.category_box_progress').simpleSlider("setValue", "100");

            $(".m_restCategory .hotRecommend").show().siblings('.restaurant_list').hide();
            $(".m_restCategory .hotRecommend .rest_item").show();

            $(".m_restCategory .panel_hd input:checkbox").attr('checked', false);
            $("#check_hotrest").prop('checked', true);

            // clear otherList's placehold statue;
            // $('.m_restCategory .otherList .rest_placehold').addClass('hide').removeClass('show');
        }

        function showOtherRest(){
            hotRestCheckboxFalse();

            $('.m_restCategory .otherList').show();
            $('.m_restCategory .otherList .rest_item').removeClass('hide').removeClass('show');
            $('.m_restCategory .otherList').siblings('.restaurant_list').hide();
        }

        // *** restaurant category slider filter bar config;
        var sliderValue = 100;

        $(".category_box_progress").bind("slider:changed", function (event, data) {
            sliderValue = data.value;
            // I predefined the slider range;
            // Here is : 0, 33.333, 66.666, 99.999
            priceFilter();
        });

        function priceFilter(){
            //console.log('slider value: ',sliderValue);
            var category_text = $('.category_text ');

            // **** slider range tips;
            switch (parseFloat(sliderValue)) {
                case 0 :
                    category_text.text('10元以下');

                    hotRestCheckboxFalse();
                    showOtherRest();
                    restFilter(10);
                    break;
                case 33.333 :
                    category_text.text('20元以下');

                    hotRestCheckboxFalse();
                    showOtherRest();
                    restFilter(20);
                    break;
                case 66.666 :
                    category_text.text('30元以下');

                    hotRestCheckboxFalse();
                    showOtherRest();
                    restFilter(30);
                    break;
                case 99.999 :
                case 100 :
                    if ($('.m_restCategory ').hasClass('mealTypeFilter')) {
                        hotRestCheckboxFalse();
                        showOtherRest();
                        restFilter(9999);
                    } else {
                        category_text.text('全部');
						
                        if ( $('.m_restCategory .checkbox:eq(0) input:checked').length == 0 && $('.m_restCategory .checkbox:eq(1) input:checked').length == 0) {
                            $("#check_hotrest").click();
                        } else{
                            restFilter(9999);
                        }
                        break;
                    }
            }

            // **** restaurant price filter;
            function restFilter(price){
                $('.m_restCategory .otherList .rest_item').each( function (){
                    var item = $(this);

                    var avgPrice = parseFloat(item.attr("data-rest-avgprice"));
                    if (avgPrice <= price){
                        item.addClass('show').removeClass('hide');
                    } else {
                        item.removeClass('show').addClass('hide');
                    }
                });

                // fill placehold if listGroup have not enough restaurant item (less than 5 item a row);
//                var visibleItemsLen = $('.m_restCategory .otherList .rest_item:visible').length;
//                //console.log(visibleItemsLen, visibleItemsLen%5);
//                if (visibleItemsLen % 5) {
//                    $('.m_restCategory .otherList .rest_placehold').addClass('hide').removeClass('show');
//
//                    // visibleItems get % must greet than 0;
//                    if (5 - visibleItemsLen%5 != 0){
//                        $('.m_restCategory .otherList .rest_placehold:lt(' + (5 - visibleItemsLen%5) + ')')
//                            .addClass('show').removeClass('hide');
//                    }
//                }
            }
        }

        // *** checkbox filter && meal type filter;
		// removeMealTypeClassGroup: to remember the checkbox's class(checked statue);
        var removeMealTypeClassGroup = $('.m_restCategory').attr('class');
		
		var oldCategoryStatueClass = $('.m_restCategory').attr('class');

        function hotRestCheckboxFalse(){
            $("#check_hotrest").attr('checked', false);
        }
		
		// *** bind checkbox class filter;
        $(".m_restCategory #check_hotrest").click( function (){
            showHotRestList();
            $('.m_restCategory').attr('class', oldCategoryStatueClass);
            removeMealTypeClassGroup = $('.m_restCategory').attr('class');
        });

        $(".m_restCategory #check_open").click( function (){
            var that = $('this');
            bindFeatureFilter('filter_rest_open', that);
        });

        $(".m_restCategory #check_olpay").click( function (){
            var that = $('this');
            bindFeatureFilter('filter_rest_olpay', that);
        });

        $(".m_restCategory #check_chaoshipeifu").click( function (){
            var that = $('this');
            bindFeatureFilter('filter_rest_chaoshi', that);
        });

        $(".m_restCategory #check_gift").click( function (){
            var that = $('this');
            bindFeatureFilter('filter_rest_gift', that);
        });


        // *** bind meal type filter
        $(".m_restCategory .mealType_all").click( function (){
            $(".m_restCategory #check_hotrest").trigger('click');
        });

        $(".m_restCategory .mealType_zs").click( function (){
            var that = $('this');
            bindMealTypeFilter('filter_mealtype_chinese', that);
        });

        $(".m_restCategory .mealType_xs").click( function (){
            var that = $('this');
            bindMealTypeFilter('filter_mealtype_west', that);
        });

        $(".m_restCategory .mealType_gs").click( function (){
            var that = $('this');
            bindMealTypeFilter('filter_mealtype_hongkong', that);
        });

        $(".m_restCategory .mealType_nc").click( function (){
            var that = $('this');
            bindMealTypeFilter('filter_mealtype_milktea', that);
        });

        $(".m_restCategory .mealType_bbq").click( function (){
            var that = $('this');
            bindMealTypeFilter('filter_mealtype_bbq', that);
        });

        $(".m_restCategory .mealType_hs").click( function (){
            var that = $('this');
            bindMealTypeFilter('filter_mealtype_korea', that);
        });

        $(".m_restCategory .mealType_td").click( function (){
            var that = $('this');
            bindMealTypeFilter('filter_mealtype_dessert', that);
        });

        $(".m_restCategory .mealType_hb").click( function (){
            var that = $('this');
            bindMealTypeFilter('filter_mealtype_humberger', that);
        });

        function bindFeatureFilter(featureFilterClass, that){

            // if two panel_hd's checkbox all were not checked && that was not mealType filtering;
            if (($('.m_restCategory .checkbox:eq(0) input:checked').length == 0) && ($('.m_restCategory .checkbox:eq(1) input:checked').length == 0) && !$('.m_restCategory').hasClass('mealTypeFilter') && (sliderValue == 100 || sliderValue == 99.999)){
                showHotRestList();
                $('.m_restCategory').toggleClass(featureFilterClass);

                removeMealTypeClassGroup = removeMealTypeClassGroup.replace(featureFilterClass, '');
            } else {
                hotRestCheckboxFalse();

                showOtherRest();
                priceFilter();

                var that = that;
                var nowSwitch = that.attr('checked');
                $(this).attr('checked', !nowSwitch);
                $('.m_restCategory').toggleClass(featureFilterClass);

                if (removeMealTypeClassGroup.indexOf(featureFilterClass) == -1){
                    removeMealTypeClassGroup += " " + featureFilterClass;
                } else {
                    removeMealTypeClassGroup = removeMealTypeClassGroup.replace(featureFilterClass, '');
                }
            }
        }

        function bindMealTypeFilter(mealTypeFilter, that){
            $('.m_restCategory').attr('class', removeMealTypeClassGroup)
                .addClass('mealTypeFilter').addClass(mealTypeFilter);

            hotRestCheckboxFalse();
            showOtherRest();
            priceFilter();
            //console.log(sliderValue, '***');

            var that = that;
            var nowSwitch = that.attr('checked');
            $(this).attr('checked', !nowSwitch);
        }
    }
    restaurantCategory();
});

