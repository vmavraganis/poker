poker.directive('card', function () {

    var link = function (scope, element, attrs) {

        //Create a copy of the original data that’s passed in
        var items = angular.copy(scope.datasource);

        function init() {
            if(scope.side!="back"){
                var html = ' <div  class="card rank-'+scope.cardrank+' '+scope.cardsuit+'"  >'+
                    '<span class="rank">'+scope.cardrank+'</span> '+
                    '<span class="suit">'+scope.symbol+'</span>';

            }
            else{
                var html=' <div  class=" card '+scope.side+' "  >';

            }
            element.html(html);

        }



        init();

    };


    return {
        restrict: 'EA',
        scope:{cardrank:"@",
            cardsuit:"@",
            side:"@",
            symbol:"@",
            hidden:"@"
        },
        link: link
    };
});


poker.directive('ngMax', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var maxValidator = function (value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!isEmpty(value) && value > max) {
                    ctrl.$setValidity('ngMax', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMax', true);
                    return value;
                }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});
poker.directive('ngMin', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMin, function () {
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var minValidator = function (value) {
                var min = scope.$eval(attr.ngMin) || 0;
                if (!isEmpty(value) && value < min) {
                    ctrl.$setValidity('ngMin', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('ngMin', true);
                    return value;
                }
            };

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});































