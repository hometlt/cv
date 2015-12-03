angular.module('app', ['pascalprecht.translate','ngSanitize'], function ($translateProvider) {
    $translateProvider.useSanitizeValueStrategy(null);

    // Adding a translation table for the English language
    $translateProvider.translations('en_US', {
        "today"     : "today",
        "about"     : "About",
        "contacts"     : "Contacts",
        "interests"     : "Interests",
        "expirience"     : "Work Expirience",
        "education"     : "Education",
        "strong"     : "Core Skills",
        "weak"     : "Other Skills",
        "portfolio"     : "Portfolio",
        "more"     :        "More information, links and examples on my github and linkedIn accounts."
    });

    // Adding a translation table for the Russian language
    $translateProvider.translations('ru_RU', {
        "today"     : "сейчас",
        "about"     : "Обо мне",
        "contacts"     : "Контакты",
        "interests"     : "Интересы",
        "expirience"     : "Опыт работы",
        "education"     : "Образование.",
        "strong"     : "Основные навыки",
        "weak"     :    "Другие навыки",
        "portfolio"     : "Портфолио",
        "more"     :        "Больше работ и информации о проектах на аккаунтах в github и linkedIn."
    });

})
.controller("ctrl",function($scope,$translate,$http){



        $scope.lang = "";
        $scope.view = "document";
        $scope.closePreview = function() {
            delete $scope.preview;
        }
        $scope.previewImage = function(img) {
            $scope.preview = img.url ? img : {url: img};
        }
        $scope.changeView = function() {
            $scope.view = ($scope.view == "document" )? "web" : "document";
            $scope.web = $scope.view == "web";
        };
        $scope.print = function() {
            window.print();
        }
        $scope.setLang = function(langKey) {

            $http.get("data/" + langKey + ".json").then(function(data){

                var _b = ["jobs", "edus", "works"];
                for (var b in _b){
                    var _arr = data.data[_b[b]];
                    for (var i in _arr) {
                        _arr[i].begin = _arr[i].begin && new Date(_arr[i].begin);
                        _arr[i].end = _arr[i].end && new Date(_arr[i].end);
                    }
                }

                $scope.data = $.extend(true,$scope.data,data.data);

                // You can change the language during runtime
                $translate.use(langKey);
                // A data generated by the script have to be regenerated
                //$scope.jsTrSimple = $translate.instant('SERVICE');
                //$scope.jsTrParams = $translate.instant('SERVICE_PARAMS', $scope.tlData);
                $scope.lang = langKey;
            })

        };

        $scope.sendToFront = function(){
            $("html").animate({ scrollTop: $(document).height() }, "slow");
            $("body").animate({ scrollTop: $(document).height() }, "slow");
            $("#second").removeClass("back");
        };


        $scope.data = {};

        $scope.right = $(window).width();

        function resize(){

            var _c =$($(".container")[0]);
            var _r =_c.width() + _c.position().left + 20;
            twopages = _r <  $("body").width() / 2;
            console.log(twopages);
            doBack();

            $scope.right = $($(".container")[1]).position().left + $($(".container")[1]).width() * 1.1 + 20  ;
            $scope.left = $($(".container")[0]).position().left * 0.7;
            $scope.$apply();
        }


        var twopages= false;

        setTimeout(function(){
             var art = $("article");
             var _ah = 1123;
             var _aw = 794;
             var a = ($(window).height() - 25) / _ah ;//art.height() ;
             art.css("transform","scale(" + a +")");
             var _w =  _aw * a;
             var _h = _ah * a;
             $(".container").width(_w).height(_h);
            resize();
            doBack();
        });
        $(window).resize(resize);



        $(document).scroll(doBack)

        function doBack(){

            if(twopages ||  $("html").scrollTop() || $("body").scrollTop()  > $("html")[0].scrollHeight * 0.1){
                $("#second").removeClass("back");
            }else{
                $("#second").addClass("back");
            }
        }

        $scope.setLang("en_US");

})
    .directive('imgPreload', ['$rootScope', function($rootScope) {
        return {
            restrict: 'A',
            scope: {
                ngSrc: '@',
                onLoad: "&"
            },
            link: function(scope, element, attrs) {
                scope.spinner = $('<i class="fa fa-spinner fa-pulse">');
                element.addClass('fade');

                element.on('load', function() {
                    // console.log("> add fade in class to...", element);
                    element.addClass('in');
                    scope.spinner.remove();
                    if(attrs.onLoad){
                        var $data = {
                            image: this
                        }
                        scope.onLoad({ $data: $data });
                    }
                    scope.$apply();
                }).on('error', function() {
                    scope.spinner.remove();
                    scope.$apply();
                });

                scope.$watch('ngSrc', function(newVal) {
                    if(newVal == undefined || newVal == ""){
                        element.attr("src", "");
                        if(attrs.onLoad){
                            var $data = {
                                image: element[0]
                            }
                            scope.onLoad({ $data: $data });
                        }
                    }
                    if(element[0].complete == false){
                        element.removeClass('in');
                        scope.spinner.insertAfter(element);
                    }
                    // console.log("> remove fade in class to...", newVal, element);
                });
            }
        };
    }])
