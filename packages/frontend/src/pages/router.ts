import { ComponentType } from 'react'
import { createBrowserHistory } from 'history'
import RegistrationPage from './auth/RegistrationPage'
import LoginPage from './auth/LoginPage'
import DashboardPage from './dashboard/DashboardPage'
import ForgotPasswordPage from './auth/ForgotPasswordPage'
import EditorPage from './workflows/editor/EditorPage'
import WorkflowListPage from './workflows/list/WorkflowListPage'
import JobListPage from './jobs/list/JobListPage'
import CreateJobPage from './jobs/editor/CreateJobPage'
import StorageListPage from './storage/StorageListPage'
import IntegrationsListPage from './integrations/IntegrationsListPage'
import IntegrationLoader from './integrations/IntegrationLoader'
import SettingsPage from './settings/SettingsPage'
import VerifyEmailPage from './auth/VerifyEmailPage'
import EmailVerifyingPage from './auth/EmailVerifyingPage'
import CatalogPage from './catalog/CatalogPage'
import ResetPasswordPage from './auth/ResetPasswordPage'
import OAuthCallback from './auth/callbacks/OAuthCallback'
import ReferralPage from './referral/ReferralPage'
import Segment from 'services/segment'

export const history = createBrowserHistory()

history.listen(location => {
    Segment.page(location.pathname)
})

export interface Route {
    exact: boolean
    path: string
    component: ComponentType<any>
    label?: string
}

const publicRoutes: Route[] = [
    {
        exact: true,
        path: '/login',
        component: LoginPage
    },
    {
        exact: true,
        path: '/register',
        component: RegistrationPage
    },
    {
        exact: true,
        path: '/forgot-password',
        component: ForgotPasswordPage
    },
    {
        exact: true,
        path: '/reset-password',
        component: ResetPasswordPage
    },
    {
        exact: true,
        path: '/verify-email',
        component: VerifyEmailPage
    },
    {
        exact: true,
        path: '/verify',
        component: EmailVerifyingPage
    },
    {
        exact: true,
        path: '/auth/callback/:type',
        component: OAuthCallback
    }
]

const privateRoutes: Route[] = [
    {
        exact: true,
        path: '/',
        component: DashboardPage,
        label: 'Dashboard'
    },
    {
        exact: true,
        path: '/workflow/:id',
        component: EditorPage,
        label: 'Workflow editor'
    },
    {
        exact: true,
        path: '/workflows',
        component: WorkflowListPage,
        label: 'Workflows'
    },
    {
        exact: true,
        path: '/jobs',
        component: JobListPage,
        label: 'Jobs'
    },
    {
        exact: true,
        path: '/jobs/new',
        component: CreateJobPage,
        label: 'Create Job'
    },
    {
        exact: true,
        path: '/storage',
        component: StorageListPage,
        label: 'Storage'
    },
    {
        exact: true,
        path: '/integrations',
        component: IntegrationsListPage,
        label: 'Integrations'
    },
    {
        exact: true,
        path: '/integrations/:type',
        component: IntegrationLoader,
        label: 'Integrations'
    },
    {
        exact: true,
        path: '/settings/:tab?',
        component: SettingsPage,
        label: 'Settings'
    },
    {
        exact: true,
        path: '/catalog',
        component: CatalogPage,
        label: 'Catalog'
    },
    {
        exact: true,
        path: '/referral',
        component: ReferralPage,
        label: 'Refer a friend'
    }
]

export { publicRoutes, privateRoutes }
