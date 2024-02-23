import {Theme, theme} from '@bearei/theme';
import React, {FC, ReactNode, useId} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {ThemeProvider as StyledComponentThemeProvider} from 'styled-components/native';
import {Root} from '../components/Common/Common.styles';
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
    const id = useId();

    return (
        <StyledComponentThemeProvider
            theme={{
                ...(themeProvider ?? theme({scheme: colorScheme})),
                adaptFontSize,
                adaptSize,
                colorScheme,
                OS,
            }}>
            <Root testID={`root--${id}`}>
                <ModalProvider />
                {children}
            </Root>
        </StyledComponentThemeProvider>
    );
};
