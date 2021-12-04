let my_assets = {}, pwa_version, pwa_root;

const offline_statustext = 'Serviceworker says: you are offline';

// idb kv store https://github.com/xuset/idb-kv-store
(function (e) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = e()
    } else if (typeof define === "function" && define.amd) {
        define([], e)
    } else {
        var t;
        if (typeof window !== "undefined") {
            t = window
        } else if (typeof global !== "undefined") {
            t = global
        } else if (typeof self !== "undefined") {
            t = self
        } else {
            t = this
        }
        t.IdbKvStore = e()
    }
})(function () {
    var e, t, r;
    return function () {
        function l(o, s, u) {
            function a(r, e) {
                if (!s[r]) {
                    if (!o[r]) {
                        var t = "function" == typeof require && require;
                        if (!e && t) return t(r, !0);
                        if (f) return f(r, !0);
                        var n = new Error("Cannot find module '" + r + "'");
                        throw n.code = "MODULE_NOT_FOUND", n
                    }
                    var i = s[r] = {exports: {}};
                    o[r][0].call(i.exports, function (e) {
                        var t = o[r][1][e];
                        return a(t || e)
                    }, i, i.exports, l, o, s, u)
                }
                return s[r].exports
            }

            for (var f = "function" == typeof require && require, e = 0; e < u.length; e++) a(u[e]);
            return a
        }

        return l
    }()({
        1: [function (e, t, r) {
            var a = Object.create || E;
            var u = Object.keys || j;
            var o = Function.prototype.bind || k;

            function n() {
                if (!this._events || !Object.prototype.hasOwnProperty.call(this, "_events")) {
                    this._events = a(null);
                    this._eventsCount = 0
                }
                this._maxListeners = this._maxListeners || undefined
            }

            t.exports = n;
            n.EventEmitter = n;
            n.prototype._events = undefined;
            n.prototype._maxListeners = undefined;
            var i = 10;
            var s;
            try {
                var f = {};
                if (Object.defineProperty) Object.defineProperty(f, "x", {value: 0});
                s = f.x === 0
            } catch (e) {
                s = false
            }
            if (s) {
                Object.defineProperty(n, "defaultMaxListeners", {
                    enumerable: true, get: function () {
                        return i
                    }, set: function (e) {
                        if (typeof e !== "number" || e < 0 || e !== e) throw new TypeError('"defaultMaxListeners" must be a positive number');
                        i = e
                    }
                })
            } else {
                n.defaultMaxListeners = i
            }
            n.prototype.setMaxListeners = function e(t) {
                if (typeof t !== "number" || t < 0 || isNaN(t)) throw new TypeError('"n" argument must be a positive number');
                this._maxListeners = t;
                return this
            };

            function l(e) {
                if (e._maxListeners === undefined) return n.defaultMaxListeners;
                return e._maxListeners
            }

            n.prototype.getMaxListeners = function e() {
                return l(this)
            };

            function c(e, t, r) {
                if (t) e.call(r); else {
                    var n = e.length;
                    var i = b(e, n);
                    for (var o = 0; o < n; ++o) i[o].call(r)
                }
            }

            function h(e, t, r, n) {
                if (t) e.call(r, n); else {
                    var i = e.length;
                    var o = b(e, i);
                    for (var s = 0; s < i; ++s) o[s].call(r, n)
                }
            }

            function p(e, t, r, n, i) {
                if (t) e.call(r, n, i); else {
                    var o = e.length;
                    var s = b(e, o);
                    for (var u = 0; u < o; ++u) s[u].call(r, n, i)
                }
            }

            function v(e, t, r, n, i, o) {
                if (t) e.call(r, n, i, o); else {
                    var s = e.length;
                    var u = b(e, s);
                    for (var a = 0; a < s; ++a) u[a].call(r, n, i, o)
                }
            }

            function d(e, t, r, n) {
                if (t) e.apply(r, n); else {
                    var i = e.length;
                    var o = b(e, i);
                    for (var s = 0; s < i; ++s) o[s].apply(r, n)
                }
            }

            n.prototype.emit = function e(t) {
                var r, n, i, o, s, u;
                var a = t === "error";
                u = this._events;
                if (u) a = a && u.error == null; else if (!a) return false;
                if (a) {
                    if (arguments.length > 1) r = arguments[1];
                    if (r instanceof Error) {
                        throw r
                    } else {
                        var f = new Error('Unhandled "error" event. (' + r + ")");
                        f.context = r;
                        throw f
                    }
                    return false
                }
                n = u[t];
                if (!n) return false;
                var l = typeof n === "function";
                i = arguments.length;
                switch (i) {
                    case 1:
                        c(n, l, this);
                        break;
                    case 2:
                        h(n, l, this, arguments[1]);
                        break;
                    case 3:
                        p(n, l, this, arguments[1], arguments[2]);
                        break;
                    case 4:
                        v(n, l, this, arguments[1], arguments[2], arguments[3]);
                        break;
                    default:
                        o = new Array(i - 1);
                        for (s = 1; s < i; s++) o[s - 1] = arguments[s];
                        d(n, l, this, o)
                }
                return true
            };

            function y(e, t, r, n) {
                var i;
                var o;
                var s;
                if (typeof r !== "function") throw new TypeError('"listener" argument must be a function');
                o = e._events;
                if (!o) {
                    o = e._events = a(null);
                    e._eventsCount = 0
                } else {
                    if (o.newListener) {
                        e.emit("newListener", t, r.listener ? r.listener : r);
                        o = e._events
                    }
                    s = o[t]
                }
                if (!s) {
                    s = o[t] = r;
                    ++e._eventsCount
                } else {
                    if (typeof s === "function") {
                        s = o[t] = n ? [r, s] : [s, r]
                    } else {
                        if (n) {
                            s.unshift(r)
                        } else {
                            s.push(r)
                        }
                    }
                    if (!s.warned) {
                        i = l(e);
                        if (i && i > 0 && s.length > i) {
                            s.warned = true;
                            var u = new Error("Possible EventEmitter memory leak detected. " + s.length + ' "' + String(t) + '" listeners ' + "added. Use emitter.setMaxListeners() to " + "increase limit.");
                            u.name = "MaxListenersExceededWarning";
                            u.emitter = e;
                            u.type = t;
                            u.count = s.length;
                            if (typeof console === "object" && console.warn) {
                                console.warn("%s: %s", u.name, u.message)
                            }
                        }
                    }
                }
                return e
            }

            n.prototype.addListener = function e(t, r) {
                return y(this, t, r, false)
            };
            n.prototype.on = n.prototype.addListener;
            n.prototype.prependListener = function e(t, r) {
                return y(this, t, r, true)
            };

            function _() {
                if (!this.fired) {
                    this.target.removeListener(this.type, this.wrapFn);
                    this.fired = true;
                    switch (arguments.length) {
                        case 0:
                            return this.listener.call(this.target);
                        case 1:
                            return this.listener.call(this.target, arguments[0]);
                        case 2:
                            return this.listener.call(this.target, arguments[0], arguments[1]);
                        case 3:
                            return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);
                        default:
                            var e = new Array(arguments.length);
                            for (var t = 0; t < e.length; ++t) e[t] = arguments[t];
                            this.listener.apply(this.target, e)
                    }
                }
            }

            function m(e, t, r) {
                var n = {fired: false, wrapFn: undefined, target: e, type: t, listener: r};
                var i = o.call(_, n);
                i.listener = r;
                n.wrapFn = i;
                return i
            }

            n.prototype.once = function e(t, r) {
                if (typeof r !== "function") throw new TypeError('"listener" argument must be a function');
                this.on(t, m(this, t, r));
                return this
            };
            n.prototype.prependOnceListener = function e(t, r) {
                if (typeof r !== "function") throw new TypeError('"listener" argument must be a function');
                this.prependListener(t, m(this, t, r));
                return this
            };
            n.prototype.removeListener = function e(t, r) {
                var n, i, o, s, u;
                if (typeof r !== "function") throw new TypeError('"listener" argument must be a function');
                i = this._events;
                if (!i) return this;
                n = i[t];
                if (!n) return this;
                if (n === r || n.listener === r) {
                    if (--this._eventsCount === 0) this._events = a(null); else {
                        delete i[t];
                        if (i.removeListener) this.emit("removeListener", t, n.listener || r)
                    }
                } else if (typeof n !== "function") {
                    o = -1;
                    for (s = n.length - 1; s >= 0; s--) {
                        if (n[s] === r || n[s].listener === r) {
                            u = n[s].listener;
                            o = s;
                            break
                        }
                    }
                    if (o < 0) return this;
                    if (o === 0) n.shift(); else g(n, o);
                    if (n.length === 1) i[t] = n[0];
                    if (i.removeListener) this.emit("removeListener", t, u || r)
                }
                return this
            };
            n.prototype.removeAllListeners = function e(t) {
                var r, n, i;
                n = this._events;
                if (!n) return this;
                if (!n.removeListener) {
                    if (arguments.length === 0) {
                        this._events = a(null);
                        this._eventsCount = 0
                    } else if (n[t]) {
                        if (--this._eventsCount === 0) this._events = a(null); else delete n[t]
                    }
                    return this
                }
                if (arguments.length === 0) {
                    var o = u(n);
                    var s;
                    for (i = 0; i < o.length; ++i) {
                        s = o[i];
                        if (s === "removeListener") continue;
                        this.removeAllListeners(s)
                    }
                    this.removeAllListeners("removeListener");
                    this._events = a(null);
                    this._eventsCount = 0;
                    return this
                }
                r = n[t];
                if (typeof r === "function") {
                    this.removeListener(t, r)
                } else if (r) {
                    for (i = r.length - 1; i >= 0; i--) {
                        this.removeListener(t, r[i])
                    }
                }
                return this
            };
            n.prototype.listeners = function e(t) {
                var r;
                var n;
                var i = this._events;
                if (!i) n = []; else {
                    r = i[t];
                    if (!r) n = []; else if (typeof r === "function") n = [r.listener || r]; else n = L(r)
                }
                return n
            };
            n.listenerCount = function (e, t) {
                if (typeof e.listenerCount === "function") {
                    return e.listenerCount(t)
                } else {
                    return w.call(e, t)
                }
            };
            n.prototype.listenerCount = w;

            function w(e) {
                var t = this._events;
                if (t) {
                    var r = t[e];
                    if (typeof r === "function") {
                        return 1
                    } else if (r) {
                        return r.length
                    }
                }
                return 0
            }

            n.prototype.eventNames = function e() {
                return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : []
            };

            function g(e, t) {
                for (var r = t, n = r + 1, i = e.length; n < i; r += 1, n += 1) e[r] = e[n];
                e.pop()
            }

            function b(e, t) {
                var r = new Array(t);
                for (var n = 0; n < t; ++n) r[n] = e[n];
                return r
            }

            function L(e) {
                var t = new Array(e.length);
                for (var r = 0; r < t.length; ++r) {
                    t[r] = e[r].listener || e[r]
                }
                return t
            }

            function E(e) {
                var t = function () {
                };
                t.prototype = e;
                return new t
            }

            function j(e) {
                var t = [];
                for (var r in e) if (Object.prototype.hasOwnProperty.call(e, r)) {
                    t.push(r)
                }
                return r
            }

            function k(e) {
                var t = this;
                return function () {
                    return t.apply(e, arguments)
                }
            }
        }, {}], 2: [function (e, t, r) {
            if (typeof Object.create === "function") {
                t.exports = function e(t, r) {
                    t.super_ = r;
                    t.prototype = Object.create(r.prototype, {
                        constructor: {
                            value: t,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    })
                }
            } else {
                t.exports = function e(t, r) {
                    t.super_ = r;
                    var n = function () {
                    };
                    n.prototype = r.prototype;
                    t.prototype = new n;
                    t.prototype.constructor = t
                }
            }
        }, {}], 3: [function (e, t, r) {
            t.exports = n;

            function n(r) {
                var n;
                var i;
                var o;
                if (r != null && typeof r !== "function") throw new Error("cb must be a function");
                if (r == null && typeof Promise !== "undefined") {
                    n = new Promise(function (e, t) {
                        i = e;
                        o = t
                    })
                }

                function e(e, t) {
                    if (n) {
                        if (e) o(e); else i(t)
                    } else {
                        if (r) r(e, t); else if (e) throw e
                    }
                }

                e.promise = n;
                return e
            }
        }, {}], "/": [function (e, t, r) {
            t.exports = y;
            var p = e("events").EventEmitter;
            var n = e("inherits");
            var f = e("promisize");
            var v = typeof window === "undefined" ? self : window;
            var d = v.indexedDB || v.mozIndexedDB || v.webkitIndexedDB || v.msIndexedDB;
            y.INDEXEDDB_SUPPORT = d != null;
            y.BROADCAST_SUPPORT = v.BroadcastChannel != null;
            n(y, p);

            function y(e, t, r) {
                var n = this;
                if (typeof e !== "string") throw new Error("A name must be supplied of type string");
                if (!d) throw new Error("IndexedDB not supported");
                if (typeof t === "function") return new y(e, null, t);
                if (!(n instanceof y)) return new y(e, t, r);
                if (!t) t = {};
                p.call(n);
                n._db = null;
                n._closed = false;
                n._channel = null;
                n._waiters = [];
                var i = t.channel || v.BroadcastChannel;
                if (i) {
                    n._channel = new i(e);
                    n._channel.onmessage = h
                }
                var o = d.open(e);
                o.onerror = s;
                o.onsuccess = a;
                o.onupgradeneeded = f;
                n.on("newListener", c);

                function s(e) {
                    _(e);
                    n._close(e.target.error);
                    if (r) r(e.target.error)
                }

                function u(e) {
                    _(e);
                    n._close(e.target.error)
                }

                function a(e) {
                    if (n._closed) {
                        e.target.result.close()
                    } else {
                        n._db = e.target.result;
                        n._db.onclose = l;
                        n._db.onerror = u;
                        for (var t in n._waiters) n._waiters[t]._init(null);
                        n._waiters = null;
                        if (r) r(null);
                        n.emit("open")
                    }
                }

                function f(e) {
                    var t = e.target.result;
                    t.createObjectStore("kv", {autoIncrement: true})
                }

                function l() {
                    n._close()
                }

                function c(e) {
                    if (e !== "add" && e !== "set" && e !== "remove") return;
                    if (!n._channel) return n.emit("error", new Error("No BroadcastChannel support"))
                }

                function h(e) {
                    if (e.data.method === "add") n.emit("add", e.data); else if (e.data.method === "set") n.emit("set", e.data); else if (e.data.method === "remove") n.emit("remove", e.data)
                }
            }

            y.prototype.get = function (e, t) {
                return this.transaction("readonly").get(e, t)
            };
            y.prototype.getMultiple = function (e, t) {
                return this.transaction("readonly").getMultiple(e, t)
            };
            y.prototype.set = function (e, t, r) {
                r = f(r);
                var n = null;
                var i = this.transaction("readwrite", function (e) {
                    n = n || e;
                    r(n)
                });
                i.set(e, t, function (e) {
                    n = e
                });
                return r.promise
            };
            y.prototype.json = function (e, t) {
                return this.transaction("readonly").json(e, t)
            };
            y.prototype.keys = function (e, t) {
                return this.transaction("readonly").keys(e, t)
            };
            y.prototype.values = function (e, t) {
                return this.transaction("readonly").values(e, t)
            };
            y.prototype.remove = function (e, t) {
                t = f(t);
                var r = null;
                var n = this.transaction("readwrite", function (e) {
                    r = r || e;
                    t(r)
                });
                n.remove(e, function (e) {
                    r = e
                });
                return t.promise
            };
            y.prototype.clear = function (t) {
                t = f(t);
                var r = null;
                var e = this.transaction("readwrite", function (e) {
                    r = r || e;
                    t(r)
                });
                e.clear(function (e) {
                    r = e
                });
                return t.promise
            };
            y.prototype.count = function (e, t) {
                return this.transaction("readonly").count(e, t)
            };
            y.prototype.add = function (e, t, r) {
                r = f(r);
                var n = null;
                var i = this.transaction("readwrite", function (e) {
                    n = n || e;
                    r(n)
                });
                i.add(e, t, function (e) {
                    n = e
                });
                return r.promise
            };
            y.prototype.iterator = function (e, t) {
                return this.transaction("readonly").iterator(e, t)
            };
            y.prototype.transaction = function (e, t) {
                if (this._closed) throw new Error("Database is closed");
                var r = new i(this, e, t);
                if (this._db) r._init(null); else this._waiters.push(r);
                return r
            };
            y.prototype.close = function () {
                this._close()
            };
            y.prototype._close = function (e) {
                if (this._closed) return;
                this._closed = true;
                if (this._db) this._db.close();
                if (this._channel) this._channel.close();
                this._db = null;
                this._channel = null;
                if (e) this.emit("error", e);
                this.emit("close");
                for (var t in this._waiters) this._waiters[t]._init(e || new Error("Database is closed"));
                this._waiters = null;
                this.removeAllListeners()
            };

            function i(e, t, r) {
                if (typeof t === "function") return new i(e, null, t);
                this._kvStore = e;
                this._mode = t || "readwrite";
                this._objectStore = null;
                this._waiters = null;
                this.finished = false;
                this.onfinish = f(r);
                this.done = this.onfinish.promise;
                if (this._mode !== "readonly" && this._mode !== "readwrite") {
                    throw new Error('mode must be either "readonly" or "readwrite"')
                }
            }

            i.prototype._init = function (e) {
                var t = this;
                if (t.finished) return;
                if (e) return t._close(e);
                var r = t._kvStore._db.transaction("kv", t._mode);
                r.oncomplete = i;
                r.onerror = o;
                r.onabort = o;
                t._objectStore = r.objectStore("kv");
                for (var n in t._waiters) t._waiters[n](null, t._objectStore);
                t._waiters = null;

                function i() {
                    t._close(null)
                }

                function o(e) {
                    _(e);
                    t._close(e.target.error)
                }
            };
            i.prototype._getObjectStore = function (e) {
                if (this.finished) throw new Error("Transaction is finished");
                if (this._objectStore) return e(null, this._objectStore);
                this._waiters = this._waiters || [];
                this._waiters.push(e)
            };
            i.prototype.set = function (n, i, o) {
                var s = this;
                if (n == null || i == null) throw new Error("A key and value must be given");
                o = f(o);
                s._getObjectStore(function (e, t) {
                    if (e) return o(e);
                    try {
                        var r = t.put(i, n)
                    } catch (e) {
                        return o(e)
                    }
                    r.onerror = _.bind(this, o);
                    r.onsuccess = function () {
                        if (s._kvStore._channel) {
                            s._kvStore._channel.postMessage({method: "set", key: n, value: i})
                        }
                        o(null)
                    }
                });
                return o.promise
            };
            i.prototype.add = function (n, i, o) {
                var s = this;
                if (i == null && n != null) return s.add(undefined, n, o);
                if (typeof i === "function" || i == null && o == null) return s.add(undefined, n, i);
                if (i == null) throw new Error("A value must be provided as an argument");
                o = f(o);
                s._getObjectStore(function (e, t) {
                    if (e) return o(e);
                    try {
                        var r = n == null ? t.add(i) : t.add(i, n)
                    } catch (e) {
                        return o(e)
                    }
                    r.onerror = _.bind(this, o);
                    r.onsuccess = function () {
                        if (s._kvStore._channel) {
                            s._kvStore._channel.postMessage({method: "add", key: n, value: i})
                        }
                        o(null)
                    }
                });
                return o.promise
            };
            i.prototype.get = function (n, i) {
                var e = this;
                if (n == null) throw new Error("A key must be given as an argument");
                i = f(i);
                e._getObjectStore(function (e, t) {
                    if (e) return i(e);
                    try {
                        var r = t.get(n)
                    } catch (e) {
                        return i(e)
                    }
                    r.onerror = _.bind(this, i);
                    r.onsuccess = function (e) {
                        i(null, e.target.result)
                    }
                });
                return i.promise
            };
            i.prototype.getMultiple = function (u, a) {
                var e = this;
                if (u == null) throw new Error("An array of keys must be given as an argument");
                a = f(a);
                if (u.length === 0) {
                    a(null, []);
                    return a.promise
                }
                e._getObjectStore(function (e, t) {
                    if (e) return a(e);
                    var n = u.slice().sort();
                    var i = 0;
                    var o = {};
                    var s = function () {
                        return u.map(function (e) {
                            return o[e]
                        })
                    };
                    var r = t.openCursor();
                    r.onerror = _.bind(this, a);
                    r.onsuccess = function (e) {
                        var t = e.target.result;
                        if (!t) {
                            a(null, s());
                            return
                        }
                        var r = t.key;
                        while (r > n[i]) {
                            ++i;
                            if (i === n.length) {
                                a(null, s());
                                return
                            }
                        }
                        if (r === n[i]) {
                            o[r] = t.value;
                            t.continue()
                        } else {
                            t.continue(n[i])
                        }
                    }
                });
                return a.promise
            };
            i.prototype.json = function (e, r) {
                var t = this;
                if (typeof e === "function") return t.json(null, e);
                r = f(r);
                var n = {};
                t.iterator(e, function (e, t) {
                    if (e) return r(e);
                    if (t) {
                        n[t.key] = t.value;
                        t.continue()
                    } else {
                        r(null, n)
                    }
                });
                return r.promise
            };
            i.prototype.keys = function (e, r) {
                var t = this;
                if (typeof e === "function") return t.keys(null, e);
                r = f(r);
                var n = [];
                t.iterator(e, function (e, t) {
                    if (e) return r(e);
                    if (t) {
                        n.push(t.key);
                        t.continue()
                    } else {
                        r(null, n)
                    }
                });
                return r.promise
            };
            i.prototype.values = function (e, r) {
                var t = this;
                if (typeof e === "function") return t.values(null, e);
                r = f(r);
                var n = [];
                t.iterator(e, function (e, t) {
                    if (e) return r(e);
                    if (t) {
                        n.push(t.value);
                        t.continue()
                    } else {
                        r(null, n)
                    }
                });
                return r.promise
            };
            i.prototype.remove = function (n, i) {
                var o = this;
                if (n == null) throw new Error("A key must be given as an argument");
                i = f(i);
                o._getObjectStore(function (e, t) {
                    if (e) return i(e);
                    try {
                        var r = t.delete(n)
                    } catch (e) {
                        return i(e)
                    }
                    r.onerror = _.bind(this, i);
                    r.onsuccess = function () {
                        if (o._kvStore._channel) {
                            o._kvStore._channel.postMessage({method: "remove", key: n})
                        }
                        i(null)
                    }
                });
                return i.promise
            };
            i.prototype.clear = function (n) {
                var e = this;
                n = f(n);
                e._getObjectStore(function (e, t) {
                    if (e) return n(e);
                    try {
                        var r = t.clear()
                    } catch (e) {
                        return n(e)
                    }
                    r.onerror = _.bind(this, n);
                    r.onsuccess = function () {
                        n(null)
                    }
                });
                return n.promise
            };
            i.prototype.count = function (n, i) {
                var e = this;
                if (typeof n === "function") return e.count(null, n);
                i = f(i);
                e._getObjectStore(function (e, t) {
                    if (e) return i(e);
                    try {
                        var r = n == null ? t.count() : t.count(n)
                    } catch (e) {
                        return i(e)
                    }
                    r.onerror = _.bind(this, i);
                    r.onsuccess = function (e) {
                        i(null, e.target.result)
                    }
                });
                return i.promise
            };
            i.prototype.iterator = function (n, i) {
                var e = this;
                if (typeof n === "function") return e.iterator(null, n);
                if (typeof i !== "function") throw new Error("A function must be given");
                e._getObjectStore(function (e, t) {
                    if (e) return i(e);
                    try {
                        var r = n == null ? t.openCursor() : t.openCursor(n)
                    } catch (e) {
                        return i(e)
                    }
                    r.onerror = _.bind(this, i);
                    r.onsuccess = function (e) {
                        var t = e.target.result;
                        i(null, t)
                    }
                })
            };
            i.prototype.abort = function () {
                if (this.finished) throw new Error("Transaction is finished");
                if (this._objectStore) this._objectStore.transaction.abort();
                this._close(new Error("Transaction aborted"))
            };
            i.prototype._close = function (e) {
                if (this.finished) return;
                this.finished = true;
                this._kvStore = null;
                this._objectStore = null;
                for (var t in this._waiters) this._waiters[t](e || new Error("Transaction is finished"));
                this._waiters = null;
                if (this.onfinish) this.onfinish(e);
                this.onfinish = null
            };

            function _(e, t) {
                if (t == null) return _(null, e);
                t.preventDefault();
                t.stopPropagation();
                if (e) e(t.target.error)
            }
        }, {events: 1, inherits: 2, promisize: 3}]
    }, {}, [])("/")
});
let settings = new IdbKvStore('pwa_settings');


