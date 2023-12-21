import {Theme, theme} from '@bearei/theme';
import mitt from 'mitt';
import React, {FC, ReactNode} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {ThemeProvider as StyledComponentThemeProvider} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {AdaptOptions} from '../utils/adapt.utils';
import {UTIL} from '../utils/util';
export interface ThemeProps {
    adaptOptions?: AdaptOptions;
    children?: ReactNode;
    theme?: Theme;
}

export type EmitterEvent = {
    sheet: React.JSX.Element;
};

export const emitter = mitt<EmitterEvent>();
export const ThemeProvider: FC<ThemeProps> = props => {
    const [{sheet}, setSheet] = useImmer({sheet: <></>});
    const {adaptOptions, children, theme: themeProvider} = props;
    const {adaptFontSize, adaptSize} = UTIL.adapt(adaptOptions);
    const colorScheme = useColorScheme() ?? 'light';
    const OS = Platform.OS;

    emitter.on('sheet', event =>
        setSheet(draft => {
            draft.sheet = event;
        }),
    );

    return (
        <StyledComponentThemeProvider
            theme={{
                ...(themeProvider ?? theme({scheme: colorScheme})),
                adaptFontSize,
                adaptSize,
                colorScheme,
                OS,
            }}>
            {children}
            {sheet}
        </StyledComponentThemeProvider>
    );
};
