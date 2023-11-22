import {Store} from '../components/Form/formStore';

export type NamePath<T> = keyof T | (keyof T)[];

export const namePath = <T extends Store = Store>(name?: NamePath<T>) => {
    const formatName = Array.isArray(name) ? name : name && [name];

    return name ? formatName : undefined;
};
