angular.module('app.services', [])

.factory('backcallFactory', ['$state','$ionicPlatform','$ionicHistory','$timeout',function($state,$ionicPlatform,$ionicHistory,$timeout){
 
var obj={}
    obj.backcallfun=function(){
		var backbutton=0;
       $ionicPlatform.registerBackButtonAction(function () {
          if ($state.current.name == "tabsController.findGamersTab") {
		  
		  if(backbutton==0){
            backbutton++;
              window.plugins.toast.showShortCenter('Press again to exit');
            $timeout(function(){backbutton=0;},5000);
        }else{
            navigator.app.exitApp();
        }
		  
      }else{
            $ionicHistory.nextViewOptions({
                 disableBack: true
                });
        $state.go('tabsController.findGamersTab');
        //go to home page
     }
        }, 100);//registerBackButton
}//backcallfun
return obj;
}]);

