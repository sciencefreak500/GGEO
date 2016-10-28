angular.module('app.controllers', [])
  

.controller('findGamersTabCtrl', ['$scope', '$stateParams', '$ionicTabsDelegate', '$firebaseArray', '$ionicPopover', '$http', 'backcallFactory', 'Snapvar', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicTabsDelegate, $firebaseArray, $ionicPopover, $http, backcallFactory, Snapvar) {

backcallFactory.backcallfun();

$scope.$on('$ionicView.beforeEnter', function() 
{
	$ionicTabsDelegate.showBar(true);
});

var usr = firebase.auth().currentUser;
var usrID = usr.uid;

function gamer(friend,info, thumb)
{
    this.friend = friend;
    this.info = info;
    this.thumb = thumb;
}
var selfID = "";
var selfchildID = "";
var gref = firebase.database().ref();
var userRef = gref.child('userData');
var mylong = "";
var mylat = "";

$scope.snapvars = Snapvar;


    function updateNumber()
    {
        for(var i in snapval.friendList)
            {
                if(snapval.friendList[i].confirmed === false)
                {
                     $scope.friendR += 1;
                }
            } 
    }
    
    $scope.friendR = 0;


$scope.listOfFriends = [];

function getList()
{
  $scope.gamerList = [];
	$ionicTabsDelegate.showBar(true);
    userRef.orderByChild('ID').equalTo(usrID).once('child_added').then(function(snap){
        console.log("user's ID:",snap.key);
        mylong = snap.val().longitude;
        mylat = snap.val().latitude;
        snapval = snap.val();
        selfID = snap.key;
        selfchildID = snap.val().ID;

        $scope.snapvars = snapval;
        console.log("snapval: ", $scope.snapvars);

        updateNumber();
        firebase.database().ref("userData/"+ snap.key + "/friendList").once("value").then(
            function(success)
        {
            //console.log(success.val());
            var ref = firebase.database().ref("userData");
            if(success.val() !== null)
            {
                $scope.listOfFriends = [];
               for(var i in success.val())
               {
                   $scope.listOfFriends.push(success.val()[i].friendID);
               }
               console.log("list of friends: ",$scope.listOfFriends);
           
            
                
                ref.orderByChild("friendList").limitToFirst(20).once("value").then(
                function(snapshot){
                   
                    var snap = snapshot.val();
                    
                    for( var i in snap)
                    {
                        if(snap[i].ID != usrID && (snap[i].playing !=="" || snap[i].system !== ""))
                        {
                            console.log(snap[i]);
                            
                            $scope.gamerList.push( new gamer(friendResult(snap[i].ID),snap[i]));
                        }
                        
                    }
                    $scope.$apply();
                     console.log("gamer list" ,$scope.gamerList);
                    
                });
            }    
            else
            {
                ref.orderByChild("online").limitToFirst(20).once("value").then(
                function(snapshot){
                    var snap = snapshot.val();
                    
                    for( var i in snap)
                    {
                        if(snap[i].ID != usrID && (snap[i].playing !=="" || snap[i].system !== ""))
                        {
                            console.log(snap[i]);
                            
                            $scope.gamerList.push( new gamer(false,snap[i]));
                        }
                        
                    }
                    $scope.$apply();
                     console.log("gamer list" ,$scope.gamerList);
                    
                });
            }
        });
        
    });

}

$scope.$on('$ionicView.beforeEnter', function() 
{
  getList();
});

var friendResult = function(snap){
              for(var j in $scope.listOfFriends)  {
                  if(snap == $scope.listOfFriends[j]){
                      return true;
                  }
                  else{
                      return false;
                  }
              }
            };

var ref = firebase.database().ref("userData");/*
ref.orderByChild("friendList").limitToFirst(20).once("value").then(
function(snapshot){
   
    var snap = snapshot.val();
    
    for( var i in snap)
    {
        if(snap[i].ID != usrID && (snap[i].playing !=="" || snap[i].system !== ""))
        {
            console.log(snap[i]);
            
            $scope.gamerList.push( new gamer(friendResult(snap[i].ID),snap[i]));
        }
        
    }
     console.log("gamer list" ,$scope.gamerList);
    
});*/


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}



$scope.distFromPlayer = function(long,lat)
{
  if(long == "" || lat == "" || mylong == "" || mylat == "")
  {
    return "N/A";
  }
  else
  {
    var result = getDistanceFromLatLonInKm(mylat, mylong, lat, long) * 0.621371;
    return Math.round( result * 10 ) / 10 + " mi.";
  }
};


function cons(name,color,click)  //to be used with mySQL
{
    this.name = name;
    this.color = color;
    this.click = false;
    this.colorToggle = function(){
      if(this.click === false){
          return "#736d68";
      }  
      else{
          return this.color;
      }
    };
}

$scope.consoleList = [
    new cons("VR", "#6f5fbf", false),
    new cons("Mobile", "#5390f7", false),
    new cons("Card", "#829e11", false),
    new cons("PC", "#ec780e", false),
    new cons("Xbox One", "#16b316", false),
    new cons("Playstation 4", "#241c79", false),
     new cons("Nintendo 3DS", "#800000", false),
     new cons("Wii U", "#d2c9c2", false),
    new cons("Playstation 3", "#4d44b1", false),
    new cons("Xbox 360", "#265a28", false),
    new cons("Nintendo Wii", "#86d0cb", false),
    new cons("Nintendo DS", "#6cb0c3", false),
    new cons("PSP", "#a3b0ea", false)
];


$scope.getConsoleColor = function(system){
    for(var i = 0; i < $scope.consoleList.length; i++)
    {
        if($scope.consoleList[i].name == system)
        {
            return $scope.consoleList[i].color;
        }
        
    }
};

$scope.gamerList = [];






$scope.searchResult =  function (checked, gname){
    $scope.gamerList = [];
     $scope.popover.hide();
    // console.log(gname);
    var snap;
    if(gname === "" || gname === null)
    {
        getList();
    }
    else
    {
        firebase.database().ref("userData/"+ selfID + "/friendList").once("value").then(
            function(success)
        {
            //console.log(success.val());
            var ref = firebase.database().ref("userData");
            if(success.val() !== null)
            {
               for(var i in success.val())
               {
                   $scope.listOfFriends.push(success.val()[i].friendID);
               }
               console.log("list of friends: ",$scope.listOfFriends);
           
            
                
                ref.orderByChild("friendList").limitToFirst(20).once("value").then(
                function(snaz){
                   snaz.ref.orderByChild("playing").equalTo(gname).limitToFirst(20).once("value").then(
                    function(snapshot){
                        var snap = snapshot.val();
                        
                        for( var i in snap)
                        {
                            if(snap[i].ID != usrID && (snap[i].playing !=="" || snap[i].system !== ""))
                            {
                                console.log(snap[i]);
                                
                                $scope.gamerList.push( new gamer(friendResult(snap[i].ID),snap[i]));
                            }
                            
                        }
                         $scope.$apply();
                         console.log("gamer list" ,$scope.gamerList);
                        
                    });
                });
            }    
            else
            {
                ref.orderByChild("playing").equalTo(gname).limitToFirst(20).once("value").then(
                function(snapshot){
                    var snap = snapshot.val();
                    
                    for( var i in snap)
                    {
                        if(snap[i].ID != usrID && (snap[i].playing !=="" || snap[i].system !== ""))
                        {
                            console.log(snap[i]);
                            
                            $scope.gamerList.push( new gamer(false,snap[i]));
                        }
                        
                    }
                     $scope.$apply();
                     console.log("gamer list" ,$scope.gamerList);
                    
                });
            }
        });
            
    
    }
};



$scope.search = {text: ""};
$scope.gameList = [];
   
  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
   
    $scope.searchGame = function()
    {
        //console.log($scope.search.text);
        if($scope.search.text === "" || $scope.search.text === null){
            $scope.searchResult(false,"");
        }
        $scope.gameList = [];
        var req = {
         method: 'GET',
         url: "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&limit=50&offset=0&search="+$scope.search.text,
         headers: {
           'X-Mashape-Key': "bgpAB6G151mshZLv8rnL5l4q8Mhwp1nSn6ujsnJmQA6cgQohzT",
           "Accept": "application/json"
         }
        };
        
        $http(req).then(function(success)
        {
            for(var i in success.data)
            {
                //console.log(success.data[i].name);
                 $scope.gameList.push(success.data[i].name);
            }
        },
        function(fail)
        {
            console.log(fail);
        });
        
    };



/*function event(name,online,game,system,eventTime)
{
    this.name = name;
    this.online = online;
    this.game = game;
    this.system = system;
    this.eventTime = eventTime;
}

//populate event information - TEST!
$scope.eventList = [];
$scope.eventList.push(new event("AHS Tournaments",true,"Planetside 2","PC","Here")); 
$scope.eventList.push(new event("Northeast Philly",false,"Minecraft","PS3","Here"));
$scope.eventList.push(new event("EA Gaming League",true,"Call of Duty","Xbox One","Here"));*/


$scope.addFriend = function(glist){
        console.log(glist.ID);
        var ref = firebase.database().ref("userData").orderByChild("ID").equalTo(glist.ID).once("child_added").
        then(function(done)
        {
            //other add
            var  fb= $firebaseArray(done.ref.child("friendList"));
            var result = {friendID: selfchildID, confirmed: false};
            //console.log("Other person: ", result);
            fb.$add(result);
            
            //self add
            ref = firebase.database().ref("userData/" + selfID).child("friendList");
            fb = $firebaseArray(ref);
            result = {friendID: glist.ID, confirmed: true};
            //console.log("Me: ", result);
            fb.$add(result);
            
            for(var i in $scope.gamerList)
            {
                if($scope.gamerList[i].info.ID == glist.ID)
                {
                    $scope.gamerList[i].friend = true;
                }
            }
            $scope.$apply();
            
        });
        
        
   
};









$scope.gamerTabSelected = true;
$scope.tabcolor_gamers = "border-bottom: 1px solid white;";
$scope.tabcolor_events = "border-bottom: none;";
$scope.activateTab = function(selected)
{
    if(selected == 'gamers')
    {
        $scope.tabcolor_gamers = "border-bottom: 1px solid white;";
        $scope.tabcolor_events = "border-bottom: none;";
        $scope.gamerTabSelected = true;
    }
    else if(selected == 'events')
    {
        $scope.tabcolor_gamers = "border-bottom: none;";
        $scope.tabcolor_events = "border-bottom: 1px solid white;";
        $scope.gamerTabSelected = false;
    }
};




}])
   
