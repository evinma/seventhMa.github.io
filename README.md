#### promise简述

> 概念理解

  promise译为"承诺"，意思就是承诺以后要做什么事情；现在承诺要在以后的某个时间或者某个地点做什么；联想到js中就是承诺在某个逻辑时间点执行什么操作。即处理js中的异步调用。
> promise周边

promise三种状态：

```
pending(初始态)：promise实例创建时候的状态
fulfilled(成功态)：promise实例逻辑执行成功时的状态
rejected(失败态)：promise实例逻辑执行失败时的状态
```
promise状态改变只有两种情况：

```
// pending => fulfilled (初始态到成功态)
// pending => reject (初始态到失败态度)
```
> promise使用

```
// Promise实例创建需要传一个function
// function中会有两个参数，两个参数类型都是function类型；分别是resolve和reject
// Promise实例状态为成功时会调用resolve方法；状态为失败时调用reject方法

let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        let count = Math.random()
        if (count > 0.5) {
            resolve(count)
        } else {
            reject(count)
        }
    }, 1000)
})


// 注册promise成功或者失败的回调方法
let successCb = (value) => {
    console.log(value, '成功')
}
let failCb = (err) => {
    console.log(err, '失败')
}

// then方法接受两个参数，第一个为成功回调，第二个为失败的回调
// 成功的回调会传入一个成功的返回值，失败的回调会传入失败的err信息
promise.then(successCb, failCb)

// 或者可以链式调用
promise
    .then(successCb)
    .catch(failCb)
    
//promise.then方法会返回一个新的promise实例，所有可以实现链式调用

let successCb1 = (value) => {
    console.log(value, '成功1')
}

promise
    .then(successCb)
    .then(successCb1)
    .catch(failCb)
```
> Promise 简单实现

```
// es5
var Promise = function (task) {
    var self = this
    
    self.onFulfilleds = []
    self.onRejecteds = []
    function resolve(value) {
        this.onFulfilleds.forEach(function(item, index) {
            item(value)
        })
    }
    
    function reject(value) {
        this.onRejecteds.forEach(function(item, index) {
            item(value)
        })
    }
    
    try {
        task(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    var self = this
    
    return new Promise(function(resolve, reject) {
        self.onFulfilleds.push(onFulfilled)
        self.onRejecteds.push(onRejected) 
    })
}

// promiseAry promise数组
Promise.all = function (promiseAry) {
    
    return new Promise(function(resolve, reject) {
        var result = []
        var count = 0
        promiseAry.forEach(function(item, index) {
            item
                .then(function(data) {
                    result[i] = data
                    if (count++ == promiseAry.length - 1) {
                        resolve(result)
                    }
                }, function(err) {
                    reject(err)
                })
       })
    })
}

Promise.race = function (promiseAry) {
    var result
    var resolver = function (value) {
        resolve(value)
    }
    return new Promise(function(resolve, reject) {
        var result
        promiseAry.forEach(function(item, index) {
            item
                .then(resolver，reject)
        })
    })
}

Promise.resolve = function (value) {
    return this.onFulfilled(value)
}
Promise.reject = function (err) {
    return this.onRejected(err)
}


// es6
class Promise {
    constructor (task) {
        let self = this
        self.onFulfilleds = []
        self.onRejecteds = []
        function resolve(value) {
            self.onFulfilleds.forEach(function(item, index) {
                item(value)
            })
        }
    
        function reject(value) {
            self.onRejecteds.forEach(function(item, index) {
                item(value)
            })
        }
    
        try {
            task(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    
    static all (promiseAry) {
        return new Promise(function(resolve, reject) {
            var result = []
            var count = 0
            promiseAry.forEach(function(item, index) {
                item
                    .then((data) => {
                        result[i] = data
                        if (count++ == promiseAry.length - 1) {
                            resolve(result)
                        }
                    },(err) => {
                        reject(err)
                    })
           })
    })
    }
    
    then (onFulfilled, onRejected) {
        var self = this
        
        return new Promise(() => {
            self.onFulfilleds.push(onFulfilled)
            self.onRejecteds.push(onRejected)  
        })
    }
}
```

> 结论

Promise是一种处理异步逻辑的方案；它存储着在未来某个时间点的”承诺“；
特点：

* promise对象的状态外界无法改变；只有异步操作的结果可以决定promise的状态
* 一旦promise状态改变，就不会再变；之后任何时候都可以得到这结果，即使添加更多的回调函数也会立即得到这结果

缺点：

* promise一旦建立就无法取消
* 如果不设置回调函数，promise内部抛出的错误外边无法获取到
* promise处于pending状态时，不知道promise执行的具体进度（刚开始执行还是快要执行结束）

相关参考:
* [Promise/A+规范](https://promisesaplus.com/)
* [Promise迷你书（中文版）](http://liubin.org/promises-book/)

    

