import { Theme } from '@material-ui/core'
import { ChartClasses } from './helper'

export const getStyles = (theme: Theme): ChartClasses => ({
    node: {
        '& rect': {
            rx: 4,
            ry: 4
        },
        '& text': {
            fontFamily: theme.typography.fontFamily,
            fontSize: '16px'
        },
        '&:hover': {
            cursor: 'pointer'
        }
    },
    primaryNode: {
        '& rect': {
            fill: theme.palette.primary.main
        },
        '& rect:hover': {
            fill: theme.palette.primary.dark
        },
        '& text': {
            fill: theme.palette.primary.contrastText
        },
        '& path': {
            fill: theme.palette.primary.contrastText
        }
    },
    secondaryNode: {
        '& rect': {
            fill: theme.palette.secondary.main
        },
        '& rect:hover': {
            fill: theme.palette.secondary.dark
        },
        '& text': {
            fill: theme.palette.secondary.contrastText
        },
        '& path': {
            fill: theme.palette.secondary.contrastText
        }
    },
    defaultNode: {
        '& rect': {
            fill: theme.palette.grey['100'],
            stroke: theme.palette.grey['300']
        },
        '& rect:hover': {
            fill: theme.palette.grey['300'],
            stroke: theme.palette.grey['500']
        },
        '& text': {
            fill: theme.palette.grey['800']
        },
        '& path': {
            fill: theme.palette.grey['800']
        }
    },
    activeNode: {
        '& rect': {
            fill: `${theme.palette.secondary.main} !important`
        },
        '& text': {
            fill: `${theme.palette.secondary.contrastText} !important`
        },
        '& path': {
            fill: `${theme.palette.secondary.contrastText} !important`
        }
    },
    link: {
        fill: 'none',
        stroke: theme.palette.grey['500'],
        strokeWidth: '2px'
    },
    selectedLink: {
        stroke: `${theme.palette.grey['800']} !important`,
        strokeWidth: '4px !important'
    },
    selectedNode: {
        '& rect': {
            filter: 'url(#drop-shadow)'
        }
    },
    unClickable: {
        '& rect': {
            pointerEvents: 'none'
        }
    },
    errorNode: {
        '& rect': {
            fill: theme.palette.error.main,
            stroke: theme.palette.error.dark,
            strokeWidth: '2px'
        },
        '& rect:hover': {
            fill: theme.palette.error.dark,
            stroke: theme.palette.error.dark,
            strokeWidth: '2px'
        },
        '& text': {
            fill: theme.palette.error.contrastText
        },
        '& path': {
            fill: theme.palette.error.contrastText
        }
    },
    disabledNode: {
        '& rect': {
            fill: theme.palette.grey['200'],
            stroke: theme.palette.grey['300']
        },
        '& rect:hover': {
            fill: theme.palette.grey['200'],
            stroke: theme.palette.grey['300']
        },
        '& text': {
            fill: theme.palette.grey['400']
        },
        '& path': {
            fill: theme.palette.grey['400']
        }
    },
    unreachableNode: {
        '& rect': {
            fill: theme.palette.grey['50'],
            stroke: theme.palette.grey['200'],
            strokeWidth: '1px'
        },
        '& text': {
            fill: theme.palette.grey['400']
        },
        '& path': {
            fill: theme.palette.grey['400']
        }
    },
    watchedNode: {
        '& rect': {
            stroke: theme.palette.grey['800'],
            strokeWidth: '2px'
        },
        '& rect:hover': {
            stroke: theme.palette.grey['800'],
            strokeWidth: '2px'
        }
    },
    info: {
        '& rect': {
            fill: '#ffffff',
            stroke: theme.palette.grey['500'],
            strokeWidth: '1px'
        },
        '& text': {
            fill: theme.palette.grey['500']
        }
    },
    icon: {
        fill: `${theme.palette.grey['500']} !important`
    },
    marker: {
        fill: `${theme.palette.grey['500']} !important`
    }
})
