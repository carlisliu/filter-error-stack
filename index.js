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