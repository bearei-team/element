import {useLazyRef} from '../../hooks/useLazyRef';

const useForm = (form: any) => {
    const formRef = useLazyRef(() => ({}));

    if (!formRef.current) {
        formRef.current = form ? form : {};
    }

    return [formRef.current];
};

export {useForm};
