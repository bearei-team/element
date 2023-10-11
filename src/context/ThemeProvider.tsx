import {Theme, theme} from '@bearei/theme';
import {FC, ReactNode} from 'react';
import {useColorScheme} from 'react-native';
import {ThemeProvider as StyledComponentThemeProvider} from 'styled-components/native';

export interface ThemeProps {
    children?: ReactNode;
    theme?: Theme;
}

export const ThemeProvider: FC<ThemeProps> = ({
    children,
    theme: themeProvider,
}): React.JSX.Element => {
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <StyledComponentThemeProvider
            theme={{...(themeProvider ?? theme({scheme: colorScheme})), colorScheme}}>
            {children}
        </StyledComponentThemeProvider>
    );
};
