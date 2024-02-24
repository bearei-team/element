import {addDecorator} from '@storybook/react';
import React from 'react';
import {ThemeProvider} from '../src/context/ThemeProvider';

export const parameters = {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

addDecorator(story => <ThemeProvider>{story()}</ThemeProvider>);
