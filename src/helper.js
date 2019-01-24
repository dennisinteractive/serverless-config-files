'use strict'

// Converts strings to objects and builds nested keys with values.
module.exports.strToObj = (str) => {
    let last
    // Split dots into nested arrays.
    let obj = str.split('.').reduce((o, val) => {
        if (typeof last == 'object') {
            // Split value.
            let kv = val.split(':');
            if (kv[1])
            last = last[kv[0]] = kv[1];
            else
            last = last[val] = {};
        }
        else
        last = o[val] = {};

        return o;
    }, {});

    return JSON.stringify(obj);
}

// Recursively merges objects.
module.exports.mergeRecursive = (items) => {
    var _mergeRecursive = function (dst, src) {
        if (typeof src !== 'object' || src === null) {
            return dst;
        }

        for (var p in src) {
            if (!src.hasOwnProperty(p))
                continue;
            if (src[p] === undefined)
                continue;
            if ( typeof src[p] !== 'object' || src[p] === null) {
                dst[p] = src[p];
            } else if (typeof dst[p]!=='object' || dst[p] === null) {
                dst[p] = _mergeRecursive(src[p].constructor===Array ? [] : {}, src[p]);
            } else {
                _mergeRecursive(dst[p], src[p]);
            }
        }
        return dst;
    }

    var out = items[0];
    if (typeof out !== 'object' || out === null)
        return out;
    for (var i = 1, il = items.length; i < il; i++) {
        _mergeRecursive(out, items[i]);
    }
    return out;
}
