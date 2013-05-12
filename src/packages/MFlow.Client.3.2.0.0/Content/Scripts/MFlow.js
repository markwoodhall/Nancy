var MFlow = function () {

    var _private = {
        currentContext: {
            key: undefined,
            value: undefined,
            values: {}
        },
        conditions: [],
        isString: function (value) {
            return (typeof value == 'string' || value instanceof String);
        },
        buildCondition: function (condition) {
            _private.conditions.push({ value: _private.currentContext.value, hint: "", message: "", key: "", condition: function (key, dependsOn) { return !dependsOn() ? true : condition(key); } });
        },
        matchesPattern: function (value, pattern) {
            return pattern.test(value);
        }
    }

    var _public = {
        findAndCheck: function (element) {
            return _public.check(function () { return $('#' + element).val(); });
        },
        check: function (value) {
            if (typeof value === 'function') {
                _private.currentContext.value = value;
            }
            else {
                _private.currentContext.value = function () { return value; };
            }

            return _public;
        },
        when: function (validator) {
            var conditionCount = _private.conditions.length;
            for (var i = 0; i < conditionCount; i++) {
                var dependsOn = _private.conditions[i].dependsOn;
                if (dependsOn == undefined)
                    _private.conditions[i].dependsOn = function () { return validator.satisfied(); };
            }
            return _public;
        },
        hint: function (hint) {
            _private.conditions[_private.conditions.length - 1].hint = hint;
            return _public;
        },
        message: function (message) {
            _private.conditions[_private.conditions.length - 1].message = message;
            return _public;
        },
        key: function (key) {
            _private.conditions[_private.conditions.length - 1].key = key;
            _private.currentContext.key = key;
            _private.currentContext.values[key] = _private.currentContext.value;
            return _public;
        },
        isEqualTo: function (value) {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]() == value;
            });
            return _public;
        },
        isNotEqualTo: function (value) {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]() != value;
            });
            return _public;
        },
        contains: function (value) {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]().indexOf(value) != -1;
            })
            return _public;
        },
        isGreaterThan: function (value) {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]() > value;
            });
            return _public;
        },
        isGreaterThanOrEqual: function (value) {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]() >= value;
            });
            return _public;
        },
        isLessThan: function (value) {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]() < value;
            });
            return _public;
        },
        isLessThanOrEqual: function (value) {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]() <= value;
            });
            return _public;
        },
        isBetween: function (lower, upper) {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]() > lower && _private.currentContext.values[key]() < upper;
            });
            return _public;
        },
        isRequired: function () {
            _private.buildCondition(function (key) {
                if(_private.isString(_private.currentContext.values[key]()))
                {
                    return  _private.currentContext.values[key]().length > 0;
                } else {
                    return _private.currentContext.values[key]() != null;
                }
            });
            return _public;
        },
        isNotNull: function () {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]() != null
            });
            return _public;
        },
        isNotEmpty: function () {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]() != null && 
                    _private.currentContext.values[key]().length > 0;
            });
            return _public;
        },
        isLength: function (length) {
            _private.buildCondition(function (key) {
                return _private.currentContext.values[key]().length == length;
            });
            return _public;
        },
        isLonger: function (length) {
            _private.buildCondition(function (key) {
                return _private.isString(_private.currentContext.values[key]()) &&
                    _private.currentContext.values[key]().length > length;
            });
            return _public;
        },
        isShorter: function (length) {
            _private.buildCondition(function (key) {
                return _private.isString(_private.currentContext.values[key]()) &&
                    _private.currentContext.values[key]().length < length;
            });
            return _public;
        },
        matches: function (pattern) {
            _private.buildCondition(function (key) {
                return _private.isString(_private.currentContext.values[key]()) &&
                    _private.matchesPattern(_private.currentContext.values[key](), new RegExp(pattern))
            });
            return _public;
        },
        isPassword: function () {
            _private.buildCondition(function (key) {
                return _private.isString(_private.currentContext.values[key]()) &&
                    _private.matchesPattern(_private.currentContext.values[key](), /^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/)
            });
            return _public;
        },
        isUsername: function () {
            _private.buildCondition(function (key) {
                return _private.isString(_private.currentContext.values[key]()) &&
                    _private.matchesPattern(_private.currentContext.values[key](), /[A-Za-z][A-Za-z0-9._]{5,14}/)
            });
            return _public;
        },
        isEmail: function () {
            _private.buildCondition(function (key) {
                return _private.isString(_private.currentContext.values[key]()) &&
                    _private.matchesPattern(_private.currentContext.values[key](), /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)
            });
            return _public;
        },
        validate: function () {
            var results = [];
            var collectionLength = _private.conditions.length;
            for (var i = 0; i < collectionLength; i++) {
                if (!(_private.conditions[i].condition(_private.conditions[i].key, _private.conditions[i].dependsOn || function () { return true; })))
                    results.push({ value: _private.conditions[i].value(), hint: _private.conditions[i].hint, message: _private.conditions[i].message, key: _private.conditions[i].key })
            }
            return results;
        },
        satisfied: function () {
            var collectionLength = _private.conditions.length;
            for (var i = 0; i < collectionLength; i++) {
                if (!(_private.conditions[i].condition(_private.conditions[i].key, _private.conditions[i].dependsOn || function () { return true; })))
                    return false;
            }
            return true;
        }
    }

    return _public;
}

