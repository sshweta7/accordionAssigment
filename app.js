// MODULE
angular.module('accordionApp', ['ngAnimate', 'ui.bootstrap']);


// CONTROLLER
angular.module('accordionApp').controller('accordionController', ['$scope', function($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
        {
          title: 'Dynamic Group Header - 1',
          content: 'Dynamic Group Body - 1'
        },
        {
          title: 'Dynamic Group Header - 2',
          content: 'Dynamic Group Body - 2'
        }
      ];
    
    $scope.list = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
        var newItemNo = $scope.list.length + 1;
        $scope.list.push('Item ' + newItemNo);
    };


    $scope.items = [
        {title: "foo", content: "first Lorem ipsum dolor sit amet"},
        {title: "bar", content: "second Lorem ipsum dolor sit amet"},
        {title: "baz", content: "third Lorem ipsum dolor sit amet"}
      ]
}]);

//DIRECTIVE
angular.module('accordionApp').directive('accordionControl', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        template: '<div ng-transclude></div>',
        link: function(scope, element) {
            element.children().find('div').css('display','none');
            element.find('h5').on('click',function(event){
                element.children().find('div').css('display','none');
                var body = angular.element(event.target).next();
                body.css('display','block');
            });
        }
    }    
 });



 angular.module('accordionApp').directive('accordionControls', function() {
    return {
      restrict: 'AE',
      replace: true,
      transclude: true,
      template: '<div class="accordion" ng-transclude></div>',
      controller: function() {
        var items = [];
        
        this.register = function(item) {
          items.push(item);
          
          if (items.length < 2) {
            item.isVisible = true;
          }
        };
        
        this.handleSelectedItem = function(selectedItem) {
          angular.forEach(items, function(item) {
            if (selectedItem != item) {
              item.isVisible = false;
            }
            else {
              item.isVisible = true;
            }
          });
        }
      }
    }
  });
  
  angular.module('accordionApp').directive('expanderList', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      require: '?^accordionControls',
      scope: {
        title: '@'
      },
      template: `<div class="expander">
                    <div class="accHeading" ng-click="handleToggle()">{{ title }}</div>
                    <div class="accBody" ng-show="isVisible" ng-transclude></div>
                </div>`,
      link: function(scope, element, attrs, accordionController) {
        var hasAccordionController = !!accordionController;
        
        scope.isVisible = false;
        
        scope.handleToggle = function() {
          scope.isVisible = !scope.isVisible;
          
          if (hasAccordionController) {
            accordionController.handleSelectedItem(scope);
          }
        }
        
        if (hasAccordionController) {
          accordionController.register(scope);
        }
      }
    };
  });