.controller('chatTabCtrl', ['$scope', '$stateParams', '$http', '$ionicTabsDelegate', 'Snapvar', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicTabsDelegate, Snapvar) {

$scope.snapval = Snapvar;
console.log("Lets take a look now: ", snapval);

$ionicTabsDelegate.showBar(true);
function chatter(id,name,online,avatar)
{
	this.id = id;
    this.name = name;
    this.online = online;
    this.avatar = avatar;
}

$scope.chatList = [];

var usr = firebase.auth().currentUser;
var usrID = usr.uid;

var gref = firebase.database().ref();
var userRef = gref.child('userData');

$scope.$on('$ionicView.beforeEnter', function() 
{
  $scope.chatList = [];
	var compareList = [];
	for(var j in $scope.chatList)
	{	
		compareList.push($scope.chatList[j].id);
	}
	userRef.orderByChild('ID').equalTo(usrID).once('child_added').then(function(snap){
        console.log("user's ID:",snap.key);
		firebase.database().ref("userData/"+ snap.key + "/friendList").once("value").then(
            function(success)
        {
			console.log("friendList ", success.val());
			if(success.val() !== null)
            {				
               for(var i in success.val())
               {					
					fid = success.val()[i].friendID
					
					if(compareList.indexOf(fid) > -1)
					{ continue;	}
					
				   console.log(fid);
				   userRef.orderByChild('ID').equalTo(fid).once('child_added').then(function(snap){
					   $scope.chatList.push(new chatter(fid, snap.val().name,snap.val().online, snap.val().avatar));
					   console.log("added!");
					   $scope.$apply();
				   });
					
				}
				
			 
			}
		});
	});
});
 

$scope.search = {text: ""};
$scope.searchName = function()
{
    $scope.nsearch = $scope.search.text;
};

console.log("end");

}])
      
