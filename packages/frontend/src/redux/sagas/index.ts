import { all } from 'redux-saga/effects'
import user from './user'
import settings from './settings'
import workflow from './workflow'
import runner from './runner'

export default function* rootSaga() {
    yield all([...user, ...settings, ...workflow, ...runner])
}
