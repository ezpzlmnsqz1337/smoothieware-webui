(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('MacroCtrl', MacroCtrl);

    MacroCtrl.$inject = ['$scope', 'DataService', 'localStorageService'];

    function MacroCtrl($scope, DataService, localStorageService) {
        var vm = this;
       
        activate();

        ////////////////

        function activate() {
            console.log('macroControllerActivated');
            DataService.registerOutput(vm);
        }        
    }
}());
