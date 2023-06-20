import { 
    Form as VeeForm, 
    Field as VeeField, 
    defineRule, 
    ErrorMessage,
    configure 
} from 'vee-validate';

import { 
    required, 
    min, 
    max, 
    alpha_spaces as alphaSpaces, 
    email,
    min_value as minValue,
    max_value as maxValue,
    confirmed,
    not_one_of as excluded,
} from '@vee-validate/rules'


export default {
    install(app) {
        app.component('VeeForm', VeeForm);
        app.component('VeeField', VeeField);
        app.component('ErrorMessage', ErrorMessage);

        defineRule('required', required);
        defineRule('tos', required);
        defineRule('min', min);
        defineRule('max', max);
        defineRule('alpha_spaces', alphaSpaces);
        defineRule('email', email);
        defineRule('min_value', minValue);
        defineRule('max_value', maxValue);
        defineRule('confirmed', confirmed);
        defineRule('passwords_mismatch', confirmed);
        defineRule('excluded', excluded);
        defineRule('country_excluded', excluded);

        configure({
            generateMessage: (context) => {
                const messages = {
                    required: `The field ${context.field} is required.`,
                    min: `The field ${context.field} is too short.`,
                    max: `The field ${context.field} is too long.`,
                    alpha_spaces: `The field ${context.field} may only contain alphabetical characters and spaces`,
                    email: `You must enter an email in the valid email format. Example: test@email.com`,
                    min_value: `The field ${context.field} is too low.`,
                    max_value: `The field ${context.field} is too high.`,
                    passwords_mismatch: `The passwords do not match`,
                    excluded: `You are not allowed to use this value for ${context.field}. Please choose another option.`,
                    country_excluded: `Due to restrictions, we do not accept users from this location.`,
                    tos: `You must accept the terms of service.`
                };

                const message = messages[context.rule.name] ? messages[context.rule.name] : `The field ${context.field} is invalid.`

                return message;
            },
            validateOnBlur: true,
            validateOnChange: true,
            validateOnInput: false,
            validateOnModelUpdate: true
        });
    }
};