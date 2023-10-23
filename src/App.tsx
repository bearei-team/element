/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {FC} from 'react';
import {StorybookUIRoot} from '../.ondevice/Storybook';
import {ThemeProvider} from './context/ThemeProvider';

const App: FC = (): React.JSX.Element => (
    <ThemeProvider>
        <StorybookUIRoot />
    </ThemeProvider>
);

export default App;
