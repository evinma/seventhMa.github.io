const PENDING = 'pending'; // 初始态
const FULFILLED = 'fulfilled'; // 成功态
const REJECTED = 'rejected'; // 失败态

function Promise(executor) {
    let self = this;// 缓存this
    self.status = PENDING;
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (value != null && value.then && typeof value.then == 'function') {
            return value.then(resolve, reject)
        }
        setTimeout(function () {
            if (self.status == PENDING) {
                self.status = FULFILLED
                self.value = value
                self.onResolvedCallbacks.forEach(function (item) {
                    item(self.value)
                })
            }
        })
    }

    function reject(reason) {
        setTimeout(function () {
            if (self.status == PENDING) {
                self.status = REJECTED
                self.value = reason
                self.onRejectedCallbacks.forEach(function (item) {
                    item(self.value)
                })
            }
        })
    }
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

function resolvePromise(p2, x, resolve, reject) {
    let called = false;
    if (p2 === x) {
        return reject(new TypeError('循环调用'))
    }
    if (x != null && ((typeof x == 'object') || (typeof x == 'function'))) {
        try {
            let then = x.then
            if (typeof then == 'function') {
                then.call(x, function (y) {
                    if (called) return;
                    called = true
                    resolvePromise(p2, y, resolve, reject)
                }, function (err) {
                    if (called) return;
                    called = true
                    reject(err)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) return;
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected == 'function' ? onRejected : reason => { throw reason }

    let self = this
    let p2
    if (self.status == FULFILLED) {
        return p2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onFulfilled(self.value)
                    resolvePromise(p2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
    if (self.status == REJECTED) {
        return p2 = new Promise(function (resolve, reject) {
            setTimeout(function () {
                try {
                    let x = onRejected(self.value)
                    resolvePromise(p2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }

    if (self.status == PENDING) {
        return p2 = new Promise(function (resolve, reject) {
            self.onResolvedCallbacks.push(function (value) {
                try {
                    let x = onFulfilled(value)
                    resolvePromise(p2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
            self.onRejectedCallbacks.push(function (value) {
                try {
                    let x = onRejected(value)
                    resolvePromise(p2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
}

let gen = function (times, cb) {
    let count = 0
    let result = []
    return function (i, value) {
        result[i] = value
        if (++count == times) {
            cb(result)
        }
    }
}
Promise.all = function (promises) {
    return new Promise(function (resolve, reject) {
        let resultFn = gen(promises.length, function (data) {
            resolve(data)
        })
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(function (data) {
                resultFn(i, data)
            },reject)
        }
    })

}

Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(resolve, reject)
        }
    })
}

Promise.resolve = function (value) {
    return new Promise(function (resolve, reject) {
        resolve(value)
    })
}

Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason)
    })
}
// 跑测试需要
Promise.deferred = Promise.defer = function () {
    var defer = {};
    defer.promise = new Promise(function (resolve, reject) {
        defer.resolve = resolve;
        defer.reject = reject;
    })
    return defer;
}

module.exports = Promise;
