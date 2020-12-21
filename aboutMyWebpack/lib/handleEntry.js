var path = require('path')
var fs = require('fs')
// 将模块内容解析成AST
var babelParser = require('@babel/parser')
// 依赖收集
var babelTraverse = require('@babel/traverse')
// 解析成ES5
var babelCore = require('@babel/core')

// 第一步start：获取主入口模块内容
function getEntryFileContent(entryFile) {
    // var entryFile = path.resolve(__dirname, '../', entryFile)
    var entryFile = path.resolve(process.cwd(), entryFile)
    var fileContent = fs.readFileSync(entryFile, 'utf-8')
    // console.log(fileContent)
    return fileContent
}
// getEntryFileContent('./src/index.js')
// 第一步end

// 第二步start: npm install @babel/parser ；解析成AST语法书
function convertToAST(entryFile) {
    var fileContent = getEntryFileContent(entryFile)
    var ast = babelParser.parse(fileContent, {
        sourceType: 'module'  // 解析的是ES模块
    })
    // console.log(ast.program)
    return ast
}
// convertToAST('./src/index.js')
// 第二步end

// 第三步start: 依赖收集 npm install @babel/traverse
function dependenciesCollect(entryFile) {
    var depsObj = {}
    var ast = convertToAST(entryFile)
    babelTraverse.default(ast, {
        ImportDeclaration({ node }) {
            var abspath = path.resolve(__dirname, '../src', node.source.value)
            depsObj[node.source.value] = abspath
        }
    })
    console.log('xxxxxxxxxx')
    console.log(depsObj)
    return depsObj
}
dependenciesCollect('./src/index.js')
// dependenciesCollect('./src/add.js')
// 第三步end

// 第四步start: 解析成ES5 npm install @babel/core
function convertEScode(entryFile) {
    var ast = convertToAST(entryFile)
    var code = babelCore.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })
    console.log(code.code);
    return code.code
}
convertEScode('./src/index.js')
// convertEScode('./src/add.js')
// convertEScode('./src/minus.js')
// 第四步end

// 文件对象
module.exports = {
    dependenciesCollect,
    convertEScode
}
