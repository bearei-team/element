import {useLazyRef} from '../../hooks/useLazyRef';
import {FormStore, Store, formStore} from './formStore';

export const useForm = <T extends Store>(form?: FormStore<T>) => {
    const [formRef] = useLazyRef(() => form ?? formStore<T>());

    return [formRef.current];
};