.controller('mainScreenCtrl', ['$scope', '$stateParams', '$state', '$ionicTabsDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicTabsDelegate) {
    $ionicTabsDelegate.showBar(false);

   // for form inputs)
   /*
   navigator.geolocation.getCurrentPosition(function(success)
    {
      console.log(success);

      window.plugins.toast.show('Hello there!', 'long', 'center',
      function(a){console.log('toast success: ' + a)},
       function(b){alert('toast error: ' + b)});
      try
        {
          
            //1. Get plugin
            var bgLocationServices =  window.plugins.backgroundLocationServices;

            //2. Configure Plugin
            bgLocationServices.configure({
                 desiredAccuracy: 20, 
                 distanceFilter: 5, 
                 notificationTitle: 'BG Plugin', 
                 notificationText: 'Tracking',
                 debug: true, 
                 interval: 9000, 
                 fastestInterval: 5000
            });

            //3. Register a callback for location updates, this is where location objects will be sent in the background
            bgLocationServices.registerForLocationUpdates(function(location) {
                 console.log("We got a BG Update" + JSON.stringify(location));
            }, function(err) {
                 console.log("Error: Didn't get an update", err);
            });


             firebase.database().ref('userData').orderByChild('ID')
            .equalTo(firebase.auth().currentUser.uid).on('child_added',function(snap){
                try{
                  if(snap.val().online)
                  {
                      bgLocationServices.start();
                  }
                  else
                  {
                      bgLocationServices.stop();
                  }
                }catch(err)
                {
                  console.log("error: ", err);
                }});
        }
        catch(err)
        {
          console.log("error: ", err);
        }


    });*/


    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          console.log($state.current.name);
          if($state.current.name == "tabsController.mainScreen"){
              $state.go('tabsController.findGamersTab');
          }
         
      } else {
        // No user is signed in.
      }
});
           
            
    }])
   
