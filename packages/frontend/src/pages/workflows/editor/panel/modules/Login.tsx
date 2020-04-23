import React from 'react'
import cx from 'classnames'
import { mergeDeepLeft } from 'ramda'
import { makeStyles, Typography, Divider } from '@material-ui/core'
import { LoginNode } from '@bitpull/worker/lib/typedefs'
import SecureInput from 'components/ui/input/SecureInput'
import { Node } from 'typedefs/common'
import Selector from './common/Selector'

interface Props {
    node: LoginNode & Node
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3)
    },
    inline: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    set: {
        backgroundColor: 'rgba(0,0,0,.03)'
    }
}))

const Login: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()
    const {
        credentials = {
            username: {
                value: '',
                selector: '',
                encrypted: true
            },
            password: {
                value: '',
                selector: '',
                encrypted: true
            },
            submit: ''
        }
    } = node

    return (
        <>
            <div
                className={cx(classes.wrapper, {
                    [classes.set]: !!credentials.username.value
                })}
            >
                <div className={classes.inline}>
                    <Typography variant="subtitle1">Username</Typography>

                    {credentials.username.selector && (
                        <SecureInput
                            value={credentials.username.value}
                            name="username"
                            onUpdate={value =>
                                onUpdate(
                                    'credentials',
                                    mergeDeepLeft(
                                        {
                                            username: {
                                                value,
                                                encrypted: true
                                            }
                                        },
                                        credentials
                                    )
                                )
                            }
                        />
                    )}
                </div>

                <Selector
                    label="Selector"
                    selector={{ value: credentials.username.selector }}
                    node={node}
                    withAttribute={false}
                    onUpdate={selector => {
                        onUpdate(
                            'credentials',
                            mergeDeepLeft(
                                {
                                    username: {
                                        selector: selector.value
                                    }
                                },
                                credentials
                            )
                        )
                    }}
                />
            </div>

            <Divider />

            <div
                className={cx(classes.wrapper, {
                    [classes.set]: !!credentials.password.value
                })}
            >
                <div className={classes.inline}>
                    <Typography variant="subtitle1">Password</Typography>

                    {credentials.password.selector && (
                        <SecureInput
                            value={credentials.password.value}
                            name="password"
                            onUpdate={value =>
                                onUpdate(
                                    'credentials',
                                    mergeDeepLeft(
                                        {
                                            password: {
                                                value,
                                                encrypted: true
                                            }
                                        },
                                        credentials
                                    )
                                )
                            }
                        />
                    )}
                </div>

                <Selector
                    label="Selector"
                    selector={{ value: credentials.password.selector }}
                    node={node}
                    withAttribute={false}
                    onUpdate={selector => {
                        onUpdate(
                            'credentials',
                            mergeDeepLeft(
                                {
                                    password: {
                                        selector: selector.value
                                    }
                                },
                                credentials
                            )
                        )
                    }}
                />
            </div>

            <Divider />

            <div
                className={cx(classes.wrapper, {
                    [classes.set]: !!credentials.submit
                })}
            >
                <Typography variant="subtitle1">Submit button</Typography>

                <Selector
                    label="Selector"
                    selector={{ value: credentials.submit }}
                    node={node}
                    withAttribute={false}
                    onUpdate={selector => {
                        onUpdate(
                            'credentials',
                            mergeDeepLeft(
                                {
                                    submit: selector.value
                                },
                                credentials
                            )
                        )
                    }}
                />
            </div>
        </>
    )
}

export default Login
