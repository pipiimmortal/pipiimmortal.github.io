(function(a, b) {
        'object' == typeof exports && 'undefined' != typeof module ? module.exports = b() : 'function' == typeof define && define.amd ? define(b) : a.holmes = b()
    }
)(this, function() {
    'use strict';
    var f = 'undefined' == typeof window ? global : window
        , g = function(c, a) {
        return -1 !== c.indexOf(a)
    }
        , h = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function(a) {
            return typeof a
        }
        : function(a) {
            return a && 'function' == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? 'symbol' : typeof a
        }
        , i = function(a, b) {
        if (!(a instanceof b))
            throw new TypeError('Cannot call a class as a function')
    }
        , b = function() {
        function a(a, b) {
            for (var c, d = 0; d < b.length; d++)
                c = b[d],
                    c.enumerable = c.enumerable || !1,
                    c.configurable = !0,
                'value'in c && (c.writable = !0),
                    Object.defineProperty(a, c.key, c)
        }
        return function(b, c, d) {
            return c && a(b.prototype, c),
            d && a(b, d),
                b
        }
    }()
        , j = {
        invalidInput: 'The Holmes input was no <input> or contenteditable.',
        optionsObject: 'The options need to be given inside an object like this:\n\nnew Holmes({\n  find:".result"\n});\n\nsee also https://haroen.me/holmes/doc/holmes.html',
        findOption: 'A find argument is needed. That should be a querySelectorAll for each of the items you want to match individually. You should have something like:\n\nnew Holmes({\n  find:".result"\n});\n\nsee also https://haroen.me/holmes/doc/holmes.html',
        noInput: 'Your Holmes.input didn\'t match a querySelector',
        impossiblePlaceholder: 'The Holmes placeholder couldn\'t be put; the elements had no parent.'
    }
        , a = function() {
        function f(a) {
            var k = this;
            i(this, f);
            var c = !1;
            if ('object' !== ('undefined' == typeof a ? 'undefined' : h(a)))
                throw new Error(j.optionsObject);
            if ('string' != typeof a.find)
                throw new Error(j.findOption);
            var d = {
                input: 'input[type=search]',
                find: '',
                placeholder: void 0,
                mark: !1,
                class: {
                    visible: void 0,
                    hidden: 'hidden'
                },
                dynamic: !1,
                minCharacters: 0,
                hiddenAttr: !1,
                shouldShow: g,
                onHidden: void 0,
                onVisible: void 0,
                onEmpty: void 0,
                onFound: void 0,
                onInput: void 0
            };
            this.options = Object.assign({}, d, a),
                this.options.class = Object.assign({}, d.class, a.class),
                this.hidden = 0,
                this.running = !1,
                window.addEventListener('DOMContentLoaded', function() {
                    return k.start()
                }),
                this.search = function() {
                    k.running = !0;
                    var d = !1;
                    k.searchString = k.inputString(),
                    k.options.minCharacters && 0 !== k.searchString.length && k.options.minCharacters > k.searchString.length || (k.options.dynamic && (k.elements = document.querySelectorAll(k.options.find),
                        k.elementsLength = k.elements.length,
                        k.elementsArray = Array.prototype.slice.call(k.elements)),
                    k.options.mark && (k._regex = new RegExp('(' + k.searchString + ')(?![^<]*>)','gi')),
                        k.elementsArray.forEach(function(a) {
                            k.options.shouldShow(a.textContent.toLowerCase(), k.searchString) ? (k._showElement(a),
                            c && 'function' == typeof k.options.onFound && k.options.onFound(k.placeholderNode),
                                d = !0) : k._hideElement(a)
                        }),
                    'function' == typeof k.options.onInput && k.options.onInput(k.searchString),
                        d ? k.options.placeholder && k._hideElement(k.placeholderNode) : (k.options.placeholder && k._showElement(k.placeholderNode),
                        !1 == c && (c = !0,
                        'function' == typeof k.options.onEmpty && k.options.onEmpty(k.placeholderNode))))
                }
        }
        return b(f, [{
            key: '_hideElement',
            value: function(b) {
                this.options.class.visible && b.classList.remove(this.options.class.visible),
                b.classList.contains(this.options.class.hidden) || (b.classList.add(this.options.class.hidden),
                    this.hidden++,
                'function' == typeof this.options.onHidden && this.options.onHidden(b)),
                this.options.hiddenAttr && b.setAttribute('hidden', 'true'),
                this.options.mark && (b.innerHTML = b.innerHTML.replace(/<\/?mark>/g, ''))
            }
        }, {
            key: '_showElement',
            value: function(b) {
                this.options.class.visible && b.classList.add(this.options.class.visible),
                b.classList.contains(this.options.class.hidden) && (b.classList.remove(this.options.class.hidden),
                    this.hidden--,
                'function' == typeof this.options.onVisible && this.options.onVisible(b)),
                this.options.hiddenAttr && b.removeAttribute('hidden'),
                this.options.mark && (b.innerHTML = b.innerHTML.replace(/<\/?mark>/g, ''),
                this.searchString.length && (b.innerHTML = b.innerHTML.replace(this._regex, '<mark>$1</mark>')))
            }
        }, {
            key: '_inputHandler',
            value: function() {
                console.warn('You can now directly call .search() to refresh the results'),
                    this.search()
            }
        }, {
            key: 'inputString',
            value: function() {
                if (this.input instanceof HTMLInputElement)
                    return this.input.value.toLowerCase();
                if (this.input.isContentEditable)
                    return this.input.textContent.toLowerCase();
                throw new Error(j.invalidInput)
            }
        }, {
            key: 'setInput',
            value: function(b) {
                if (this.input instanceof HTMLInputElement)
                    this.input.value = b;
                else if (this.input.isContentEditable)
                    this.input.textContent = b;
                else
                    throw new Error(j.invalidInput)
            }
        }, {
            key: 'start',
            value: function() {
                var d = document.querySelector(this.options.input);
                if (d instanceof HTMLElement)
                    this.input = d;
                else
                    throw new Error(j.noInput);
                if ('string' == typeof this.options.find)
                    this.elements = document.querySelectorAll(this.options.find);
                else
                    throw new Error(j.findOption);
                if (this.elementsLength = this.elements.length,
                    this.elementsArray = Array.prototype.slice.call(this.elements),
                    this.hidden = 0,
                'string' == typeof this.options.placeholder) {
                    var a = this.options.placeholder;
                    if (this.placeholderNode = document.createElement('div'),
                        this.placeholderNode.id = 'holmes-placeholder',
                        this._hideElement(this.placeholderNode),
                        this.placeholderNode.innerHTML = a,
                    this.elements[0].parentNode instanceof Element)
                        this.elements[0].parentNode.appendChild(this.placeholderNode);
                    else
                        throw new Error(j.impossiblePlaceholder)
                }
                if (this.options.class.visible) {
                    var b = this.options.class.visible;
                    this.elementsArray.forEach(function(c) {
                        c.classList.add(b)
                    })
                }
                this.input.addEventListener('input', this.search)
            }
        }, {
            key: 'stop',
            value: function() {
                var d = this;
                return new Promise(function(a, b) {
                        try {
                            d.input.removeEventListener('input', d.search),
                            d.options.placeholder && (d.placeholderNode.parentNode ? d.placeholderNode.parentNode.removeChild(d.placeholderNode) : b(new Error(j.impossiblePlaceholder))),
                            d.options.mark && d.elementsArray.forEach(function(b) {
                                b.innerHTML = b.innerHTML.replace(/<\/?mark>/g, '')
                            }),
                                d.running = !1,
                                a('This instance of Holmes has been stopped.')
                        } catch (c) {
                            b(c)
                        }
                    }
                )
            }
        }, {
            key: 'clear',
            value: function() {
                var c = this;
                this.setInput(''),
                    this.elementsArray.forEach(function(a) {
                        c._showElement(a)
                    }),
                this.options.placeholder && this._hideElement(this.placeholderNode),
                    this.hidden = 0
            }
        }, {
            key: 'count',
            value: function() {
                return {
                    all: this.elementsLength,
                    hidden: this.hidden,
                    visible: this.elementsLength - this.hidden
                }
            }
        }]),
            f
    }()
        , c = function(g) {
        var a = function() {
            for (var a, b = arguments.length, c = Array(b), d = 0; d < b; d++)
                c[d] = arguments[d];
            return a = 'undefined' != typeof this && this !== f ? g.call.apply(g, [this].concat(c)) : new (Function.prototype.bind.apply(g, [null].concat(c))),
                a
        };
        return a.__proto__ = g,
            a.prototype = g.prototype,
            a
    }(a);
    return c
});
