/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module('app.filters', [])

.filter('filterList', function(){
  return function (items, query) {
    var filtered = [];
    var letterMatch = new RegExp(query, 'i');
    
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (query) {
        if (letterMatch.test(item.name.substring(0, query.length))) {
          filtered.push(item);
        }
      } else {
        filtered.push(item);
      }
    }
    return filtered;
  };
});


/* Ex.: 

.service('BlankService', [function(){

}]);

*/