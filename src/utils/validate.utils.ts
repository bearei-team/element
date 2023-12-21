import Schema, {
    RuleItem,
    ValidateError,
    ValidateFieldsError,
    Values,
} from 'async-validator';

export interface ValidateOptions {
    name: string;
    rules?: RuleItem[];
    validateFirst?: boolean;
    value: unknown;
}

const validateRule = (options: ValidateOptions) => {
    const {name, rules = [], validateFirst, value} = options;

    return new Schema({[name]: rules}).validate(
        {[name]: value},
        {
            first: validateFirst,
            suppressWarning: true,
        },
    );
};

export const validate = async (options: ValidateOptions) => {
    const {name, rules, value} = options;
    const processErrors = (
        errors: ValidateError[] | null,
        fields: ValidateFieldsError | Values,
    ) => (fields[name] === value ? undefined : {errors: errors ?? [], rules});

    return validateRule(options)
        .then(() => undefined)
        .catch(error => {
            if (!error.errors) {
                throw error;
            }

            const {errors, fields} = error;

            return processErrors(errors, fields);
        });
};
