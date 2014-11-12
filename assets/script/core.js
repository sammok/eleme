var eleme = {};

eleme.core = {
    isIE: function (version, comparison){
        var cc      = 'IE',
            b       = document.createElement('B'),
            docElem = document.documentElement,
            isIE;

        if(version){
            cc += ' ' + version;
            if(comparison){ cc = comparison + ' ' + cc; }
        }

        b.innerHTML = '<!--[if '+ cc +']><b id="iecctest"></b><![endif]-->';
        docElem.appendChild(b);
        isIE = !!document.getElementById('iecctest');
        docElem.removeChild(b);
        return isIE;

        //is it IE?   isIE();
        //is it IE6?  isIE(6);
        //is it less than or equal to IE 6?    isIE(7,'lte');
    }
};

eleme.unit = {
    mainBackgroundGo: function(){
        function setBackground(){
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            var nowBgPosition = (hours*60+minutes)*60+seconds*6.64615384615;
    //        console.log(nowBgPosition);
            $('#background').css('background-position','1px ' + nowBgPosition + 'px');
        }

        var mainBackground = setInterval(setBackground,1000);
    },

// top searchBar module;
    topSearchBar: function (){
        $('.eleme_top .search_txt').keyup( function (event){
        if ( event.keyCode == 13){
            $('.eleme_top .search_btn').trigger('click');
        }
    });
}
};
