import React, { useState } from 'react'
import {
    makeStyles,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core'
import LoadingButton from 'components/ui/buttons/LoadingButton'
import { useForm } from 'react-hook-form'

enum QuestionType {
    FEATURE_REQUEST = 'FEATURE_REQUEST',
    INTEGRATION = 'INTEGRATION',
    WORKFLOW = 'WORKFLOW',
    JOB = 'JOB',
    GENERAL = 'GENERAL'
}

interface FeedbackForm {
    question: string
}

export type Feedback = FeedbackForm & {
    type: QuestionType
    question: string
}

type Props = {
    loading: boolean
    onSubmit: (data: Feedback) => void
}

const DESCRIPTIONS: Record<QuestionType, string> = {
    [QuestionType.FEATURE_REQUEST]:
        'Tell us a bit more about the feature and why you want it.',
    [QuestionType.INTEGRATION]:
        'Which integration would you like to see added?',
    [QuestionType.WORKFLOW]:
        'Tell us abit more about the feature and why you need it.',
    [QuestionType.JOB]:
        'Tell us abit more about the feature and why you need it.',
    [QuestionType.GENERAL]: 'What can we help you with?'
}

const useStyles = makeStyles(() => ({
    select: {
        width: '100%'
    },
    label: {
        background: 'white'
    }
}))

const FeedbackForm: React.FC<Props> = ({ loading, onSubmit }) => {
    const classes = useStyles()
    const { handleSubmit, errors, register, formState } = useForm<FeedbackForm>(
        {
            mode: 'onChange'
        }
    )
    const [type, setType] = useState<QuestionType | undefined>()

    const submit = async (form: FeedbackForm) => {
        onSubmit({
            type: type!,
            ...form
        })
    }

    return (
        <Grid item xs={6} md={6} lg={5} xl={4}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl variant="outlined" className={classes.select}>
                        <InputLabel className={classes.label}>
                            What is your question about?
                        </InputLabel>

                        <Select
                            value={type || ''}
                            onChange={e =>
                                setType(e.target.value as QuestionType)
                            }
                        >
                            <MenuItem value={QuestionType.FEATURE_REQUEST}>
                                I would like to request a feature
                            </MenuItem>
                            <MenuItem value={QuestionType.INTEGRATION}>
                                I want to integrate with another platform
                            </MenuItem>
                            {/* <MenuItem value={QuestionType.WORKFLOW}>
                                My workflow is not working
                            </MenuItem>
                            <MenuItem value={QuestionType.JOB}>
                                There is something wrong with my job
                            </MenuItem> */}
                            <MenuItem value={QuestionType.GENERAL}>
                                I have a general question
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    {type && (
                        <TextField
                            variant="outlined"
                            fullWidth
                            label={DESCRIPTIONS[type]}
                            name="question"
                            error={!!errors.question}
                            multiline
                            rows="5"
                            rowsMax="20"
                            inputRef={register({
                                required: true,
                                maxLength: 2000
                            })}
                            inputProps={{
                                maxLength: 2000
                            }}
                        />
                    )}
                </Grid>
            </Grid>

            <br />

            {type && (
                <LoadingButton
                    color="primary"
                    variant="contained"
                    disabled={!errors || !formState.dirty || loading}
                    loading={loading}
                    onClick={handleSubmit(submit)}
                >
                    Send feedback
                </LoadingButton>
            )}
        </Grid>
    )
}

export default FeedbackForm
