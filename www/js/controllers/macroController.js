(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('MacroCtrl', MacroCtrl);

    MacroCtrl.$inject = ['$scope', 'DataService', 'localStorageService'];

    function MacroCtrl($scope, DataService, localStorageService) {
        var vm = this;
       
        vm.macroList = localStorageService.get('macros') != null ? localStorageService.get('macros') : [];

        activate();

        ////////////////

        function activate() {
            DataService.registerOutput(vm);
        }        
    }
}());
