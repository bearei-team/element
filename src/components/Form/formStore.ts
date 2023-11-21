import {ValidateError} from 'async-validator';
import {NamePath} from '../../utils/namePath.utils';
import {UTIL} from '../../utils/util';
import {ValidateOptions} from '../../utils/validate.utils';

export type Store = Record<string, unknown>;
export interface FieldError extends Pick<ValidateOptions, 'rules'> {
    errors: ValidateError[];
}

export type Error<T> = Record<keyof T, FieldError | undefined>;
export interface Callback<T> {
    onFinish?: (value: T) => void;
    onFinishFailed?: (error: Error<T>) => void;
    onValueChange?: (changedValue: T, value: T) => void;
}

export interface FieldEntity<T> {
    onStoreChange: (name?: keyof T) => void;
    props: any;
    touched: boolean;
    validate: () => Promise<FieldError | undefined>;
}

export const formStore = <T extends Store = Store>() => {
    const callback = {} as Callback<T>;
    const error = {} as Error<T>;
    const initialValue = {} as T;
    const store = {} as T;
    let fieldEntities = [] as FieldEntity<T>[];

    const getFieldEntities = (signOut = false) =>
        signOut ? fieldEntities : fieldEntities.filter(fieldEntity => fieldEntity.props.name);

    const getFieldEntitiesName = (names?: (keyof T)[], signOut = false) => {
        const entityNames = getFieldEntities(signOut).map(({props}) => props.name);

        return [
            ...(names ? entityNames.filter(name => name && names.includes(name)) : entityNames),
        ];
    };

    const signInField = (entity: FieldEntity<T>) => {
        const {name} = entity.props;

        if (name) {
            const entities = getFieldEntities(true);
            const exist = entities.find(({props}) => props.name === name);

            if (!exist) {
                fieldEntities = [...entities, entity];

                setFieldValue({[name]: undefined} as T, {validate: false, fieldValidate: false});
                setFieldError({[name]: undefined} as Error<T>);
            }
        }

        return {
            signOut: () => signOutField(name),
        };
    };

    const signOutField = (name?: NamePath<T>) => {
        const names = UTIL.namePath(name);

        const handleSignOut = (signOutName?: string) => {
            if (signOutName) {
                const entities = getFieldEntities(true);
                const fieldEntity = entities.find(({props}) => props.name === signOutName);

                if (fieldEntity) {
                    const nextStore = {...store};
                    const nextError = {...error};

                    delete nextStore[signOutName];
                    delete nextError[signOutName];

                    fieldEntities = entities.filter(({props}) => props.name !== signOutName);

                    setFieldValue(nextStore, {validate: false, fieldValidate: false});
                    setFieldError(nextError);
                }
            }
        };

        getFieldEntitiesName(names).forEach(handleSignOut);
    };

    const setFieldValue = (value = {} as T, {fieldValidate = true, validate = true} = {}) => {
        const {onValueChange} = callback;
        const entities = getFieldEntities();

        const processFieldValidate = async (key: string) => {
            const entity = entities.find(({props}) => props.name === key);

            if (entity) {
                const processValidateResult = (err?: FieldError) => {
                    setFieldError({[key]: err} as Error<T>);
                    setFieldTouched(key, true);

                    entity.onStoreChange(key);
                };

                validate
                    ? await entity.validate().then(processValidateResult)
                    : processValidateResult();
            }
        };

        Object.assign(store, value);

        if (fieldValidate) {
            Promise.all(Object.keys(value).map(processFieldValidate)).then(() =>
                onValueChange?.(value, store),
            );
        }
    };

    function getFieldValue(): T;
    function getFieldValue(name?: keyof T): T[keyof T];
    function getFieldValue(name?: (keyof T)[]): T;
    function getFieldValue(name?: NamePath<T>) {
        const names = UTIL.namePath(name);
        const value = {} as T;

        const processValue = (entityName?: string) =>
            entityName && Object.assign(value, {[entityName]: store[entityName]});

        names ? getFieldEntitiesName(names).forEach(processValue) : Object.assign(value, store);

        return !Array.isArray(name) && name ? value[name] : value;
    }

    const setFieldError = (err: Error<T>) => Object.assign(error, err);
    function getFieldError(): Error<T>;
    function getFieldError(name?: keyof T): Error<T>[keyof T];
    function getFieldError(name?: (keyof T)[]): Error<T>;
    function getFieldError(name?: NamePath<T>) {
        const names = UTIL.namePath(name);
        const err = {} as Error<T>;

        const processError = (entityName?: string) =>
            entityName && Object.assign(err, {[entityName]: error[entityName]});

        names ? getFieldEntitiesName(names).forEach(processError) : Object.assign(err, error);

        return !Array.isArray(name) && name ? err[name] : err;
    }

    const setInitialValue = (value = {} as T, initialized?: boolean) => {
        if (!initialized) {
            Object.assign(initialValue, value);

            const names = getFieldEntitiesName();
            const fieldValue = {} as T;

            Object.entries(initialValue)
                .filter(([key]) => names.includes(key))
                .forEach(([key, nextValue]) => Object.assign(fieldValue, {[key]: nextValue}));

            setFieldValue(fieldValue);
        }
    };

    const getInitialValue = () => initialValue;
    const setCallback = (callbackValue: Callback<T>) => Object.assign(callback, callbackValue);
    const setFieldTouched = (name?: keyof T, touched = false) => {
        if (name) {
            fieldEntities = [
                ...getFieldEntities().map(fieldEntity =>
                    fieldEntity.props.name === name ? {...fieldEntity, touched} : fieldEntity,
                ),
            ];
        }
    };

    const isFieldTouched = (name?: NamePath<T>) => {
        const names = UTIL.namePath(name);
        const entities = getFieldEntities();
        const processFieldTouched = (entityName?: string) =>
            entityName && entities.find(({props}) => props.name === entityName)?.touched;

        return getFieldEntitiesName(names)
            .map(processFieldTouched)
            .every(item => item);
    };

    function validateField(): Promise<Error<T>>;
    function validateField(name?: keyof T): Promise<Error<T>[keyof T]>;
    function validateField(name?: (keyof T)[]): Promise<Error<T>>;
    async function validateField(name?: NamePath<T>) {
        const names = UTIL.namePath(name);
        const entities = getFieldEntities();
        const processValidate = (entityName?: string) =>
            entityName
                ? entities
                      .find(({props}) => props.name === entityName)
                      ?.validate()
                      .then(err => {
                          setFieldError({[entityName]: err} as Error<T>);

                          return err;
                      })
                : undefined;

        const processFieldError = (fieldErrors: (FieldError | undefined)[]) => {
            const err = {} as Error<T>;

            fieldErrors.forEach(fieldError => {
                const field = fieldError?.errors[0].field;

                field && Object.assign(err, {[field]: fieldError});
            });

            return !Array.isArray(name) && name ? err[name] : err;
        };

        const fieldError = await Promise.all(
            getFieldEntitiesName(names).map(entityName =>
                entityName ? processValidate(entityName) : undefined,
            ),
        );

        return processFieldError(fieldError);
    }

    const resetField = (name?: NamePath<T>) => {
        const names = UTIL.namePath(name);
        const processReset = (entityName?: string) => {
            if (entityName) {
                setFieldValue({[entityName]: undefined} as T, {validate: false});
                setFieldError({[entityName]: undefined} as Error<T>);
            }
        };

        getFieldEntitiesName(names).forEach(processReset);
    };

    const submit = (skipValidate = false) => {
        const {onFinish, onFinishFailed} = callback;
        const handleFailed = (err: Error<T>) => {
            onFinishFailed?.(err);
        };

        const handleFinish = () => onFinish?.(store);

        skipValidate
            ? handleFinish()
            : validateField().then(err =>
                  Object.entries(err).find(([, value]) => value)
                      ? handleFailed(err)
                      : handleFinish(),
              );
    };

    return {
        getFieldEntities,
        getFieldEntitiesName,
        getFieldError,
        getFieldValue,
        getInitialValue,
        isFieldTouched,
        resetField,
        setCallback,
        setFieldError,
        setFieldTouched,
        setFieldValue,
        setInitialValue,
        signInField,
        submit,
        validateField,
    };
};
