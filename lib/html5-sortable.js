/*
  Author:bachvtuan@gmail.com
  Website:http://dethoima.com
  A directive that support sortable list via html5 for angularjs
  Read the readme.md and take a look at example code before using.
*/

var sortable_app = angular.module('html5.sortable', []);
sortable_app.directive('htmlSortable', function($parse,$timeout, $log) {

  return {
    restrict: 'A',
    require: '?ngModel',
    scope: { 
      htmlSortable: '=',
      ngModel : '='
    },

    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs,ngModel) {
      var model = $parse(attrs.htmlSortable);
      /*attrs.html5Sortable*/

      var sortable = {};
      sortable.is_handle = false;
      sortable.in_use = false;
      
      sortable.handleDragStart = function(e) {

        sortable.drag_source = null;
        
        if ( sortable.options &&  !sortable.is_handle && sortable.options.handle ){
          e.preventDefault();
          return;
        }

        sortable.is_handle  = false;
        e.dataTransfer.effectAllowed = 'move';
        
        sortable.drag_source = this;

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
        if (sortable.drag_source != this) {
          
          if (sortable.drag_source == null){
            $log.info("Invalid sortable");
            return;
          }
          
          var drop_index = this.index;
          var drag_index = sortable.drag_source.index;
          var temp = angular.copy(ngModel.$modelValue[drag_index]);
          
          sortable.unbind();
          
          ngModel.$modelValue.splice(drag_index,1);
          ngModel.$modelValue.splice(drop_index,0, temp);

          scope.$apply();

          if ( sortable.options &&  angular.isDefined(sortable.options.stop) ){
            $log.info('Make callback');
            sortable.options.stop(ngModel.$modelValue,ngModel.$modelValue[drop_index]);
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
        sortable.drag_source = null;
        var index = 0;
        this.cols_ =  element[0].children;
        [].forEach.call(this.cols_, function (col) {
          if ( sortable.options &&  sortable.options.handle){
            var handle = col.querySelectorAll(sortable.options.handle)[0];
            handle.addEventListener('mousedown', sortable.activehandle, false);
          }
          
          col.index = index++;
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
            
            scope.$watch('htmlSortable', function(value) {
              
              $log.info("The fist time load html5-sortable");
              sortable.options = value;

              if (value == "stop" ){
                $log.info("stop");
                if (sortable.in_use){
                  sortable.unbind();
                  sortable.in_use = false;
                }
                return;
              }

              if ( sortable.options && angular.isDefined(sortable.options.construct) ){
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
              if ( !sortable.first_load || sortable.options == 'stop' ){
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
