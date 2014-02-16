HTML5 SORTABLE FOR ANGULARJS
=============================

I used sortable which provided by jqueryUI at this [link](https://github.com/angular-ui/ui-sortable), That's good but it's pretty heavy to use because not just sortable code is included, I just need sortable method, So I decided make sortable items by html5 instead, almost modern browsers support this.  
Below is some reference links that help me get an overview before coding this directive.  

- [UI.Sortable directive](https://github.com/angular-ui/ui-sortable)

- [Native HTML5 Drag and Drop](http://www.html5rocks.com/en/tutorials/dnd/basics/)

##[DEMO LINK](http://bachvtuan.github.io/html5-sortable-angularjs/)
## Directive features
1.  Native html5 sortable( jquery no longer required ).
2.  Support sortable which array is given ( pass by ngModel)
3.  You can choose specific handle element on item element.
4.  Offer callback when init directive or after item is dropped.
5.  Auto update sortable DOM when ngmodel is changed or removed sub item.
6.  Easy configuration and using :)

## How to use
Include html5.sortable to your app

     var app = angular.module('app', [ 
      'html5.sortable'
     ]);

Define any varriable in scope with type is array

    $scope.list = [
      {id:1,letter:'A'},
      {id:2,letter:'B'},
      {id:3,letter:'C'},
      {id:4,letter:'D'},
    ];
Define sortable options

    $scope.sortable_option = {
      handle:'p',
      construct:function(model){
        for ( var i = 0; i < model.length; i++ ){
          model[i].letter +=" construct";
        }
      },
      stop:function(model){
        $log.info("Callback on stop");
        $log.info(model);
        for ( var i = 0; i < model.length; i++ ){
          model[i].letter +=" Callback";
        }
      }
    };



**Below is example in template code**

    <div class="columns" html-sortable="sortable_option" ng-model="list">
      <div class="column" ng-repeat="item in list"  >
        <header>{{item.letter}}</header>
        <p>DRAG</p>
      </div>
    </div>
 
If you don't want using option, you can edit to html-sortable="" in template.

###Done
Have fun !