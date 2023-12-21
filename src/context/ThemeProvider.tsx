import {Theme, theme} from '@bearei/theme';
import React, {FC, ReactNode} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {ThemeProvider as StyledComponentThemeProvider} from 'styled-components/native';
import {AdaptOptions} from '../utils/adapt.utils';
import {UTIL} from '../utils/util';

export interface ThemeProps {
    adaptOptions?: AdaptOptions;
    children?: ReactNode;
    theme?: Theme;
}

export const ThemeProvider: FC<ThemeProps> = props => {
    const {adaptOptions, children, theme: themeProvider} = props;
    const {adaptFontSize, adaptSize} = UTIL.adapt(adaptOptions);
    const colorScheme = useColorScheme() ?? 'light';
    const OS = Platform.OS;

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
        </StyledComponentThemeProvider>
    );
};
