angular.module('app').controller('Index_Ctrl', 
  ['$scope','$log', function($scope, $log){

    $scope.template_url = 'templates/index_ctrl.html';
    //Example array
    $scope.list = [
      {id:1,letter:'A'},
      {id:2,letter:'B'},
      {id:3,letter:'C'},
      {id:4,letter:'D'},
    ];

    $scope.sortable_mode = "on";

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
      stop:function(list,dropped_index){
        list[ dropped_index].letter += " Dropped";
      }
    };

    $scope.sortable_ul_option = {
      handle:'.handle'
    }

    $scope.groups = {
      'id1':['A','B','C'],
      'id2':['E','F','G','H']
    };
      
    
    $scope.sortable_cross_option = {
      allow_cross: true,
      stop:function(list,dropped_index,extra_data, drag_extra_data){
        if ( extra_data == drag_extra_data){
          $log.info("They have the same group");
          return;
        }
        var dropped_letter = list[dropped_index];
        $log.info(dropped_letter);
        $log.info(drag_extra_data);
        

        var find_index = $scope.groups[drag_extra_data].indexOf(dropped_letter);
        if ( find_index != -1){
          $scope.groups[drag_extra_data].splice(find_index,1);
        }
        
      }
    }

    //Another example
    $scope.list2 = [
      {title:'BASIC',content:"The content for basic"},
      {title:'ADVANTAGE',content:"The content for advantage"},
      {title:'MASTER',content:"The content for master"}
    ];
    

    $scope.delete = function(list,delete_item){
      var i = 0;
      for ( var i =0 ; i < list.length;i++ ){
        if (delete_item == list[i]){
          list.splice(i, 1);
          break;
        }
      }
    }

    $scope.append = function(edit_item){
      edit_item.letter += " Append";
    }

  }
]);
