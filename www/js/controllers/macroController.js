(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('MacroCtrl', MacroCtrl);

    MacroCtrl.$inject = ['$scope', 'DataService', 'localStorageService', 'Upload'];

    function MacroCtrl($scope, DataService, localStorageService, Upload) {
        var vm = this;
       
        vm.macroList = localStorageService.get('macros') != null ? localStorageService.get('macros') : [];
        console.log(vm.macroList);  
        vm.currentUploadedFile = {};
        vm.createMacro = createMacro;
        vm.uploadMacro = uploadMacro;
        vm.runMacro = runMacro;
        vm.editMacro = editMacro;
        vm.saveMacro = saveMacro;
        vm.deleteMacro = deleteMacro;

        ////////////////

        function createMacro(){
            //create dummy macro
            var macro = {
                name: "NewMacro",
                uploading: false,
                percentage: 100,
                edit: true,
                content: "Put your macro text here"
            }
            vm.macroList.push(macro);
            //update local storage
            localStorageService.set('macros', vm.macroList);
        }

        function uploadMacro(file) {
            if (file) {
                DataService.broadcastCommand("Uploading: " + file.name + "\n");
                console.log(file);
                vm.currentUploadedFile = {name: file.name, uploading: true, percentage: 0, edit: false};
                vm.macroList.push(vm.currentUploadedFile);

                Upload.http({
                    url: '/upload',
                    headers: {
                        'X-Filename': file.name
                    },
                    data: file
                }).then(function (resp) {
                    DataService.broadcastCommand("Upload successful.\n");
                    //read macro file content
                    var file = vm.currentUploadedFile;
                    var fReader = new FileReader();
                    fReader.readAsText(file, "UTF-8");
                    fReader.onload = function (evt) {
                        file.fileContent = aReader.result;
                    }
                    file.uploading = false;
                    //add files to local storage
                    localStorageService.set('macros', vm.macroList);
                    
                    console.log(vm.macroList);

                }, function (resp) {
                    DataService.broadcastCommand('Error status: ' + resp.status + "\n");
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    vm.currentUploadedFile.percentage = progressPercentage;
                    console.log('Progress: ' + progressPercentage + '%');
                });
            }
        }

        function runMacro(macro) {

        }

        function editMacro(macro) {            
            macro.edit = true;
        }

        function saveMacro(macro) {
            macro.edit = false;
            //save to localstorage
            localStorageService.set('macros', vm.macroList);
        }

        function deleteMacro(macro) {
            //remove element from the array
            var index = vm.macroList.indexOf(macro);
            if (index > -1){
                vm.macroList.splice(index,1);
            }
            //update localstorage
            localStorageService.set('macros', vm.macroList);            
        }
    }
}());
