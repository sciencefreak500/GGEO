angular.module('firebaseConfig', ['firebase'])

.run(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAHK9Pl2T02HJOdOxfFyx_tuJOyMqOeqZM",
    authDomain: "ggeo-80068.firebaseapp.com",
    databaseURL: "https://ggeo-80068.firebaseio.com",
    storageBucket: "ggeo-80068.appspot.com",
  };
  firebase.initializeApp(config);

})

.factory("firedb", function($firebaseArray) {
  var itemsRef = new Firebase("https://ggeo-80068.firebaseio.com");
  return itemsRef;
})

/*

.service("TodoExample", ["$firebaseArray", function($firebaseArray){
    var ref = firebase.database().ref().child("todos");
    var items = $firebaseArray(ref);
    var todos = {
        items: items,
        addItem: function(title){
            items.$add({
                title: title,
                finished: false
            })
        },
        setFinished: function(item, newV){
            item.finished = newV;
            items.$save(item);
        }
    }
    return todos;
}])

*/