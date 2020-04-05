import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import ExpandableOptionRow from 'components/ui/expandable/ExpandableOptionRow'
import { IntegrationType } from '@bitpull/worker/lib/typedefs'
import { DropboxNode } from '@bitpull/worker/lib/typedefs'
import { useForm } from 'react-hook-form'
import { FILE_PATH_REGEX } from './common/validation'
import useIntegrations from 'hooks/useIntegrations'
import IntegrationWarning from 'components/ui/IntegrationWarning'

interface Props {
    node: DropboxNode
    onUpdate: (key: string, value: any) => void
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        padding: theme.spacing(3),
        '& > div': {
            width: '100%'
        }
    },
    expand: {
        padding: `0 ${theme.spacing(2)}px`,
        marginBottom: theme.spacing(2)
    }
}))

const Dropbox: React.FC<Props> = ({ node, onUpdate }) => {
    const classes = useStyles()
    const { integrations, loading } = useIntegrations()
    const { register, errors } = useForm({
        defaultValues: node,
        mode: 'onChange'
    })
    const dropBoxIntegration = integrations.find(
        integration => integration.type === IntegrationType.DROPBOX
    )
    const valid = !!(dropBoxIntegration && dropBoxIntegration.active)

    return (
        <div>
            <ExpandableOptionRow
                className={classes.expand}
                title="Upload to a specific directory"
                active={node.useDirectory || false}
                disabled={!valid}
                onChange={e => onUpdate('useDirectory', e.target.checked)}
            >
                <TextField
                    error={!!errors.directory}
                    name="directory"
                    label="Enter a folder path"
                    placeholder="/example/folder/structure/"
                    fullWidth
                    inputRef={register({
                        required: true,
                        pattern: FILE_PATH_REGEX
                    })}
                    onChange={e => onUpdate('directory', e.target.value)}
                />
            </ExpandableOptionRow>

            {!loading && !valid && (
                <div className={classes.wrapper}>
                    <IntegrationWarning type={IntegrationType.DROPBOX} />
                </div>
            )}
        </div>
    )
}

export default Dropbox
