import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core'
import client from 'graphql/apollo-client'
import { configureStore } from 'redux/store'
import theme from 'constants/theme'
import Notifications from 'components/navigation/Notifications'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Initializer from 'Initializer'

const store = configureStore()

const Wrapper: React.FC = () => {
    return (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <SnackbarProvider maxSnack={3}>
                            <>
                            <CssBaseline />
                            <Notifications />
                            <Initializer />
                            </>
                        </SnackbarProvider>
                    </MuiPickersUtilsProvider>
                </MuiThemeProvider>
            </Provider>
        </ApolloProvider>
    )
}

ReactDOM.render(<Wrapper />, document.getElementById('main'))
