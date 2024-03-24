import Schema, {
    RuleItem,
    ValidateError,
    ValidateFieldsError,
    Values
} from 'async-validator'

export interface ValidateOptions {
    name: string
    rules?: RuleItem[]
    validateFirst?: boolean
    value: unknown
}

type Error = {
    errors?: ValidateError[] | null
    fields: ValidateFieldsError | Values
}

const validateRule = ({
    name,
    rules = [],
    validateFirst,
    value
}: ValidateOptions) =>
    new Schema({[name]: rules}).validate(
        {[name]: value},
        {first: validateFirst, suppressWarning: true}
    )

export const validate = async (options: ValidateOptions) => {
    const {name, rules, value} = options
    const processErrors = (
        errors: ValidateError[] | null,
        fields: ValidateFieldsError | Values
    ) => (fields[name] !== value ? {errors: errors || [], rules} : undefined)

    return validateRule(options)
        .then(() => undefined)
        .catch((error: Error) => {
            if (!error.errors) {
                throw error
            }

            const {errors, fields} = error

            return processErrors(errors, fields)
        })
}