.controller('loginCtrl', ['$scope', '$stateParams', '$ionicTabsDelegate', '$timeout', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicTabsDelegate,  $timeout,  $state) {

$ionicTabsDelegate.showBar(false);

    $scope.user = {
        email: "",
        password: ""
    };
    
    $scope.invalid = "";
    $scope.error = "";
    $scope.findUser = function(loginForm)
    {
        
        firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then
        (function(resolve)
        {
            console.log("User Logged in!");
            $ionicTabsDelegate.showBar(true);
            $state.go('tabsController.findGamersTab');
        },
        function(error)
        {
             $scope.error = error.message;
               $scope.invalid = "invalid";
               var turnoff = function(){$scope.invalid = "";};
               $timeout(turnoff, 500);
        });
        
           
         
        
    };



}])
   
.controller('eventSignUpCtrl', ['$scope', '$stateParams', '$ionicTabsDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicTabsDelegate) {

$ionicTabsDelegate.showBar(false);
 $scope.user = {
        eventName: "",
        companyName: "",
        email: "",
        password: ""
    };
    
    
    $scope.createUser = function(signupForm)
    {
       if(signupForm.$valid)
       {
           console.log($scope.user.eventName);
           console.log($scope.user.companyName);
           console.log($scope.user.email);
           console.log($scope.user.password);
       }
    };

}])
   
.controller('gamerSignUpCtrl', ['$scope', '$stateParams', '$timeout', '$state', '$firebaseArray', '$ionicTabsDelegate', '$cordovaCamera', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $timeout, $state, $firebaseArray,$ionicTabsDelegate, $cordovaCamera) {
   
   $ionicTabsDelegate.showBar(false);
    $scope.user = {
        name: "",
        email: "",
        password: "",
        birthday: "",
        image: "https://firebasestorage.googleapis.com/v0/b/ggeo-80068.appspot.com/o/ggeologo.png?alt=media&token=c5b63795-c813-4594-b897-e96f3d7993f5"
    };
    

    function b64toBlob(b64Data, contentType, sliceSize) {   //blobs galore
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }
        
      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }
    

    var randID = "";

    $scope.uploadPic = function()
	{
		console.log("upload picture");
		
		var options = {
            quality : 75,
            destinationType : 0, //URL = 0, URI = 1;
            sourceType : 0,
            allowEdit : true,
            encodingType: 0,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
		
        $cordovaCamera.getPicture(options).then(function(imageData) 
		    {
          console.log(imageData);
           var contentType = 'image/jpeg';
           var blob = b64toBlob(imageData, contentType);
           console.log("a new blob, ", blob);
           console.log("blobs URL, ", $scope.user.image);

            randID = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
           firebase.storage().ref().child('profilePics/' + randID + ".jpg").put(blob).
           then(function(snapshot) {
            console.log('Uploaded a blob !');
            $scope.user.image = snapshot.downloadURL;
            $scope.$apply();
          });


        });
	};
    




    $scope.error = '';
    $scope.invalid = "";
    
    $scope.createUser = function(signupForm)
    {
       if(signupForm.$valid)
       {
           var failed = false;
           firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
           .then
        (function(success)
        {
            var usr = firebase.auth().currentUser;
            var month = $scope.user.birthday.getUTCMonth() + 1; //months from 1-12
            var day = $scope.user.birthday.getUTCDate();
            var year = $scope.user.birthday.getUTCFullYear();
            var newdate = month + "/" + day + "/" + year;
            console.log(newdate);

             
            usr.updateProfile( {displayName: $scope.user.name, photoURL: $scope.user.image}).then(
                    function(success)
                    {
                        console.log("added name and image");
                        var ref = firebase.database().ref("userData");
                        var arr = $firebaseArray(ref);
                            arr.$add({
                                ID: usr.uid,
                                name: usr.displayName,
                                email: usr.email,
                                birthday: newdate,
                                bio: "",
                                online: false,
                                playing: "",
                                system: "",
                                avatar: $scope.user.image,
                								longitude: "",
                								latitude: ""
                            });
                            console.log("User Logged in!");
                             $state.go('tabsController.addGames');
                         
                    },
                    function(error)
                    {
                        console.log("couldn't add name and image");
                    });
                    
            
        },
        function(error)
        {
             $scope.error = error.message;
               $scope.invalid = "invalid";
               var turnoff = function(){$scope.invalid = "";};
               $timeout(turnoff, 500);
        });
       }
    };

}])
   
