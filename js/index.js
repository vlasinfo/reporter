function resizeBanner(){
    var max_image_width  = 1280;
    var max_image_height = 667;
    var min_block_height = 300;
    var padding_bottom   = 200;
    var block_height;
    var issueImage       = $('#issue_img');
    var issueImageWrap   = $('#issue_img_in');

    setTimeout(function () {
        issueImage.css({
            'width': ($(window).width())
        });
        issueImage.css({
            'height': ($(window).height() - padding_bottom)
        });
        issueImage.css({
            'min-height': min_block_height
        });
        issueImage.css({
            'max-height': max_image_width
        });

        if (issueImage.height() <= min_block_height) {
            block_height = min_block_height;
        } else {
            if (issueImage.height() >= max_image_height) {
                block_height = max_image_height;
            } else {
                block_height = $(window).height() - padding_bottom;
            }
        }

        issueImage.css({
            'height': block_height
        });

        percentage_width_change = ($(window).width() * 100) / max_image_width;
        percentage_height_change = (block_height * 100) / max_image_height;

        if (percentage_width_change > percentage_height_change) {
            issueImageWrap.css({
                'width': $(window).width()
            });
            issueImageWrap.css({
                'height': 'auto'
            });
        } else {

            issueImageWrap.css({
                'width': 'auto'
            });
            issueImageWrap.css({
                'height': block_height
            });
        }

        if (issueImageWrap.height() > block_height) {
            issueImageWrap.css({
                'margin-top': -(issueImageWrap.height() - block_height) / 2
            });
        } else {
            issueImageWrap.css({
                'margin-top': 'auto'
            });
        }

        if (issueImageWrap.width() > issueImage.width()) {
            issueImageWrap.css({
                'margin-left': -(issueImageWrap.width() - issueImage.width()) / 2
            });
        } else {
            issueImageWrap.css({
                'margin-left': 'auto'
            });
        }
    }, 10);
}

function modalOnOpen(){
    $('body').css({height:$(window).height()+'px', overflow:'hidden'});
    modalFix();
}

function modalOnClose(){
    $('body').css({height:'auto', overflow:'auto'});
}

function modalFix(){
    $('.modal-dialog').width($('body').width());
    resizeBanner();
}

var ReporterApp = angular.module('ReporterApp', ['oc.modal', 'duScroll'])
    .config(['$provide', function ($provide){
        $provide.decorator('$browser', ['$delegate', function ($delegate) {
            $delegate.onUrlChange = function () {};
            $delegate.url = function () { return ""};
            return $delegate;
        }]);
    }]).controller('ReporterScroll', ['$scope','$http', function ($scope, $http) {
        $scope.getArchPage = function(archNum) {
            $http.get('/serv/archive/cat='+archNum+'.html').success(function(data){
                angular.element(document.getElementById('archivecontainer')).empty().append(data);
            });
        };
    }]);

$(function(){
    modalFix();

    $(window).on('resize', function(k,v){
        modalFix();
    });

    if($('#in-papert').size()){
        $('.modal-wrapper,.modal-dialog').on('click', function(){
            $('.modal-header .close').click();
            return false;
        });
        $(window).on('resize scroll', function(k,v){
            var scrltp  = $(this).scrollTop();
            var dochgt  = $(document).height();
            var fxtp    = $('#in-paperdiv-fix').position().top;
            var inph    = $('#in-paperdiv').height();
            var fthe    = $('#rep-footer').height();
            var desc    = (dochgt-(scrltp+fthe))-inph;
            var mtop    = (desc > 0) ? 0 : desc;

            if(scrltp > fxtp){
                $('#in-paperdiv').css({'position':'fixed', 'top':mtop+'px'});
            }else{
                $('#in-paperdiv').css({'position':'inherit', 'top':null});
            }
        });
    }

    $('#search_text').focus();
});

$.each($('#article-body').find('iframe'), function(){
    if($(this).attr('width') && parseInt($(this).attr('width'), 10) > 100){
        $(this).addClass('embed-responsive-item');

        $(this).wrapAll('<div class="embed-responsive embed-responsive-16by9"></div>');
    }
});

$(function(){
    $('#top_search_form').on('submit', function(){
        if(!$('#top_search_form_input').val()){
            return false;
        }
    });

    $('#reporter-popnews div.select-period a.btn-popular').on('click', function(){
        $('#reporter-popnews div.select-period a.btn-popular').removeClass('btn-active').filter(this).addClass('btn-active');
        $('#reporter-popnews div.row-popnews-cont').hide();
        $($(this).attr('href')).show();
        return false;
    });

    if($('#morenews_button').size()){
        $('#morenews_button').on('click', function(){
            var this_ = this;
            var $page = parseInt($(this_).attr('data-page'), 10);
            var $url  = '/simple'+$('#morenews_container').attr('data-url')+'page-'+($page+1)+'.html';
            var $prms = $('#morenews_container').attr('data-params');
            if($prms){
                $url += $prms;
            }
            $.ajax({
                type     : 'GET',
                url      : $url,
                dataType : 'html',
                success  : function(html){
                    var $data = $(html).find('#morenews_container');
                    $(this_).attr('data-page', $data.attr('data-page'));
                    var $html = $data.children();
                    $($html).hide();
                    $('#morenews_container').append($html);
                    $($html).slideDown();
                    $('html, body').animate({scrollTop : $($html).first().offset().top-15}, 800);
                    if($data.attr('data-nextpage') == ''){
                        $(this_).hide();
                    }
                }
            });
            return false;
        });
    }
});