import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles, Paper, Typography, Theme, Button } from '@material-ui/core'
import { HEADER_HEIGHT } from 'components/navigation/Header'
import { SIDEBAR_WIDTH } from 'components/navigation/sidebar/Sidebar'
import staticImage from './images/new_here.svg'
import { useQuery } from '@apollo/react-hooks'
import { getWorkflows } from 'queries/workflow/typedefs/getWorkflows'
import { GET_WORKFLOWS } from 'queries/workflow'

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        height: `calc(100% - ${HEADER_HEIGHT}px)`,
        zIndex: 10
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'rgba(255, 255, 255, 0.8)'
    },
    modal: {
        zIndex: 10
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 500,
        padding: theme.spacing(6)
    },
    image: {
        width: '50%',
        height: '50%',
        marginBottom: theme.spacing(4)
    },
    description: {
        marginTop: theme.spacing(2),
        textAlign: 'center'
    },
    actions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: theme.spacing(6)
    }
}))

const IntroductionOverlay: React.FC = () => {
    const classes = useStyles()
    const { data, loading } = useQuery<getWorkflows>(GET_WORKFLOWS, {
        fetchPolicy: 'cache-and-network'
    })

    if (loading || data?.getWorkflows.length) return null

    return (
        <div className={classes.wrapper}>
            <div className={classes.backdrop} />

            <div className={classes.modal}>
                <Paper>
                    <div className={classes.content}>
                        {/* <Typography variant="h3">Hello!</Typography> */}

                        <img src={staticImage} className={classes.image} />

                        <Typography variant="h5">Welcome to BitPull</Typography>

                        <Typography
                            variant="body2"
                            className={classes.description}
                        >
                            No analytics to see here yet! Start by creating a
                            workflow either from scratch or choose one from our
                            catalog.
                        </Typography>

                        <div className={classes.actions}>
                            <Button
                                color="primary"
                                variant="contained"
                                component={Link}
                                to="/catalog"
                            >
                                View catalog
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                component={Link}
                                to="/workflow/new"
                            >
                                Create workflow
                            </Button>
                        </div>
                    </div>
                </Paper>
            </div>
        </div>
    )
}

export default IntroductionOverlay
