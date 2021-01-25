class NewMVVM {
    constructor(options) {
        this.$el = options.el
        this.$data = options.data
        if (this.$el) {
            // 把所有数据，属性劫持
            new Observer(this.$data)
            new Compiler(this.$el, this)
        }
    }
}
/**
 * 观察者 （发布订阅）
 */
class Dep {
    constructor() {
        this.subs = []
    }
    addSub(watcher) {
        // 订阅
        // 添加watcher
        this.subs.push(watcher)
    }
    notify() {
        // 发布
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}
class Watcher {
    constructor(vm, expr, cb) {
        console.log('Watcher',expr)
        this.vm = vm
        this.expr = expr
        this.cb = cb
        this.oldVal = this.get()
    }
    get() {
        console.log('watcher get')
        Dep.target = this
        let val = CompileUtl.getVal(this.vm, this.expr)
        Dep.target = null
        return val
    }
    update() {
        // 更新操作时，调用观察者update方法
        let newVal = CompileUtl.getVal(this.vm, this.expr)
        if (newVal !== this.oldVal) {
            this.cb(newVal)
        }
    }
}
class Observer {
    constructor(data) {
        this.observer(data)
    }
    observer(data) {
        // 是对象才观察
        if (data && typeof data === 'object') {
            // 遍历成Object.defineProperty()
            for (let key in data) {
                this.defineReactive(data, key, data[key])
            }
        }
    }
    defineReactive(obj, key, value) {
        this.observer(value)
        // 给每个属性都加上一个具有发布订阅的功能
        let dep = new Dep()
        Object.defineProperty(obj, key, {
            get() {
                console.log('defineProperty get',Dep.target,dep)
                // 创建watcher时，会取到对应内容
                // 将Dep上挂载的当前watcher实例，加入dep实例内部队列
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set: (newVal) => {
                console.log('defineProperty set')
                if (newVal != value) {
                    this.observer(newVal)
                    value = newVal
                    // 将dep实例中的watcher队列依次拿出来通知一下
                    dep.notify()
                }
            }
        })
        console.log('defineReactive finish', obj)
    }
}

class Compiler {
    constructor(el, vm) {
        console.log('Compiler constructor')
        this.vm = vm
        // 判断el是不是一个元素
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        // 获取文档碎片对象，放入内存中，减少页面的回流和重绘
        let fragment = this.node2fragment(this.el)
        // console.log(fragment)
        // 把节点中的内容进行替换

        // 用数据编译模板
        this.compile(fragment)
        // 把内容塞回页面中
        this.el.appendChild(fragment)
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
    compile(fragment) {
        let childNodes = fragment.childNodes;
        [...childNodes].forEach(child => {
            if (this.isElementNode(child)) {
                this.compileElement(child)
                this.compile(child)
            } else {
                this.compileText(child)
            }
        })
    }
    compileElement(node) {
        let attrs = node.attributes;
        // console.log(node, attrs);
        [...attrs].forEach(attr => {
            console.log(attr)
            // <input type="text" v-model="school.name">
            let { name, value: expr } = attr
            if (this.isDirective(name)) {
                let [, directive] = name.split('-')
                // 传入不同指令
                CompileUtl[directive](node, expr, this.vm)
            }
        })
    }
    compileText(node) {
        // 判断文本节点中是否包含{{}}
        let txtContent = node.textContent
        if (/\{\{(.+?)\}\}/.test(txtContent)) {
            CompileUtl['text'](node, txtContent, this.vm)  // {{a}} {{b}}
        }
    }
    /**
     * 判断是否是指令
     */
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    /***
     * 把节点移到内存中
     */
    node2fragment(node) {
        // 创建碎片
        let fragment = document.createDocumentFragment()
        let firstChild
        // 换行会占一个node位置，空的text节点，所以要循环取其中真实内容
        while (firstChild = node.firstChild) {
            // console.log('b', firstChild)
            fragment.appendChild(firstChild)
            // console.log('e', node.firstChild)
        }
        // let firstChild = node.firstChild
        // fragment.appendChild(firstChild)
        // console.log('fragment', fragment)
        return fragment
    }
}

let CompileUtl = {
    /**
     *
     * @param node 节点
     * @param expr 表达式：school.name
     * @param vm 当前实例 vm.$data
     */
    model(node, expr, vm) {
        // 给输入框赋予value属性 node.value =xxx
        let fn = this.updater['modelUpdater']
        new Watcher(vm, expr, (newVal) => {
            // 给输入框添加一个观察者，数据更新会触发此方法
            fn(node, newVal)
        })
        node.addEventListener('input', (e) => {
            console.log(e.target.value)
            this.setVal(vm, expr, e.target.value)

        })
        let value = this.getVal(vm, expr)
        fn(node, value)
    },
    text(node, content, vm) {  // content {{a}} {{b}}
        let fn = this.updater['textUpdater']
        let contentVar = content.replace(/\{\{(.+?)\}\}/g, (...args) => {
            new Watcher(vm, args[1], (newVal) => {
                fn(node, newVal)
            })
            return this.getVal(vm, args[1])
        })
        fn(node, contentVar)
    },
    getVal(vm, expr) {
        return expr.split('.').reduce((data, current) => {
            return data[current]
        }, vm.$data)
    },
    setVal(vm, expr, newVal) {
        let exprArray = expr.split('.')
        let i = 0
        return exprArray.reduce((data, current) => {
            if (exprArray.length - 1 === i) {
                data[current] = newVal
            }
            i++
            return data[current]
        }, vm.$data)
    },
    updater: {
        modelUpdater(node, value) {
            node.value = value
        },
        textUpdater(node, value) {
            node.textContent = value
        }
    }
}
