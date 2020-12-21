var fs = require('fs')
var handler = require('./handleEntry')
var packConf = require('../mywebpack.conf');
var entryFile = packConf.entry
var outputBundles = packConf.output
obj = {}
var temp = [{
    fileName: entryFile,
    fileCode: handler.convertEScode(entryFile),
    filedeps: handler.dependenciesCollect(entryFile)
}]
for (var i = 0; i < temp.length; i++) {
    console.log(temp.length)
    var fdeps = temp[i].filedeps
    if (fdeps) {
        for (var key in fdeps) {
            if (fdeps.hasOwnProperty(key)) {
                temp.push({
                    fileName: key,
                    fileCode: handler.convertEScode(fdeps[key]),
                    filedeps: handler.dependenciesCollect(fdeps[key])
                })
            }
        }
    }
}
console.log(temp)
function generateFiles() {
    let modules = "";
    temp.forEach(moduleInfo => {
        modules += `'${moduleInfo.fileName}' : function(module, exports, require) {${moduleInfo.fileCode}},`;
    })
    const bundle = `
(function (modules) {
    // 已经加载过的模块
    var installedModules = {};
    // 模块加载函数
    function require(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);
        module.l = true;
        return module.exports;
    }
    require('${entryFile}');
})({${modules}})
`;

    fs.writeFileSync(outputBundles, bundle, "utf-8");
}
generateFiles()