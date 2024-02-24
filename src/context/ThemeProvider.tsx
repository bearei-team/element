import {Theme, theme} from '@bearei/theme';
import React, {FC, ReactNode} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {ThemeProvider as StyledComponentThemeProvider} from 'styled-components/native';
import {AdaptOptions, adapt} from '../utils/adapt.utils';
import {ModalProvider} from './ModalProvider';

export interface ThemeProps {
    adaptOptions?: AdaptOptions;
    children?: ReactNode;
    theme?: Theme;
}

export const ThemeProvider: FC<ThemeProps> = ({adaptOptions, children, theme: themeProvider}) => {
    const {adaptFontSize, adaptSize} = adapt(adaptOptions);
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
            <ModalProvider />
            {children}
        </StyledComponentThemeProvider>
    );
};
