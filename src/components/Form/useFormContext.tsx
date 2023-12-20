import {createContext, useContext} from 'react';
import {FormStore, Store} from './formStore';

export const FormContext = createContext<FormStore<Store> | undefined>(
    undefined,
);

export const useFormContext = <T extends Store>() => {
    const contextValue = useContext(FormContext);

    if (!contextValue) {
        throw new Error('useFormContext must be used within a FormProvider');
    }

    return contextValue as FormStore<T>;
};