.controller('signUpChooserCtrl', ['$scope', '$stateParams', '$ionicTabsDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicTabsDelegate) {

$ionicTabsDelegate.showBar(false);
}])
   
.controller('addGamesCtrl', ['$scope', '$stateParams', '$http', '$firebaseArray', '$state', '$ionicTabsDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $firebaseArray, $state, $ionicTabsDelegate) {

    $ionicTabsDelegate.showBar(false);
    
     function gameItem(name, thumb,id)
    {
        this.name = name;
        this.thumbnail = thumb;
        this.id = id;
    }
    
   
    $scope.defaultImage = 'https://firebasestorage.googleapis.com/v0/b/ggeo-80068.appspot.com/o/ggeologo.png?alt=media&token=c5b63795-c813-4594-b897-e96f3d7993f5';
    $scope.gameList = [];
    
    //get request from internet game database
    $scope.g = {search: ""};
    

    $scope.searchGames = function()
    {
        console.log($scope.g.search);
        $scope.gameList = [];
        var req = {
         method: 'GET',
         url: "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&limit=50&offset=0&search="+$scope.g.search,
         headers: {
           'X-Mashape-Key': "bgpAB6G151mshZLv8rnL5l4q8Mhwp1nSn6ujsnJmQA6cgQohzT",
           "Accept": "application/json"
         }
        };
        
        $http(req).then(function(success)
        {
            for(var i in success.data)
            {
                
                
                console.log(success.data[i].id);
                $scope.gameList.push(new gameItem (success.data[i].name, $scope.defaultImage,success.data[i].id)); //to be changed
                
            }
        },
        function(fail)
        {
            console.log(fail);
        });
        
    };
    
  
   /*$scope.gameList.push(new gameItem("Halo 5: and some really long name",defaultImage));
    $scope.gameList.push(new gameItem("League of Legends",defaultImage));
    $scope.gameList.push(new gameItem("FIFA 16",defaultImage));
    $scope.gameList.push(new gameItem("Halo 4: and another really long name",defaultImage));
    $scope.gameList.push(new gameItem("Grand Theft Auto V",defaultImage));
    $scope.gameList.push(new gameItem("StarCraft 2",defaultImage));*/


    $scope.IconList = [];
    
   $scope.editIconList = function(checked,game)
   {
       if(checked)
       {
           $scope.IconList.push(game);
           console.log(game.id);
       }
       else
       {
           var i;
           for(i in $scope.IconList)
           {
               if( $scope.IconList[i] == game)
               {
                    $scope.IconList.splice(i,1);
               }
           }
       }
   };


function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

$scope.enterGGEO = function()
{
    var usr = firebase.auth().currentUser;
    var usrID = usr.uid;
    var gref = firebase.database().ref();
    var userRef = gref.child('userData');
    
    userRef.orderByChild('ID').equalTo(usrID).on('child_added',function(snap){
        firebase.database().ref("userData/" + snap.key).child("games").once('value').then(function(suc)
        {
            var idList = [];
             var temp = $scope.IconList.map(function(a) {return a.id;});
            if(suc.val() !== null){
                var p1 = [];
                for(var i in suc.val())
                {
                    p1.push(suc.val()[i].gID);
                }
               
                idList = temp.filter( function( el ) {
                  return p1.indexOf( el ) < 0;
                } );
            }
            else{
                idList = temp;
            }
           
           
            
            var finalList = uniq_fast(idList);
            console.log("finalList: ", finalList);
            for(var j in finalList)
            {
                firebase.database().ref("userData/"+snap.key).child("games").push({"gID": finalList[j], "stats":""});
            }
            
            for(var i in $scope.IconList)
            {
                firebase.database().ref("gameData/" + $scope.IconList[i].id).update($scope.IconList[i]);
            }
            //firebase.database().ref("gameData/" ).set($scope.IconList);
            //$ionicTabsDelegate.showBar(true); var directorz = function()
            
                    if($stateParams.toProfile){
                        $state.go('tabsController.profile');
                    }
                    else{
                        $state.go('tabsController.settings');
                    }
                     
      
           
        });
          
    });

    
    
    
};




}])
   
