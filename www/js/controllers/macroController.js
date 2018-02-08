(function () {
    'use strict';

    angular
        .module('smoothieApp')
        .controller('MacroCtrl', MacroCtrl);

    MacroCtrl.$inject = ['DataService', 'Upload'];

    function MacroCtrl(DataService, Upload) {
        var vm = this;

        vm.macroList = [];
        vm.currentUploadedMacro = {};

        vm.refreshMacros = refreshMacros;
        vm.print = print;
        vm.progress = progress;
        vm.abort = abort;
        vm.uploadMacro = uploadMacro;
        vm.deleteMacro = deleteMacro;

        activate();

        ////////////////

        function activate() {
            refreshMacros();
        }

        function refreshMacros() {
            console.log('RefreshMacros');

            DataService.runCommand("M20")
                .then(function (result_data) {
                    parseMacrolist(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function parseMacrolist(rawdata) {
            vm.macroList = [];
            var list = rawdata.split('\n');
            angular.forEach(list, function(value, key) {
                value = value.trim();
                console.log(value);
                if (value.match(/macro\.g(code)?$/)) {
                    var macro = {filename: value, uploading: false, percentage: 0};
                    vm.macroList.push(macro);
                }
            });
        }

        function print(macro) {
            console.log('print macro - ' + macro);

            DataService.runCommand("play /sd/" + macro)
                .then(function (result) {
                    console.log('Result: ' + result);
                });
        }

        function progress() {
            DataService.runCommand("progress")
                .then(function (result_data) {
                    DataService.broadcastCommand(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function abort() {
            DataService.runCommand("abort")
                .then(function (result_data) {
                    DataService.broadcastCommand(result_data);
                }, function (error) {
                    console.error(error.statusText);
                });
        }

        function uploadMacro(file) {            
            if (file) {                
                if (!file.name.match(/macro\.g(code)?$/)) {
                    DataService.broadcastCommand("Wrong filename '"+file.name+"'! Macros filenames must end with 'macro.gcode'\n");
                    return;
                }
                DataService.broadcastCommand("Uploading: " + file.name + "\n");

                vm.currentUploadedMacro = {filename: file.name, uploading: true, percentage: 0};
                vm.macroList.push(vm.currentUploadedMacro);

                Upload.http({
                    url: '/upload',
                    headers: {
                        'X-Filename': file.name
                    },
                    data: file
                }).then(function (resp) {
                    DataService.broadcastCommand("Upload successful.\n");
                    vm.currentUploadedMacro.uploading = false;

                    vm.refreshMacros();
                }, function (resp) {
                    DataService.broadcastCommand('Error status: ' + resp.status + "\n");
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    vm.currentUploadedMacro.percentage = progressPercentage;
                    console.log('Progress: ' + progressPercentage + '%');
                });
            }
        }

        function deleteMacro(macro) {
            DataService.runCommand("M30 " + macro.filename)
                .then(function (result_data) {
                    DataService.broadcastCommand("Deleted macro: " + macro.filename + "\n");
                    vm.refreshMacros();
                }, function (error) {
                    console.error(error.statusText);
                });
        }
    }
}());