self.addEventListener('message', event => {
    var cacheName, index_doc;
    // event is an ExtendableMessageEvent object
    console.warn('serviceworker received', event);
    if (event.data.hasOwnProperty('root')) {
        pwa_root = event.data.root;
        settings.set('pwa_root', pwa_root);
        console.log('set pwa_root to ', pwa_root);
    }
    if (event.data.hasOwnProperty('version')) {
        pwa_version = event.data.version;
        settings.get('pwa_version').then(value => {
            if (value !== pwa_version) {
                settings.set('pwa_version', pwa_version);
                if (event.data.hasOwnProperty('caches')) {
                    my_assets = event.data.caches;
                    settings.set('my_assets', my_assets);
                    // clear the caches that are apparently not valid, and refresh the other ones
                    caches.keys().then(cacheNames => {
                        return Promise.all(
                            cacheNames.map(cacheName => {
                                if (!my_assets.hasOwnProperty(cacheName)) {
                                    console.warn('removed ' + cacheName);
                                    return caches.delete(cacheName);
                                } else {
                                    console.log('refreshing ' + cacheName);
                                    self.loadIntoCache(cacheName, event);
                                }
                            })
                        ).then(function () {
                            event.source.postMessage({caches: cacheNames});
                        });
                    })
                }
            } else { // just return the caches for the menu
                caches.keys().then(cacheNames => {
                    event.source.postMessage({
                        caches: cacheNames
                    });
                });
            }
        });
    }
    if (event.data.hasOwnProperty('cache')) {
        cacheName = event.data.cache;
        index_doc = event.data.index;
        self.loadIntoCache(cacheName, event);
    }
    if (event.data.hasOwnProperty('cache_delete')) {
        cacheName = event.data.cache_delete;
        caches.delete(cacheName).then(function () {
            caches.keys().then(cacheNames => {
                event.source.postMessage({
                    caches: cacheNames,
                    key: cacheName,
                    cached: cacheNames.includes(cacheName)
                });
            });
        });
    }
    if (event.data.hasOwnProperty('cache_check')) {
        cacheName = event.data.cache_check;
        if (cacheName) {
            caches.keys().then(cacheNames => {
                event.source.postMessage({
                    cache_check: cacheNames.includes(cacheName),
                    key: cacheName,
                    caches: cacheNames
                });
            });
        }
    }
});

