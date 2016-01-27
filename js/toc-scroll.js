
(function () {
    // debounce/throttle inlined from lodash.debounce@3.1.1

    var FUNC_ERROR_TEXT = 'Expected a function';

    var nativeMax = Math.max;

    var now = function() {
        return new Date().getTime();
    };

    function debounce(func, wait, options) {
        var args,
        maxTimeoutId,
        result,
        stamp,
        thisArg,
        timeoutId,
        trailingCall,
        lastCalled = 0,
        maxWait = false,
        trailing = true;

        if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = wait < 0 ? 0 : (+wait || 0);
        if (options === true) {
            var leading = true;
            trailing = false;
        } else if (isObject(options)) {
            leading = !!options.leading;
            maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
            trailing = 'trailing' in options ? !!options.trailing : trailing;
        }

        function cancel() {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (maxTimeoutId) {
                clearTimeout(maxTimeoutId);
            }
            lastCalled = 0;
            maxTimeoutId = timeoutId = trailingCall = undefined;
        }

        function complete(isCalled, id) {
            if (id) {
                clearTimeout(id);
            }
            maxTimeoutId = timeoutId = trailingCall = undefined;
            if (isCalled) {
                lastCalled = now();
                result = func.apply(thisArg, args);
                if (!timeoutId && !maxTimeoutId) {
                    args = thisArg = undefined;
                }
            }
        }

        function delayed() {
            var remaining = wait - (now() - stamp);
            if (remaining <= 0 || remaining > wait) {
                complete(trailingCall, maxTimeoutId);
            } else {
                timeoutId = setTimeout(delayed, remaining);
            }
        }

        function maxDelayed() {
            complete(trailing, timeoutId);
        }

        function debounced() {
            args = arguments;
            stamp = now();
            thisArg = this;
            trailingCall = trailing && (timeoutId || !leading);

            if (maxWait === false) {
                var leadingCall = leading && !timeoutId;
            } else {
                if (!maxTimeoutId && !leading) {
                    lastCalled = stamp;
                }
                var remaining = maxWait - (stamp - lastCalled),
                isCalled = remaining <= 0 || remaining > maxWait;

                if (isCalled) {
                    if (maxTimeoutId) {
                        maxTimeoutId = clearTimeout(maxTimeoutId);
                    }
                    lastCalled = stamp;
                    result = func.apply(thisArg, args);
                }
                else if (!maxTimeoutId) {
                    maxTimeoutId = setTimeout(maxDelayed, remaining);
                }
            }
            if (isCalled && timeoutId) {
                timeoutId = clearTimeout(timeoutId);
            }
            else if (!timeoutId && wait !== maxWait) {
                timeoutId = setTimeout(delayed, wait);
            }
            if (leadingCall) {
                isCalled = true;
                result = func.apply(thisArg, args);
            }
            if (isCalled && !timeoutId && !maxTimeoutId) {
                args = thisArg = undefined;
            }
            return result;
        }
        debounced.cancel = cancel;
        return debounced;
    }

    function isObject(value) {
        var type = typeof value;
        return !!value && (type == 'object' || type == 'function');
    }

    function throttle(func, wait, options) {
        var leading = true,
        trailing = true;

        if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (options === false) {
            leading = false;
        } else if (isObject(options)) {
            leading = 'leading' in options ? !!options.leading : leading;
            trailing = 'trailing' in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
    }


    // ACTUAL TOC CODE

    var current = null;
    var select2 = null;

    // Prepare the TOC, add expand/collapse button
    function prepare() {
        var subul = [].slice.call(document.querySelectorAll("ul.toc ul"));
        subul.forEach(function (ul) {
            var parent = ul.parentElement;
            var elem = document.createElement("span");
            elem.className = "toc-expand"
            elem.onclick = function (e) {
                var link = ul.parentElement.childNodes[0];
                parent.classList.toggle("expanded");

                // // select(link);
                // console.log(parent);
                // if (parent.className === "active") {
                //     update(current, null);
                // }
                // else {
                //     update(current, link);
                // }
            }
            parent.insertBefore(elem, ul);
        });
    }

    // Select a link
    function select(link) {
        if (!link) { return; }
        link.classList.add("selected");
        link.parentElement.classList.add("active");
        var ul = link.parentElement.parentElement;
        while (ul.tagName === "UL" && ul.className !== "toc") {
            ul.parentElement.classList.add("active");
            ul = ul.parentElement.parentElement;
        }
    }

    // Unselect a link
    function unselect(link) {
        if (!link) { return; }
        link.classList.remove("selected");
        link.parentElement.classList.remove("active");
        var ul = link.parentElement.parentElement;
        while (ul.tagName === "UL" && ul.className !== "toc") {
            ul.parentElement.classList.remove("active");
            ul = ul.parentElement.parentElement;
        }
    }





    // // Select a link
    // function select(link, cls, ocls, goUp) {
    //     // cls = cls === undefined ? "selected active" : cls;
    //     // ocls = ocls === undefined ? "active" : ocls;
    //     if (!link) { return; }
    //     link.className = cls;
    //     link.parentElement.className = ocls;
    //     var ul = link.parentElement.parentElement;
    //     if (goUp) {
    //         while (ul.tagName === "UL" && ul.className !== "toc") {
    //             ul.className = ocls;
    //             ul.parentElement.className = ocls;
    //             ul = ul.parentElement.parentElement;
    //         }
    //         return null;
    //     }
    //     else {
    //         return console.log(ul.parentElement.childNodes[0]);
    //     }
    // }

    // function update(_current, _select2) {
    //     select(current, "", "", true);
    //     current = _current;
    //     if (_select2) {
    //         select(select2, "", "", true);
    //         select2 = _select2;
    //         select(select2, "active", "active", true);
    //     }
    //     else {
    //         select2 = select(select2, "", "", false);
    //     }
    //     select(current, "selected active", "active _outer", true);
    // }

    // Highlight the current table of contents element
    function hl() {
        var anchor = document.body;
        var last = null;
        var all = [].slice.call(document.querySelectorAll("h1, h2, h3"));
        all.push(null);
        for (var i = 0; i < all.length; i++) {
            var s = all[i];
            var link = s && document.querySelector('a[href="#' + s.id + '"]');
            if (s && !link) {
            }
            else if (!s || s.offsetTop > anchor.scrollTop + 75) {
                // var links = [].slice.call(document.querySelectorAll("ul.toc a, ul.toc ul, ul.toc li"));
                // links.forEach(function (link) {
                //     link.className = "";
                // });
                unselect(current);
                if (last) {
                    // update(last, select2);
                    select(last);
                    current = last;
                }
                else if (link) {
                    // update(link, select2);
                    select(link);
                    current = link;
                }
                break;
            }
            else {
                last = link;
            }
        }
    }

    window.onload = function () {
        prepare();
        hl();
        window.onscroll = throttle(hl, 50);
    }

})()
