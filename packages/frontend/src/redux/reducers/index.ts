import { combineReducers } from 'redux'

import user from './user'
import settings from './settings'
import layout from './layout'
import workflow from './workflow'
import storage from './storage'

export default combineReducers({
    user,
    settings,
    layout,
    workflow,
    storage
})
