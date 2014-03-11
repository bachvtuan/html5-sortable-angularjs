/*
  Author:bachvtuan@gmail.com
  https://github.com/bachvtuan/html5-sortable-angularjs
  A directive that support sortable list via html5 for angularjs
  Read the readme.md and take a look at example code before using.
*/

var sortable_app = angular.module('html5.sortable', []);
sortable_app.directive('htmlSortable', function($parse,$timeout, $log, $window) {

  return {
    restrict: 'A',
    require: '?ngModel',
    scope: { 
      htmlSortable: '=',
      ngModel : '=',
      ngExtraSortable:'='
    },

    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs,ngModel) {
      //var model = $parse(attrs.htmlSortable);
      /*attrs.html5Sortable*/

      var sortable = {};
      sortable.is_handle = false;
      sortable.in_use = false;
      
      sortable.handleDragStart = function(e) {

         $window['drag_source'] = null;
         $window['drag_source_extra'] = null;
        
        if ( sortable.options &&  !sortable.is_handle && sortable.options.handle ){
          e.preventDefault();
          return;
        }

        sortable.is_handle  = false;
        e.dataTransfer.setData('text/plain', '');
        e.dataTransfer.effectAllowed = 'move';
        
         $window['drag_source'] = this;
         $window['drag_source_extra'] = element.extra_data;

        // this/e.target is the source node.
        this.classList.add('moving');
      };

      sortable.handleDragOver = function(e) {
        if (e.preventDefault) {
          e.preventDefault(); // Allows us to drop.
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
      };

      sortable.handleDragEnter = function(e) {
        this.classList.add('over');
      };

      sortable.handleDragLeave = function(e) {
        this.classList.remove('over');
      };

      sortable.handleDrop = function(e) {
        // this/e.target is current target element.
        if (e.stopPropagation) {
          // stops the browser from redirecting.
          e.stopPropagation(); 
        }
        this.classList.remove('over');

        // Don't do anything if we're dropping on the same column we're dragging.
        if ( $window['drag_source'] != this) {
          
          if ( $window['drag_source'] == null){
            $log.info("Invalid sortable");
            return;
          }

          
          var source_model = $window['drag_source'].model;
          var drop_index = this.index;

          if (ngModel.$modelValue.indexOf(source_model) != -1){
            
            var drag_index =  $window['drag_source'].index;
            var temp = angular.copy(ngModel.$modelValue[drag_index]);
            
            sortable.unbind();
            
            ngModel.$modelValue.splice(drag_index,1);
            ngModel.$modelValue.splice(drop_index,0, temp);

          }
          else if ( sortable.options.allow_cross ){
            ngModel.$modelValue.splice(drop_index,0, source_model);
          }
          else{
            $log.info("disabled cross dropping");
            return;
          }
          
          //return;
          scope.$apply();

          if ( sortable.options &&  angular.isDefined(sortable.options.stop) ){
            $log.info('Make callback');
            sortable.options.stop(ngModel.$modelValue,drop_index,
              element.extra_data,$window['drag_source_extra']);
          }
        }

        return false;
      };

      sortable.handleDragEnd = function(e) {
        // this/e.target is the source node.
        [].forEach.call(sortable.cols_, function (col) {
          col.classList.remove('over');
          col.classList.remove('moving');
        });

      };

      //Unbind all events are registed before
      sortable.unbind = function(){
        
        $log.info('Unbind sortable');
        [].forEach.call(sortable.cols_, function (col) {
          col.removeAttribute('draggable');
          col.removeEventListener('dragstart', sortable.handleDragStart, false);
          col.removeEventListener('dragenter', sortable.handleDragEnter, false);
          col.removeEventListener('dragover', sortable.handleDragOver, false);
          col.removeEventListener('dragleave', sortable.handleDragLeave, false);
          col.removeEventListener('drop', sortable.handleDrop, false);
          col.removeEventListener('dragend', sortable.handleDragEnd, false);
        });
        sortable.in_use = false;
      }

      sortable.activehandle = function(){
        sortable.is_handle = true;
      }

      sortable.update = function(){
        $log.info("Update sortable");
         $window['drag_source'] = null;
        var index = 0;
        this.cols_ =  element[0].children;

        [].forEach.call(this.cols_, function (col) {
          if ( sortable.options &&  sortable.options.handle){
            var handle = col.querySelectorAll(sortable.options.handle)[0];
            handle.addEventListener('mousedown', sortable.activehandle, false);
          }
          
          col.index = index;
          col.model = ngModel.$modelValue[index];

          index++;

          col.setAttribute('draggable', 'true');  // Enable columns to be draggable.
          col.addEventListener('dragstart', sortable.handleDragStart, false);
          col.addEventListener('dragenter', sortable.handleDragEnter, false);
          col.addEventListener('dragover', sortable.handleDragOver, false);
          col.addEventListener('dragleave', sortable.handleDragLeave, false);
          col.addEventListener('drop', sortable.handleDrop, false);
          col.addEventListener('dragend', sortable.handleDragEnd, false);
        });

        sortable.in_use = true;
      }
      
      if (ngModel) {
        ngModel.$render = function() {
          $timeout(function(){
            //Init flag indicate the first load sortable is done or not
            sortable.first_load = false;

            scope.$watch('ngExtraSortable',function(value){
              element.extra_data = value;
              //sortable.extra_data = value;
            })
            
            scope.$watch('htmlSortable', function(value) {
              
              $log.info("The fist time load html5-sortable");
              sortable.options = angular.copy(value) ;

              if (value == "destroy" ){
                $log.info("destroy");
                if (sortable.in_use){
                  sortable.unbind();
                  sortable.in_use = false;
                }
                return;
              }

              if ( !angular.isDefined(sortable.options)){
                sortable.options = {};
              }

              if ( !angular.isDefined(sortable.options.allow_cross)){
                sortable.options.allow_cross = false
              }

              if ( angular.isDefined(sortable.options.construct) ){
                sortable.options.construct(ngModel.$modelValue);
              }
              element[0].classList.add('html5-sortable');
              sortable.update();
              $timeout(function(){
                sortable.first_load = true;
              })
            }, true);

            //Watch ngModel and narrate it
            scope.$watch('ngModel', function(value) {
              if ( !sortable.first_load || sortable.options == 'destroy' ){
                //Ignore on first load
                return;
              }
              $log.info("Model changed");
              
              $timeout(function(){
                sortable.update();
              });

            },true);

          });
        };
      }
      else{
        $log.info('Missing ng-model in template');
      }
    }
  };
});
