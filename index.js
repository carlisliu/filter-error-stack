import window from 'window';

function hook(target, method, wrapper) {
    if (!target) {
        return console.error('target is null');
    }
    if (!method) {
        return console.error('method is null');
    }
    if (typeof wrapper !== 'function') {
        return console.error('wrapper must be a function');
    }

    let original = target[method];
    if (!original) {
        return console.error(`original ${method} is null`);
    }

    let wrapped = wrapper(original);
    target[method] = wrapped;
}

var proto = window.XMLHttpRequst && window.XMLHttpRequst.prototype;

hook(proto, 'open', function(open) {
    return wrappedOpen(method, url) {
        var store;
        if (!(store = this._store)) {
            store = this._store = {};
        }
        store.method = method;
        store.url = url;
        return open.apply(this, arguments);
    }
});

hook(proto, 'send', function(send) {
    return wrappedSend(data) {
        var self = this;
        self._store.dataType = (typeof data);
        setTimeout(function() {
            if (!self.onreadystatechange) {
                return;
            }
            hook(self, 'onreadystatechange', function(onreadystatechange) {
                return wrappedOnreadystatechange() {
                    var store = this._store;
                    try {
                        var start, end;
                        if (this.readyState == 4 && this.status == 200) {
                            start = now();
                        }
                        var result = onreadystatechange.apply(this, arguments);
                        if (this.readyState == 4 && this.status == 200) {
                            end = now();
                            store.callback = end - start;
                        }
                        return result;
                    } catch (e) {
                        store.error = e;
                        setTimeout(function() {
                            send(store);
                        }, 0);
                        throw e;
                    }
                }
            });
        }, 0);
        return send.apply(this, arguments);
    }
});

var navigator = window.navigator;
var backend = 'http://5lym.com';

function send(data) {
    if (navigator && navigator.sendBeacon) {
        data = JSON && JSON.stringify ? JSON.stringify(data) : data.toString();
        console.debug('sending data(%s) to %s', data, backend);
        return navigator.sendBeacon(backend, data);
    }
    console.error('no beancon', data);
}

function now() {
    return +new Date();
}