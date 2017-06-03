var fs = require('fs-extra');

var dependencies = [
    ['node_modules/cordova-promise-fs/dist/CordovaPromiseFS.js','www/libs/CordovaPromiseFS.js'],
    ['node_modules/cordova-file-cache/dist/CordovaFileCache.js','www/libs/CordovaFileCache.js'],
    ['node_modules/jquery/dist/jquery.js','www/libs/jquery.js'],
    ['node_modules/moment/moment.js','www/libs/moment.js'],
    ['node_modules/imgcache.js/js/imgcache.js','www/libs/imgcache.js'],
    ['node_modules/font-awesome/css/font-awesome.min.css', 'www/libs/font-awesome.min.css']
];

dependencies.forEach(function(value) {
    fs.copy(value[0],value[1]);
});
