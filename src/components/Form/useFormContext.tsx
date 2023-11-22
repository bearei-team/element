import {createContext, useContext} from 'react';
import {FormStore, Store} from './formStore';

export const FormContext = createContext<FormStore<Store>>({} as FormStore<Store>);
export const useFormContext = <T extends Store>() => useContext(FormContext) as FormStore<T>;
