(function ($) {

    var mflow = new MFlow();

    var _settings = {
        validateOnBlur: true,
        suggestOnFocus: true,
        validationErrorClass: 'input-validation-error',
        validationValidClass: 'field-validation-valid',
        suggestionClass: 'input-validation-suggestion'
    };


    var _private = {
        processValidators: function (validators) {
            var mflowValidator = new MFlow();
            for (var i = 0; i < validators.length; i++) {
                mflowValidator.findAndCheck(validators[i].key)

                switch (validators[i].validator) {
                    case 'IsNotNull':
                        mflowValidator.isNotNull();
                        break;
                    case 'IsRequired':
                        mflowValidaotr.isRequired();
                        break;
                    case 'NotEmpty':
                        mflowValidator.isNotEmpty();
                        break;
                    case 'NotEqual':
                        mflowValidator.isNotEqualTo(validators[i].value.value);
                        break;
                    case 'Equal':
                        mflowValidator.isEqualTo(validators[i].value.value);
                        break;
                    case 'GreaterThan':
                        mflowValidator.isGreaterThan(validators[i].value.value);
                        break;
                    case 'LessThan':
                        mflowValidator.isLessThan(validators[i].value.value);
                        break;
                    case 'GreaterThanOrEqualTo':
                        mflowValidator.isGreaterThanOrEqual(validators[i].value.value);
                        break;
                    case 'LessThanOrEqualTo':
                        mflowValidator.isLessThanOrEqual(validators[i].value.value);
                        break;
                    case 'IsLength':
                        mflowValidator.isLength(validators[i].value.value);
                        break;
                    case 'IsShorterThan':
                        mflowValidator.isShorter(validators[i].value.value);
                        break;
                    case 'IsLongerThan':
                        mflowValidator.isLonger(validators[i].value.value);
                        break;
                    case 'RegEx':
                        mflowValidator.matches(validators[i].value.value);
                        break;
                    case 'IsEmail':
                        mflowValidator.isEmail();
                        break;
                    case 'IsUsername':
                        mflowValidator.isUsername();
                        break;
                    case 'IsPassword':
                        mflowValidator.isPassword();
                        break;
                    case 'Contains':
                        mflowValidator.contains(validators[i].value.value);
                    case 'IsBetween':
                        mflowValidator.isBetween(validators[i].value.lower, validators[i].value.upper);
                        break;
                }

                mflowValidator.message(validators[i].message).hint(validators[i].hint).key(validators[i].key);

                if (validators[i].roots != undefined)
                    mflowValidator.when(_private.processValidators(validators[i].roots));
            }

            return mflowValidator;
        }

    }


    $.fn.MFlowClient = function (validators, settings) {

        if (settings != undefined) {
            if (settings.validateOnBlur != undefined)
                _settings.validateOnBlur = settings.validateOnBlur;
            if (settings.suggestOnFocus != undefined)
                _settings.suggestOnFocus = settings.suggestOnFocus;
            if (settings.validationErrorClass != undefined)
                _settings.validationErrorClass = settings.validationErrorClass;
            if (settings.validationValidClass != undefined)
                _settings.validationValidClass = settings.validationValidClass;
            if (settings.suggestionClass != undefined)
                _settings.suggestionClass = settings.suggestionClass;
        }

        mflow = _private.processValidators(validators);

        var form = this;

        var handle = function (blured, errorClass, validClass, removeClass, validation) {
            blured.removeClass(errorClass);
            $('span[data-valmsg-for="' + blured.attr('id') + '"]').addClass(validClass);

            if (removeClass != undefined && removeClass != null) {
                blured.removeClass(removeClass);
                $('span[data-valmsg-for="' + blured.attr('id') + '"]').removeClass(removeClass);
            }

            var results = mflow.validate();

            for (var i = 0; i < results.length; i++) {
                var element = $('#' + results[i].key);
                $(element).addClass(errorClass);

                var errorNode = $('span[data-valmsg-for="' + results[i].key + '"]');
                errorNode.removeClass(validClass);
                errorNode.addClass(errorClass);

                if (validation || (!validation && results[i].hint == '')) {
                    errorNode.html(results[i].message);
                } else {
                    errorNode.html(results[i].hint);
                }
            }

        }

        if (_settings.validateOnBlur) {
            this.find($('input[id][name]')).blur(function () {
                $(form).find($('input[id][name]')).each(function () {
                    handle($(this), _settings.validationErrorClass, _settings.validationValidClass, _settings.validationErrorClass, true);
                });
            });
        }

        if (_settings.suggestOnFocus) {
            this.find($('input[id][name]')).focus(function () {
                $(form).find($('input[id][name]')).each(function () {
                    handle($(this), _settings.suggestionClass, _settings.validationValidClass, _settings.suggestionClass, false);
                });
            });
        }
    };
})(jQuery);