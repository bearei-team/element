import {Theme, theme} from '@bearei/theme';
import {FC, ReactNode} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {ThemeProvider as StyledComponentThemeProvider} from 'styled-components/native';
import {AdaptOptions} from '../utils/adapt.utils';
import {UTIL} from '../utils/util';

export interface ThemeProps {
    children?: ReactNode;
    theme?: Theme;
    adaptOptions: AdaptOptions;
}

export const ThemeProvider: FC<ThemeProps> = ({children, theme: themeProvider, adaptOptions}) => {
    const colorScheme = useColorScheme() ?? 'light';
    const OS = Platform.OS;
    const {adaptSize, adaptFontSize} = UTIL.adapt(adaptOptions);

    return (
        <StyledComponentThemeProvider
            theme={{
                ...(themeProvider ?? theme({scheme: colorScheme})),
                colorScheme,
                OS,
                adaptSize,
                adaptFontSize,
            }}>
            {children}
        </StyledComponentThemeProvider>
    );
};
