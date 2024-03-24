import React, {FC} from 'react'
import {StorybookUIRoot} from '../.ondevice/Storybook'
import {ThemeProvider} from './context/ThemeProvider'

const App: FC = () => (
    <ThemeProvider>
        <StorybookUIRoot />
    </ThemeProvider>
)

export default App
