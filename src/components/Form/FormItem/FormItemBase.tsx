import {RuleItem, ValidateError} from 'async-validator'
import {
    RefAttributes,
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useMemo
} from 'react'
import {View, ViewProps} from 'react-native'
import {Updater, useImmer} from 'use-immer'
import {ValidateOptions, validate} from '../../../utils/validate.utils'
import {ComponentStatus} from '../../Common/interface'
import {FieldError, FormStore, Store} from '../formStore'
import {useFormContext} from '../useFormContext'

export interface ControlProps {
    errorMessage?: string
    errors?: ValidateError[]
    id?: string
    labelText?: string
    onValueChange?: (value?: unknown) => void
    value?: unknown
}

type BaseProps = Partial<
    ViewProps &
        RefAttributes<View> &
        Pick<ValidateOptions, 'rules' | 'validateFirst'> &
        Pick<ControlProps, 'labelText'>
>

export interface FormItemProps extends BaseProps {
    initialValue?: Store
    name?: string
    renderControl?: (props: ControlProps) => JSX.Element
}

export type RenderProps = FormItemProps
interface FormItemBaseProps extends FormItemProps {
    render: (props: RenderProps) => React.JSX.Element
}

interface InitialState {
    shouldUpdate: Record<string, unknown>
    signOut?: () => void
    status: ComponentStatus
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

type ProcessValueChangeOptions = Pick<FormStore<Store>, 'setFieldValue'> & {
    name?: string
    storeValue?: unknown
}

interface ProcessValidateOptions {
    name?: string
    rules?: RuleItem[]
    validateFirst?: boolean
}

type ProcessInitOptions = ProcessEventOptions &
    Pick<FormItemBaseProps, 'name' | 'rules' | 'validateFirst'> & {
        validate: (value?: unknown) => Promise<FieldError | undefined>
    }

const processValueChange = (
    {name, setFieldValue, storeValue}: ProcessValueChangeOptions,
    value?: unknown
) => name && storeValue !== value && setFieldValue({[name]: value})

const processValidate = async (
    value: unknown,
    {rules, validateFirst, name}: ProcessValidateOptions
) => {
    const isValidate = name && rules?.length !== 0

    if (isValidate) {
        return validate({
            name,
            rules,
            validateFirst,
            value
        })
    }
}

const processInit = (
    signInField: FormStore<Store>['signInField'],
    {
        name,
        rules,
        validateFirst,
        validate: fieldValidate,
        setState
    }: ProcessInitOptions
) => {
    const onFormStoreChange = () =>
        setState(draft => {
            draft.shouldUpdate = {}
        })

    setState(draft => {
        if (draft.status !== 'idle') {
            return
        }

        const {signOut} =
            signInField({
                onFormStoreChange,
                props: {name, rules, validateFirst},
                touched: false,
                validate: fieldValidate
            }) ?? {}

        draft.signOut = signOut
        draft.status = 'succeeded'
    })
}

export const FormItemBase = forwardRef<View, FormItemBaseProps>(
    (
        {
            labelText,
            name,
            render,
            renderControl,
            rules,
            validateFirst,
            ...renderProps
        },
        ref
    ) => {
        const [{signOut, status}, setState] = useImmer<InitialState>({
            shouldUpdate: {},
            signOut: undefined,
            status: 'idle'
        })

        const id = useId()
        const {
            getFieldError,
            getFieldValue,
            setFieldValue,
            signInField,
            getInitialValue
        } = useFormContext()

        const errors = getFieldError(name)?.errors
        const value = getFieldValue(name) ?? getInitialValue(name)
        const onValueChange = useCallback(
            (nextValue?: unknown) => {
                processValueChange(
                    {name, setFieldValue, storeValue: value},
                    nextValue
                )
            },
            [name, setFieldValue, value]
        )

        const fieldValidate = useCallback(
            (nextValue: unknown) =>
                processValidate(nextValue, {name, rules, validateFirst}),
            [name, rules, validateFirst]
        )

        const children = useMemo(
            () =>
                renderControl?.({
                    errorMessage: errors?.[0].message,
                    errors,
                    labelText,
                    onValueChange,
                    value
                }),
            [renderControl, errors, labelText, onValueChange, value]
        )

        useEffect(() => {
            processInit(signInField, {
                name,
                rules,
                setState,
                validateFirst,
                validate: fieldValidate
            })

            return () => {
                signOut?.()
            }
        }, [
            fieldValidate,
            name,
            rules,
            setState,
            signInField,
            signOut,
            validateFirst
        ])

        if (status === 'idle') {
            return <></>
        }

        return render({
            ...renderProps,
            children,
            ref,
            id
        })
    }
)
