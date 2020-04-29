import React, { useState } from 'react'
import { TextField, makeStyles } from '@material-ui/core'
import ConfirmDialog from 'components/ui/dialogs/ConfirmDialog'
import { useForm } from 'react-hook-form'
import { MULTIPLE_URL_REGEX, URL_REGEX } from '../common/validation'

interface Props {
    links?: string[]
    open?: boolean
    onConfirm: (links: string[]) => void
    onClose: () => void
}

const useStyles = makeStyles(theme => ({
    footer: {
        marginLeft: theme.spacing(2)
    }
}))

const UrlInputDialog: React.FC<Props> = ({
    links = [],
    open,
    onConfirm,
    onClose
}) => {
    const classes = useStyles()
    console.log(links.join('\n'))
    const { register, errors } = useForm({
        defaultValues: {
            links: links.join('\n')
        },
        mode: 'onChange'
    })
    const [newLinks, setNewLinks] = useState<string[]>(links)
    const onChange = (content: string) => {
        const set = new Set<string>(
            content
                .split(/[\n,]/)
                .map(link => link.trim())
                .filter(link => link !== '' && URL_REGEX.test(link))
        )
        setNewLinks(Array.from(set))
    }

    return (
        <ConfirmDialog
            title="Enter links"
            confirmLabel="Submit"
            open={!!open}
            disabled={!!errors.links}
            maxWidth="xs"
            onConfirm={() => onConfirm(newLinks)}
            onClose={onClose}
            footer={
                <div className={classes.footer}>
                    <strong>{newLinks.length}</strong> unique{' '}
                    {newLinks.length === 1 ? 'link' : 'links'}
                </div>
            }
        >
            <TextField
                name="links"
                fullWidth
                multiline
                rows={10}
                placeholder="Enter Links separated by a new line"
                onChange={e => onChange(e.target.value)}
                autoComplete="off"
                autoFocus
                error={!!errors.links}
                inputRef={register({
                    required: true,
                    pattern: MULTIPLE_URL_REGEX
                })}
            />
        </ConfirmDialog>
    )
}

export default UrlInputDialog
