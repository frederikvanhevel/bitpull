import React, { useState, useEffect } from 'react'
import {
    makeStyles,
    TextField,
    Typography,
    Button,
    FormHelperText
} from '@material-ui/core'
import { WebhookNode } from '@bitpull/worker/lib/typedefs'
import { isFileNode } from '../helper'
import { Node } from 'typedefs/common'
import { useForm } from 'react-hook-form'
import { URL_REGEX } from './common/validation'

interface Props {
    node: WebhookNode & Node
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3)
    },
    inline: {
        display: 'flex',
        alignItems: 'center',
        '& > button': {
            marginLeft: theme.spacing(1),
            justifySelf: 'flex-end'
        }
    },
    success: {
        color: theme.palette.success.main
    }
}))

const getInfoText = (isFile: boolean) => {
    if (isFile) {
        return (
            <>
                <Typography variant="caption">
                    Webhook POST body will be multipart/form-data:
                </Typography>

                <pre>
                    <code>
                        <span>{' name="file"'}</span>
                        <br />
                        <span>{' filename="The name of the file"'}</span>
                    </code>
                </pre>
            </>
        )
    }

    return (
        <>
            <Typography variant="caption">
                Webhook POST body will be JSON:
            </Typography>

            <pre>
                <code>
                    <span>{'{'}</span>
                    <br />
                    <span>{' "data": "The data in json format",'}</span>
                    <br />
                    <span>{'}'}</span>
                </code>
            </pre>
        </>
    )
}

const sendTestRequest = async (url: string, isFile: boolean) => {
    let content
    let headers

    if (isFile) {
        content = new FormData()

        content.append('file', new Blob())
        content.append('filename', 'some-file.test')

        headers = {
            'Content-Type': 'multipart/form-data'
        }
    } else {
        content = JSON.stringify({
            data: [
                {
                    field1: 'value 1',
                    field2: 'value 2'
                }
            ]
        })
        headers = {
            'Content-Type': 'application/json'
        }
    }

    try {
        await fetch(url, {
            method: 'POST',
            body: content,
            headers,
            mode: 'no-cors'
        })

        return true
    } catch (error) {
        return false
    }
}

const Webhook: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()
    const { register, errors, reset } = useForm({
        defaultValues: node,
        mode: 'onChange'
    })
    const [testResult, setTestResult] = useState<boolean | undefined>()
    const isFile = !!node.parent && isFileNode(node.parent)

    useEffect(() => {
        reset(node)
    }, [node])

    return (
        <div className={classes.wrapper}>
            {getInfoText(isFile)}

            <div className={classes.inline}>
                <TextField
                    fullWidth
                    error={!!errors.path}
                    name="path"
                    label="Webhook URL"
                    placeholder="https://example.com/listener.php"
                    inputRef={register({
                        required: true,
                        pattern: URL_REGEX
                    })}
                    onChange={e => onUpdate('path', e.target.value)}
                />

                <Button
                    variant="contained"
                    size="small"
                    disabled={!node.path || !!errors.path}
                    onClick={async () => {
                        setTestResult(undefined)
                        const result = await sendTestRequest(node.path, isFile)
                        setTestResult(result)
                    }}
                >
                    Test
                </Button>
            </div>

            {testResult !== undefined && !testResult && (
                <FormHelperText error>Request failed</FormHelperText>
            )}

            {testResult !== undefined && testResult && (
                <FormHelperText className={classes.success}>
                    Request succeeded
                </FormHelperText>
            )}
        </div>
    )
}

export default Webhook