.controller('profileCtrl', ['$scope', '$stateParams', '$ionicTabsDelegate', '$ionicPopover', '$ionicModal', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicTabsDelegate, $ionicPopover, $ionicModal, $state) {

    $scope.defaultImage = 'https://firebasestorage.googleapis.com/v0/b/ggeo-80068.appspot.com/o/ggeologo.png?alt=media&token=c5b63795-c813-4594-b897-e96f3d7993f5';

    
    $ionicTabsDelegate.showBar(false);
    var usr = firebase.auth().currentUser;
    var usrID = usr.uid;
    $scope.userData = {
        name: usr.displayName,
        image: usr.photoURL
    };
    console.log("picture: ", usr.photoURL);
    
    $scope.stat = {text: ""};
    
    var snapval = "";
    function updateNumber()
    {
        for(var i in snapval.friendList)
            {
                if(snapval.friendList[i].confirmed === false)
                {
                     $scope.friendR += 1;
                }
            } 
    }
    
    $scope.friendR = 0;
    $scope.confirmList = [];
    $scope.bio = {text: ""};
    var snapkey = "";
    var ref = firebase.database().ref('userData');
    
    
    
    // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
      if($scope.friendR > 0){
          $scope.popover.show($event);
      }
    
  };
   
    $scope.addFriendClick = function()
    {
        $scope.confirmList = [];
        firebase.database().ref("userData/"+ snapkey + "/friendList")
        .orderByChild('confirmed').equalTo(false).once("value").then(
        function(success)
        {
            //console.log(success.val());
            if(success.val() !== null)
            {
               for(var i in success.val())
               {
                   var fid = success.val()[i].friendID;
                   console.log(success.val()[i].parent);
                   firebase.database().ref("userData").orderByChild('ID').equalTo(fid).on('child_added',function(snap){
                       console.log(snap.val().name);
                       //console.log(snap.val());
                       $scope.confirmList.push({"name": snap.val().name, "id": fid});
                   });
               }
            }
        });
    };
    
    
    $scope.confirmFriend = function(id)
    {
        firebase.database().ref("userData/"+ snapkey + "/friendList")
        .orderByChild('friendID').equalTo(id).once('child_added').then(function(snap)
        {
            snap.ref.update({"confirmed": true}).then(function(done){
                for(var i in $scope.confirmList)
                {
                    if($scope.confirmList[i].id == id)
                    {
                        $scope.confirmList.splice(i,1);
                        $scope.friendR -= 1;
                        $scope.$apply();
                    }
                }
            });
            
        });
        
    
      
    };
    
    $scope.denyFriend = function(id)
    {
        firebase.database().ref("userData/"+ snapkey + "/friendList")
        .orderByChild('friendID').equalTo(id).once('child_added').then(function(snap)
        {
            snap.ref.remove().then(function(done){
                firebase.database().ref("userData").orderByChild('ID').equalTo(id).on('child_added',function(snap){
                   snap.ref.child('friendList').orderByChild('friendID').equalTo(usrID).once('child_added').
                   then(function(crackle)
                    {
                        crackle.ref.remove();
                    });
               });
                for(var i in $scope.confirmList)
                {
                    if($scope.confirmList[i].id == id)
                    {
                        $scope.confirmList.splice(i,1);
                        $scope.friendR -= 1;
                        $scope.$apply();
                    }
                }
            });
            
        });
    };
    
    
    $scope.updateBio = function()
    {
        console.log("fired");
             firebase.database().ref("userData/"+snapkey).update({bio: $scope.bio.text});
    };
    
    
    
     function gameItem(name, thumb,id)
    {
        this.name = name;
        this.thumbnail = thumb;
        this.id = id;
    }
    
    $scope.IconList = [];
    
    var gref = firebase.database().ref();
    var userRef = gref.child('userData');
    

    
$scope.$on('$ionicView.beforeEnter', function() 
{
    ref.orderByChild('ID').equalTo(usrID).on('child_added',function(snap){
        snapkey = snap.key;
        snapval = snap.val();
        try{
            $scope.bio.text = snap.val().bio;
            updateNumber();
        }catch(err){}
        
        console.log("RUNNING ICON UPDATE");
   // userRef.orderByChild('ID').equalTo(usrID).on('value',function(snap){
        firebase.database().ref("userData/"+snapkey+"/games").once('value').then(
            function(dataSnapshot)
            {
                console.log("got first snapshot", dataSnapshot.val());
                var data = dataSnapshot.val();
                userRef = gref.child('gameData');
                for(var i in data)
                {
                    console.log("handeling, ", data[i]);
                    userRef.orderByChild('id').equalTo(data[i].gID).once("child_added").then(
                    function(snapshot)
                    {
                        var d = snapshot.val();
                        console.log("now pushing!: ", d.name);
                        $scope.IconList.push(new gameItem(d.name,d.thumbnail, d.id));
                    });
                    
                    /*var d = getsnap(data[i]);
                   // console.log(d);
                    $scope.IconList.push(new gameItem(d.name,d.thumbnail, d.id, data[i].stats));
                    /*userRef.orderByChild('id').equalTo(data[i].gID).once("child_added").then(
                    function(snapshot)
                    {
                        var d = snapshot.val();
                        $scope.IconList.push(new gameItem(d.name,d.thumbnail, d.id, data[i].stats));
                       
                    });*/
                }
                    $scope.$apply();
                  console.log($scope.IconList);
            });
  
             
    });
    
    
   // });
});



    

var thegid = "";
$scope.holdings = function(current)
{
    $scope.statName = current.name;
    firebase.database().ref("userData/" + snapkey + "/games").orderByChild("gID")
    .equalTo(current.id).once("child_added").then(function(pusher)
    {
        thegid = pusher.ref.key;
        //console.log("get loc: ", thegid);
       firebase.database().ref("userData/"+snapkey+"/games/"+thegid).child('stats').once('value').then(function(info)
        {
           $scope.stat = {text: info.val()}; 
           console.log("stat available ",  $scope.stat.text);
           $scope.$apply();
        });
    });
};


$scope.cancelStats = function(){
    $scope.modal.hide();    
};


$scope.submitStats = function()
{
    firebase.database().ref("userData/"+snapkey+"/games/"+thegid)
    .update({"stats": $scope.stat.text});
    $scope.modal.hide();
};


$ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

//console.log($scope.IconList);
    
   
}])
   
