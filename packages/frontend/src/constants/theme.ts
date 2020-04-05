import { createMuiTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'

declare module '@material-ui/core/styles/createPalette' {
    interface Palette {
        tertiary: PaletteColor
        success: PaletteColor
        link: PaletteColor
    }

    interface PaletteOptions {
        tertiary: PaletteColorOptions
        // @ts-ignore
        success: PaletteColorOptions
        link: PaletteColorOptions
    }
}

export default createMuiTheme({
    typography: {
        fontFamily: `'Open Sans', sans-serif`,
        fontWeightMedium: 600
    },
    palette: {
        // primary: {
        //     light: '#50acfc',
        //     main: '#0084ff',
        //     dark: '#0066c8',
        //     contrastText: '#ffffff'
        // },
        primary: {
            light: '#61d8ff',
            main: '#0aa6d2',
            dark: '#0077a1',
            contrastText: '#ffffff'
        },
        secondary: {
            light: '#ffdfa8',
            main: '#ffbc42',
            dark: '#c79233',
            contrastText: '#000000'
        },
        tertiary: {
            light: '#e33371',
            main: '#dc004e',
            dark: '#9a0036',
            contrastText: '#ffffff'
        },
        success: {
            light: '#76d275',
            main: '#43a047',
            dark: '#00701a',
            contrastText: '#fff'
        },
        error: {
            light: '#ff6659',
            main: '#d32f2f',
            dark: '#9a0007',
            contrastText: '#fff'
        },
        link: {
            light: '#50acfc',
            main: '#0084ff',
            dark: '#0066c8',
            contrastText: '#fff'
        }
    },
    overrides: {
        MuiTooltip: {
            tooltip: {
                backgroundColor: 'rgba(238, 238, 238, .99)',
                color: grey['600'],
                fontSize: '0.8rem'
            }
        }
    }
})
