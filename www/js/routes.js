angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.findGamersTab', {
    url: '/findGamersTab',
    views: {
      'tab1': {
        templateUrl: 'templates/findGamersTab.html',
        controller: 'findGamersTabCtrl'
      }
    }
  })

  .state('tabsController.chatTab', {
    url: '/chatTab',
    views: {
      'tab3': {
        templateUrl: 'templates/chatTab.html',
        controller: 'chatTabCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.mainScreen', {
    url: '/mainScreen',
    views: {
      'tab1': {
        templateUrl: 'templates/mainScreen.html',
        controller: 'mainScreenCtrl'
      }
    }
  })

  .state('tabsController.login', {
    url: '/loginPage',
    views: {
      'tab1': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('eventSignUp', {
    url: '/eventSignUp',
    templateUrl: 'templates/eventSignUp.html',
    controller: 'eventSignUpCtrl'
  })

  .state('tabsController.gamerSignUp', {
    url: '/gamerSignUp',
    views: {
      'tab1': {
        templateUrl: 'templates/gamerSignUp.html',
        controller: 'gamerSignUpCtrl'
      }
    }
  })

  .state('signUpChooser', {
    url: '/signUp1',
    templateUrl: 'templates/signUpChooser.html',
    controller: 'signUpChooserCtrl'
  })

  .state('tabsController.addGames', {
    url: '/addGames/:toProfile',
    views: {
      'tab1': {
        templateUrl: 'templates/addGames.html',
        controller: 'addGamesCtrl'
      }
    }
  })

  .state('tabsController.profile', {
    url: '/profile',
    views: {
      'tab1': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('tabsController.settings', {
    url: '/settings',
    views: {
      'tab1': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('chatPage', {
    url: '/chatPage/:gamer',
    templateUrl: 'templates/chatPage.html',
    controller: 'chatPageCtrl'
  })

  .state('page', {
    url: '/page15',
    templateUrl: 'templates/page.html',
    controller: 'pageCtrl'
  })

$urlRouterProvider.otherwise('/page1/mainScreen')

  

});