HTML5 SORTABLE FOR ANGULARJS
=============================

I used sortable which provided by jqueryUI at this [link](https://github.com/angular-ui/ui-sortable), That's good but it's pretty heavy to use because not just sortable code is included, I just need sortable method, So I decided make sortable items by html5 instead, almost modern browsers support this.  
Below is some reference links that help me get an overview before coding this directive.  

- [UI.Sortable directive](https://github.com/angular-ui/ui-sortable)

- [Native HTML5 Drag and Drop](http://www.html5rocks.com/en/tutorials/dnd/basics/)

## Demo

[DEMO LINK](http://bachvtuan.github.io/html5-sortable-angularjs/)

## Directive features
1.  Native html5 sortable( jquery no longer required ).
2.  Support sortable which array is given ( pass by ngModel)
3.  You can choose specific handle element on item element.
4.  Offer callback when init directive or after item is dropped.
5.  Auto update sortable DOM when ngmodel is changed or removed sub item.
6.  Cross dropping

## Bower

```
bower install html5-sortable-angularjs
```

## NPM

```
npm i html5-sortable-angularjs
```


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

    //Options for sortable code
    $scope.sortable_option = {
      //Only allow draggable when click on handle element
      handle:'p.handle',
      //Construct method before sortable code
      construct:function(model){
        for ( var i = 0; i < model.length; i++ ){
          model[i].letter +=" (constructed)";
        }
      },
      //Callback after item is dropped
      stop:function(list, dropped_index){
        list[ dropped_index].letter += " Dropped";
      }
    };



**Below is example in template code**

    <div class="columns" html-sortable="sortable_option" ng-model="list">
      <div class="column" ng-repeat="item in list"  >
        <header>{{item.letter}}</header>
        <p class="handle">DRAG</p>
      </div>
    </div>
 
If you don't want using option, you can edit to html-sortable="" in template.

## LICENSE

MIT

### Done
Have fun !