.controller('settingsCtrl', ['$scope', '$stateParams', '$state', '$ionicTabsDelegate', '$http', '$ionicPopover', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicTabsDelegate, $http, $ionicPopover) {
    

    $ionicTabsDelegate.showBar(false);
    var usr = firebase.auth().currentUser;
    var usrID = usr.uid;
    
    $scope.player = {online: false, isPlaying: "", system: ""};
    var snapkey = "";
    var ref = firebase.database().ref('userData');
    ref.orderByChild('ID').equalTo(usrID).on('child_added',function(snap){
        snapkey = snap.key;
        try{$scope.player.online = snap.val().online;
            $scope.player.isPlaying = snap.val().playing;
            $scope.player.system = snap.val().system;
            $scope.g = {search: snap.val().playing};
            
            for(var i in $scope.consoleList)
            {
                if($scope.player.system == $scope.consoleList[i].name)
                {
                    $scope.consoleList[i].click = true;
                    $scope.consoleList[i].colorToggle();
                }
            }
        }catch(err){}
    });
    
    $scope.g = {search: $scope.player.isPlaying};
    $scope.checked = false;
   $scope.setPlaying = function(checked, name){
       if(checked)
       {
         firebase.database().ref("userData/"+snapkey).update({playing: name});
         console.log("updating:" + name);
          $scope.g = {search: name};
         $scope.popover.hide();  
          $scope.$apply();
       }
    };
   
  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
   
    $scope.searchGames = function()
    {
        //console.log($scope.g.search);
        $scope.gameList = [];
        var req = {
         method: 'GET',
         url: "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&limit=50&offset=0&search="+$scope.g.search,
         headers: {
           'X-Mashape-Key': "bgpAB6G151mshZLv8rnL5l4q8Mhwp1nSn6ujsnJmQA6cgQohzT",
           "Accept": "application/json"
         }
        };
        
        $http(req).then(function(success)
        {
            for(var i in success.data)
            {
                //console.log(success.data[i].name);
                 $scope.gameList.push(success.data[i].name);
            }
        },
        function(fail)
        {
            console.log(fail);
        });
        
    };


    
    
    
    
    
    
    $scope.setSystem = function(name){
         firebase.database().ref("userData/"+snapkey).update({system: name});
    };
    

function cons(name,color,click)  //to be used with mySQL
{
    this.name = name;
    this.color = color;
    this.click = false;
    this.colorToggle = function(){
      if(this.click === false){
          return "#736d68";
      }  
      else{
          return this.color;
      }};
}


$scope.consoleList = [
    new cons("VR", "#6f5fbf", false),
    new cons("Mobile", "#5390f7", false),
    new cons("Xbox One", "#16b316", false),
    new cons("Playstation 4", "#241c79", false),
     new cons("Nintendo 3DS", "#800000", false),
     new cons("Wii U", "#d2c9c2", false),
    new cons("Playstation 3", "#4d44b1", false),
    new cons("PC", "#ec780e", false),
    new cons("Xbox 360", "#265a28", false),
    new cons("Nintendo Wii", "#86d0cb", false),
    new cons("Nintendo DS", "#6cb0c3", false),
    new cons("PSP", "#a3b0ea", false)
];

$scope.deselectOther = function(system){
    
    for(var i in $scope.consoleList)
    {
        if($scope.consoleList[i].name != system)
        {
            $scope.consoleList[i].click = false;
            $scope.consoleList[i].colorToggle();
        }
    }
};


    /*//4. Start the Background Tracker. When you enter the background tracking will start, and stop when you enter the foreground.
    bgLocationServices.start();


    ///later, to stop
    bgLocationServices.stop();
    */



	function getLocation() 
	{

		if($scope.player.online == true)
		{
			var watchID = navigator.geolocation.getCurrentPosition
			(function(success)
			{
				console.log("Got Location!");
				var longitude = success.coords.longitude;
				var latitude = success.coords.latitude;
				console.log(longitude, latitude, success.timestamp);

        firebase.database().ref("userData/"+snapkey).update({
          longitude: longitude,
          latitude: latitude});
        setTimeout(getLocation(), 3000);
			},

			function(fail)
			{
        getLocation();
				console.log("Couldn't get location. check your GPS settings.");
				console.log('code: ' + fail.code + '\n' +
        'message: ' + fail.message + '\n');
			}, 
			{ maximumAge: 0, timeout: 5000, enableHighAccuracy: true  });   //TEST ONLY!!
			// { maximumAge: 900000, timeout: 600000, enableHighAccuracy: true  }); //Actual
		}
		else{
			
			console.log("stopped getting location");
		}
		
	}

	
    $scope.isOnline = function(){
        firebase.database().ref("userData/"+snapkey).update({online: $scope.player.online});
		getLocation();
    };
    
	
	
    $scope.logout = function(){
      firebase.auth().signOut().then(function(success)
      {
          console.log("Now signed out.");
          $ionicTabsDelegate.showBar(false);
          $state.go('tabsController.mainScreen');
          
      },function(fail)
      {
          console.log(fail);
      });
    };

}])
   
