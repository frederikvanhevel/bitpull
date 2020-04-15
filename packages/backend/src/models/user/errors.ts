export const userErrors = {
    MissingPasswordError: 'No password was given',
    AttemptTooSoonError: 'Account is currently locked. Try again later',
    TooManyAttemptsError:
        'Account locked due to too many failed login attempts',
    NoSaltValueStoredError: 'Could not log you in',
    IncorrectPasswordError: 'Password or email is incorrect',
    IncorrectUsernameError: 'Password or email is incorrect',
    MissingUsernameError: 'No email was given',
    UserExistsError: 'A user with the given email is already registered'
}

export const isUserError = (error: Error) => {
    return Object.keys(userErrors).includes(error.name)
}