function loadIntoCache(cacheName, originalEvent) {
    settings.get('my_assets').then(my_assets => {
        if (!my_assets[cacheName]) {
            originalEvent.source.postMessage({
                cached: false,
                key: cacheName,
                errors: ['cache not found: ' + cacheName]
            });
            return;
        }
        if ('/' !== cacheName) {
            caches.keys().then(caches => {
                if (!caches.includes('/')) loadIntoCache('/', originalEvent);
            });
        }
        caches.keys().then(just_checking => {
            let existing = just_checking.includes(cacheName);
            caches.open(cacheName).then(cache => {
                let i, asset = my_assets[cacheName], paths = asset.assets, num_to_cache = 0,
                    num_to_cache_max = paths.length, num_failed = 0;
                originalEvent.source.postMessage({message: 'going to cache: ' + cacheName});
                for (i in paths) {
                    if (!paths.hasOwnProperty(i)) continue;
                    //cache.add(new Request(paths[i], {cache: 'reload'})).catch(reason => console.error(reason));
                    cache.add(new Request(paths[i], {cache: 'reload'})).catch(reason => {
                        console.error(reason);
                        ++num_failed;
                    }).then(() => {
                        num_to_cache--;
                        if (0 === num_to_cache) {
                            if (num_failed === num_to_cache_max) {
                                if (!existing) {
                                    caches.delete(cacheName).then(() => {
                                        originalEvent.source.postMessage({
                                            cached: false,
                                            key: cacheName,
                                            errors: ['Nothing changed in cache'],
                                        });
                                    });
                                } else {
                                    caches.keys().then(caches => {
                                        originalEvent.source.postMessage({
                                            cached: caches.includes(cacheName),
                                            caches: caches,
                                            key: cacheName,
                                            errors: ['Nothing changed in cache'],
                                        });
                                    });
                                }
                            } else if (num_failed > 0) {
                                caches.delete(cacheName).then(() => {
                                    originalEvent.source.postMessage({
                                        cached: false,
                                        key: cacheName,
                                        errors: ['Caching failed'],
                                    });
                                });
                            } else {
                                caches.keys().then(caches => {
                                    originalEvent.source.postMessage({
                                        cached: caches.includes(cacheName),
                                        caches: caches,
                                        key: cacheName,
                                    });
                                });
                            }
                        }
                        originalEvent.source.postMessage({
                            key: cacheName,
                            progress: Math.abs(1 - (num_to_cache / num_to_cache_max))
                        });
                    });
                    num_to_cache++;
                }
            });
        });
    });
}

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request, {ignoreSearch: true})
            .then(response => {
                //throw 'fake offline';
                if (response) {
                    return response;
                }
                //throw 'fake offline';
                return fetch(event.request)
                    .then(response => {
                        return response;
                    });
            }).catch(error => {
            // now that you are offline, you need to get the global vars from the kv store
            return settings.get('my_assets').then(value => {
                my_assets = value;
                return settings.get('pwa_root').then(value => {
                    pwa_root = value;
                    return settings.get('pwa_version').then(value => {
                        pwa_version = value;
                        // Respond with custom offline page
                        return caches.keys().then(cacheNames => {
                            const init = {
                                status: 200,
                                statusText: offline_statustext,
                                headers: {'Content-Type': 'text/html'}
                            };
                            let body = '<!DOCTYPE html><html lang="en-US"><head><title>Offline</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="' + pwa_root + '/pwa/front.js?v=' + pwa_version + '" data-root="' + pwa_root + '"></script></head><body id="offline_body"><header></header><h1>Offline</h1><div id="offline_message">It looks like you have no internet connection. The following manuals are available without internet:</div><ul>';
                            let asset;
                            cacheNames.forEach(cacheName => {
                                if ((asset = my_assets[cacheName]) && asset.hasOwnProperty('destination') && asset.destination) {
                                    body += '<li><a href="' + pwa_root + cacheName + '/' + asset.destination + '">' + cacheName + '</a></li>';
                                }
                            });
                            if (!cacheNames) {
                                body += '<li>0</li>';
                            }
                            body += '</ul></body></html>';
                            return new Response(body, init);
                        });
                    });
                });
            });
        })
    );
});

self.addEventListener('install', event => {
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    // dont’t actually do anything here, because when it crashes you are left without service worker
});

function shouldAcceptResponse(response) {
    return response.status !== 0 && !(response.status >= 400 && repsonse.status < 500) ||
        response.type === 'opaque' ||
        response.type === 'opaqueredirect';
}

function stripTrailingSlash(str) {
    if (str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}