.controller('chatPageCtrl', ['$scope', '$stateParams', '$ionicScrollDelegate', '$ionicTabsDelegate', '$firebaseArray', 'orderByFilter', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicScrollDelegate, $ionicTabsDelegate, $firebaseArray, orderByFilter) {
    
   $ionicTabsDelegate.showBar(true);
    $ionicScrollDelegate.scrollBottom();

    
    
    
    $scope.titleTag = $stateParams.gamer;

$scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };

var alternate,
    isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();


 $scope.data = {};
 $scope.myId = firebase.auth().currentUser.uid;
 $scope.messages = [];
 
 var myID = firebase.auth().currentUser.uid;
 var otherID = "";

var gref = firebase.database().ref();
var userRef = gref.child('userData');

userRef.orderByChild('name').equalTo($scope.titleTag).on('child_added',function(snap){
    console.log(snap.val());
    otherID = snap.val().ID;
     console.log(otherID);
     
     var uniqueMessageID = orderByFilter([
    {email: myID},
    {email: otherID}
],'email');

ref = firebase.database().ref().child("messages/" + uniqueMessageID[0].email + '_' + uniqueMessageID[1].email);
 $scope.messages = $firebaseArray(ref);

});

 
 $scope.sendMessage = function() {
    alternate = !alternate;

    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    
    
     $scope.messages.$add({
      userId: firebase.auth().currentUser.uid,
      text: $scope.data.message,
      time: d
     
    });
    $scope.data.message = "";
    $ionicScrollDelegate.scrollBottom();
     console.log($scope.data.message);
    
   
};
    
    
}])
   
.controller('pageCtrl', ['$scope', '$stateParams', '$http', '$ionicPopover', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $ionicPopover) {

$scope.gameList = [];
    
    //get request from internet game database
    $scope.g = {search: ""};
    $scope.checked = false;
   $scope.setPlaying = function(checked, name){
       if(checked)
       {
         //firebase.database().ref("userData/"+snapkey).update({playing: name});
         console.log("updating:" + name);
         $scope.popover.remove();  
       }
    };
   
  
  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
   
   
    


    
    

    $scope.searchGames = function()
    {
        console.log($scope.g.search);
        $scope.gameList = [];
        var req = {
         method: 'GET',
         url: "https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name&limit=50&offset=0&search="+$scope.g.search,
         headers: {
           'X-Mashape-Key': "bgpAB6G151mshZLv8rnL5l4q8Mhwp1nSn6ujsnJmQA6cgQohzT",
           "Accept": "application/json"
         }
        };
        
        $http(req).then(function(success)
        {
            for(var i in success.data)
            {
                console.log(success.data[i].name);
                 $scope.gameList.push(success.data[i].name);
            }
        },
        function(fail)
        {
            console.log(fail);
        });
        
    };






}







])
 