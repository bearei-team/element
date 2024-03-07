import {ValidateError} from 'async-validator';
import {NamePath, namePath} from '../../utils/namePath.utils';
import {ValidateOptions} from '../../utils/validate.utils';
import {FormItemProps} from './FormItem/FormItem';

export type Store = Record<string, unknown>;
export interface FieldError extends Pick<ValidateOptions, 'rules'> {
    errors: ValidateError[];
}

type Error<T> = Record<keyof T, FieldError | undefined>;
export interface Callback<T extends Store> {
    onFinish?: (value: T) => void;
    onFinishFailed?: (error: Error<T>) => void;
    onValueChange?: (changedValue: T, value: T) => void;
}

interface FieldEntity {
    onFormStoreChange: () => void;
    props: FormItemProps;
    touched: boolean;
    validate: (value?: unknown) => Promise<FieldError | undefined>;
}

interface SetFieldValueOptions {
    updateComponent?: boolean;
    skipValidate?: boolean;
}

export interface FormStore<T extends Store> {
    getFieldEntities: (signOut?: boolean) => FieldEntity[];
    getFieldEntitiesName: (names?: (keyof T)[], signOut?: boolean) => (keyof T | undefined)[];
    getFieldError: {
        (): Error<T>;
        (name?: (keyof T)[]): Error<T>;
        (name?: keyof T): Error<T>[keyof T];
    };
    getFieldValue: {(): T; (name?: (keyof T)[]): T; (name?: keyof T): T[keyof T]};
    getInitialValue: {(): T; (name?: (keyof T)[]): T; (name?: keyof T): T[keyof T]};
    isFieldTouched: (name?: NamePath<T>) => boolean;
    resetField: (name?: NamePath<T>) => void;
    setCallback: (callback: Callback<T>) => void;
    setFieldError: (error: Error<T>) => void;
    setFieldTouched: (name?: keyof T, touched?: boolean) => void;
    setFieldValue: (value?: T, options?: SetFieldValueOptions) => void;
    setInitialValue: (value?: T, init?: boolean) => void;
    signInField: (entity: FieldEntity) => {signOut: () => void} | undefined;
    signOutField: (name?: NamePath<T>) => void;
    submit: (skipValidate?: boolean) => void;
    validateField: {
        (): Promise<Error<T>>;
        (name?: (keyof T)[]): Promise<Error<T>>;
        (name?: keyof T): Promise<Error<T>[keyof T]>;
    };
}

const createFormContext = <T extends Store>() => ({
    callback: {} as Callback<T>,
    error: {} as Error<T>,
    fieldEntities: [] as FieldEntity[],
    initialValue: {} as T,
    store: {} as T,
});

