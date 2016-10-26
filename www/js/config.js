/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module('app.config', [])

.config(function($ionicConfigProvider) {
$ionicConfigProvider.tabs.position('bottom');
ionic.Platform.setPlatform('ios');
$ionicConfigProvider.backButton.previousTitleText('');
$ionicConfigProvider.backButton.text('');

}
);

