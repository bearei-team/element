import {FC, useEffect, useRef} from 'react';
import {SvgProps} from 'react-native-svg';
import {useImmer} from 'use-immer';
import {IconProps} from './Icon';

export type UseSVGImportOptions = Pick<IconProps, 'type' | 'icon'>;

export const useSVGImport = ({type, icon}: UseSVGImportOptions) => {
    const [_loading, setLoading] = useImmer(false);
    const ImportedIconRef = useRef<FC<SvgProps>>();

    useEffect(() => {
        setLoading(() => true);

        const importIcon = async () => {
            ImportedIconRef.current = (
                await import(`@material-design-icons/svg/${type}/${icon}.svg`)
            )?.default;
        };

        importIcon().finally(() => setLoading(() => false));
    }, [icon, setLoading, type]);

    return [ImportedIconRef.current];
};