export const formStore = <T extends Store>(): FormStore<T> => {
    let {callback, error, fieldEntities, initialValue, store} = createFormContext<T>();
    const getFieldEntities = (signOut = false) =>
        signOut ? fieldEntities : fieldEntities.filter(fieldEntity => fieldEntity.props.name);

    const getFieldEntitiesName = (names?: (keyof T)[], signOut = false) => {
        const entityNames = getFieldEntities(signOut).map(({props}) => props.name);

        return [
            ...(names ? entityNames.filter(name => name && names.includes(name)) : entityNames),
        ];
    };

    const getFieldError = ((name?: NamePath<T>) => {
        let err = {} as Error<T>;
        const names = namePath(name);
        const processError = (entityName?: keyof T) =>
            entityName && (err = {...err, [entityName]: error[entityName]});

        names && getFieldEntitiesName(names).forEach(processError);
        !names && (err = {...err, ...error});

        return !Array.isArray(name) && name ? err[name] : err;
    }) as FormStore<T>['getFieldError'];

    const getFieldValue = ((name?: NamePath<T>) => {
        let value = {} as T;
        const names = namePath(name);
        const processValue = (entityName?: keyof T) =>
            entityName && (value = {...value, [entityName]: store[entityName]});

        names && getFieldEntitiesName(names).forEach(processValue);
        !names && (value = {...value, ...store});

        return !Array.isArray(name) && name ? value[name] : value;
    }) as FormStore<T>['getFieldValue'];

    const getInitialValue = ((name?: NamePath<T>) => {
        let value = {} as T;
        const names = namePath(name);
        const processValue = (entityName?: keyof T) =>
            entityName && (value = {...value, [entityName]: initialValue[entityName]});

        names && getFieldEntitiesName(names).forEach(processValue);
        !names && (value = {...value, ...store});

        return !Array.isArray(name) && name ? value[name] : value;
    }) as FormStore<T>['getInitialValue'];

    const isFieldTouched = (name?: NamePath<T>) => {
        const names = namePath(name);
        const entities = getFieldEntities();
        const processFieldTouched = (entityName?: keyof T) =>
            entityName && entities.find(({props}) => props.name === entityName)?.touched;

        return getFieldEntitiesName(names)
            .map(processFieldTouched)
            .every(item => item);
    };

    const resetField = (name?: NamePath<T>) => {
        const names = namePath(name);
        const processReset = (entityName?: keyof T) => {
            if (!entityName) {
                return;
            }

            setFieldValue({[entityName]: undefined} as T, {skipValidate: true});
            setFieldError({[entityName]: undefined} as Error<T>);
        };

        getFieldEntitiesName(names).forEach(processReset);
    };

    const setCallback = (callbackValue: Callback<T>) =>
        (callback = {...callback, ...callbackValue});

    const setFieldError = (err: Error<T>) => (error = {...error, ...err});
    const setFieldTouched = (name?: keyof T, touched = false) => {
        if (!name) {
            return;
        }

        fieldEntities = [
            ...getFieldEntities().map(fieldEntity =>
                fieldEntity.props.name === name ? {...fieldEntity, touched} : fieldEntity,
            ),
        ];
    };

    const setFieldValue = (
        value = {} as T,
        {updateComponent = true, skipValidate = false} = {} as SetFieldValueOptions,
    ) => {
        const {onValueChange} = callback;
        const entities = getFieldEntities();
        const processStoreUpdate = (onStoreChange?: (changedValue: T, value: T) => void) => {
            store = {...store, ...value};

            onStoreChange?.(value, store);
        };

        const processValidateResult = (entity: FieldEntity, err?: FieldError) => {
            const name = entity.props.name;

            if (!name) {
                return;
            }

            processStoreUpdate();
            setFieldError({[name]: err} as Error<T>);
            setFieldTouched(name, true);

            entity.onFormStoreChange();
        };

        const processUpdateComponent = async (name: keyof T) => {
            const entity = entities.find(({props}) => props.name === name);

            if (!entity) {
                return;
            }

            skipValidate
                ? processValidateResult(entity)
                : await entity
                      .validate(value[entity.props.name!])
                      .then(err => processValidateResult(entity, err));
        };

        updateComponent
            ? Promise.all(Object.keys(value).map(processUpdateComponent)).then(() =>
                  onValueChange?.(value, store),
              )
            : processStoreUpdate(onValueChange);
    };

    const setInitialValue = (value = {} as T, initialized?: boolean) => {
        if (initialized) {
            return;
        }

        initialValue = {...initialValue, ...value};
    };

    const signInField = (entity: FieldEntity) => {
        const {name} = entity.props;

        if (!name) {
            return;
        }

        const entities = getFieldEntities(true);
        const exist = entities.find(({props}) => props.name === name);

        if (exist) {
            return;
        }

        fieldEntities = [...entities, entity];

        setFieldValue({[name]: undefined} as T, {updateComponent: false});
        setFieldError({[name]: undefined} as Error<T>);

        return {
            signOut: () => signOutField(name),
        };
    };

    const signOutField = (name?: NamePath<T>) => {
        const names = namePath(name);
        const entities = getFieldEntities(true);
        const processSignOut = (signOutName?: keyof T) => {
            if (!signOutName) {
                return;
            }

            const fieldEntity = entities.find(({props}) => props.name === signOutName);

            if (!fieldEntity) {
                return;
            }

            const {[signOutName]: _signOutError, ...nextError} = error;
            const {[signOutName]: _signOutStore, ...nextFormStore} = store;

            setFieldValue(nextFormStore as T, {updateComponent: false});
            setFieldError(nextError as Error<T>);

            fieldEntities = entities.filter(({props}) => props.name !== signOutName);
        };

        getFieldEntitiesName(names).forEach(processSignOut);
    };

    const submit = (skipValidate = false) => {
        const {onFinish, onFinishFailed} = callback;
        const processFailed = (err: Error<T>) => onFinishFailed?.(err);
        const processFinish = () => onFinish?.(store);

        skipValidate
            ? processFinish()
            : validateField().then(err => {
                  Object.entries(err).some(([, value]) => value)
                      ? processFailed(err)
                      : processFinish();
              });
    };

    const validateField = (async (name?: NamePath<T>) => {
        const names = namePath(name);
        const entities = getFieldEntities();
        const processValidate = async (entityName?: keyof T) => {
            if (!entityName) {
                return;
            }

            const value = getFieldValue(entityName);
            const entity = entities.find(({props}) => props.name === entityName);

            return entity?.validate(value).then(err => {
                setFieldError({[entityName]: err} as Error<T>);
                err && entity.onFormStoreChange();

                return err;
            });
        };

        const processFieldError = (fieldErrors: (FieldError | undefined)[]) => {
            let err = {} as Error<T>;

            fieldErrors.forEach(fieldError => {
                const field = fieldError?.errors[0].field;

                field && (err = {...err, [field]: fieldError});
            });

            return !Array.isArray(name) && name ? err[name] : err;
        };

        const fieldError = await Promise.all(getFieldEntitiesName(names).map(processValidate));

        return processFieldError(fieldError);
    }) as FormStore<T>['validateField'];

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
        signOutField,
        submit,
        validateField,
    };
};
