import React from 'react'
import { Breadcrumbs, Typography, makeStyles } from '@material-ui/core'

interface Props {
    label: string
    subLabel?: string
    path: string
}

const useStyles = makeStyles(() => ({
    breadcrumbs: {
        flexGrow: 1,
        '& p, & a': {
            textDecoration: 'none'
        }
    }
}))

const BreadCrumb: React.FC<Props> = ({ label }) => {
    const classes = useStyles()

    return (
        <Breadcrumbs className={classes.breadcrumbs}>
            <Typography variant="h6">{label}</Typography>

            {/* {pathParams.map(param => (
                <Typography key={param as string} variant="h6">
                    {param as string}
                </Typography>
            ))}

            {subLabel && <Typography variant="h6">{subLabel}</Typography>} */}
        </Breadcrumbs>
    )
}

export default BreadCrumb
