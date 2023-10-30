import {Theme, theme} from '@bearei/theme';
import {FC, ReactNode} from 'react';
import {Platform, useColorScheme} from 'react-native';
import {ThemeProvider as StyledComponentThemeProvider} from 'styled-components/native';

export interface ThemeProps {
    children?: ReactNode;
    theme?: Theme;
}

export type Device = 'mobile' | 'pc' | 'web';

export const ThemeProvider: FC<ThemeProps> = ({children, theme: themeProvider}) => {
    const colorScheme = useColorScheme() ?? 'light';
    const OS = Platform.OS;

    return (
        <StyledComponentThemeProvider
            theme={{
                ...(themeProvider ?? theme({scheme: colorScheme})),
                colorScheme,
                OS,
            }}>
            {children}
        </StyledComponentThemeProvider>
    );
};
