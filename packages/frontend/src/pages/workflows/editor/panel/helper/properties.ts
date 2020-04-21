import { ElementType } from 'react'
import { NodeType } from '@bitpull/worker/lib/typedefs'
import UrlIcon from '@material-ui/icons/Public'
import CollectIcon from '@material-ui/icons/SettingsEthernet'
import PaginateIcon from '@material-ui/icons/ChromeReaderMode'
import LoginIcon from '@material-ui/icons/Lock'
import ClickIcon from '@material-ui/icons/TouchApp'
import PdfIcon from '@material-ui/icons/PictureAsPdf'
import ScreenshotIcon from '@material-ui/icons/PhotoSizeSelectLarge'
import SlackIcon from 'components/ui/icons/slack-icon'
import DropboxIcon from 'components/ui/icons/dropbox-icon'
import GoogleDriveIcon from 'components/ui/icons/google-drive-icon'
import OnedriveIcon from 'components/ui/icons/onedrive-icon'
import StorageIcon from 'components/ui/icons/storage-icon'
import ExcelIcon from 'components/ui/icons/excel-icon'
import JsonIcon from 'components/ui/icons/json-icon'
import WebhookIcon from 'components/ui/icons/webhook-icon'
import EditUrl from '../modules/EditUrl'
import Collect from '../modules/Collect'
import Pagination from '../modules/Pagination'
import Webhook from '../modules/Webhook'
import Click from '../modules/Click'
import Slack from '../modules/Slack'
import Dropbox from '../modules/Dropbox'
import Storage from '../modules/Storage'
import Pdf from '../modules/Pdf'
import Login from '../modules/Login'
import Screenshot from '../modules/Screenshot'
import GoogleDrive from '../modules/GoogleDrive'
import OneDrive from '../modules/OneDrive'
import Github from '../modules/Github'
import Excel from '../modules/Excel'
import Json from '../modules/Json'
import EmailIcon from '@material-ui/icons/Email'
import { HourglassEmpty, GitHub } from '@material-ui/icons'
import Wait from '../modules/Wait'
import Email from '../modules/Email'
import Csv from '../modules/Csv'
import CsvIcon from 'components/ui/icons/csv-icon'
import Scroll from '../modules/Scroll'
import ScrollIcon from 'components/ui/icons/scroll-icon'

export interface NodeProperty {
    icon: ElementType
    label: string
    shortLabel: string
    editor: ElementType
}

export const NODE_PROPERTIES: Record<NodeType, NodeProperty> = {
    [NodeType.HTML]: {
        icon: UrlIcon,
        label: 'Get HTML content',
        shortLabel: 'Get HTML',
        editor: EditUrl
    },
    [NodeType.COLLECT]: {
        icon: CollectIcon,
        label: 'Collect data',
        shortLabel: 'Collect',
        editor: Collect
    },
    [NodeType.PAGINATION]: {
        icon: PaginateIcon,
        label: 'Pagination',
        shortLabel: 'Pagination',
        editor: Pagination
    },
    [NodeType.WEBHOOK]: {
        icon: WebhookIcon,
        label: 'Webhook',
        shortLabel: 'Webhook',
        editor: Webhook
    },
    [NodeType.CLICK]: {
        icon: ClickIcon,
        label: 'Click element',
        shortLabel: 'Click',
        editor: Click
    },
    [NodeType.SLACK]: {
        icon: SlackIcon,
        label: 'Send to Slack channel',
        shortLabel: 'Slack',
        editor: Slack
    },
    [NodeType.EMAIL]: {
        icon: EmailIcon,
        label: 'Notify by email',
        shortLabel: 'Email',
        editor: Email
    },
    [NodeType.DROPBOX]: {
        icon: DropboxIcon,
        label: 'Upload to dropbox',
        shortLabel: 'Dropbox',
        editor: Dropbox
    },
    [NodeType.STORAGE]: {
        icon: StorageIcon,
        label: 'Add to storage',
        shortLabel: 'Storage',
        editor: Storage
    },
    [NodeType.GOOGLE_DRIVE]: {
        icon: GoogleDriveIcon,
        label: 'Upload to Google Drive',
        shortLabel: 'Google Drive',
        editor: GoogleDrive
    },
    [NodeType.ONEDRIVE]: {
        icon: OnedriveIcon,
        label: 'Upload to OneDrive',
        shortLabel: 'OneDrive',
        editor: OneDrive
    },
    [NodeType.GITHUB]: {
        icon: GitHub,
        label: 'Upload to Github',
        shortLabel: 'Github',
        editor: Github
    },
    [NodeType.EXCEL]: {
        icon: ExcelIcon,
        label: 'Convert to Excel doc',
        shortLabel: 'Excel',
        editor: Excel
    },
    [NodeType.CSV]: {
        icon: CsvIcon,
        label: 'Convert to Csv file',
        shortLabel: 'Csv',
        editor: Csv
    },
    [NodeType.JSON]: {
        icon: JsonIcon,
        label: 'Convert to JSON file',
        shortLabel: 'JSON file',
        editor: Json
    },
    [NodeType.PDF]: {
        icon: PdfIcon,
        label: 'Convert to PDF file',
        shortLabel: 'PDF file',
        editor: Pdf
    },
    [NodeType.SCREENSHOT]: {
        icon: ScreenshotIcon,
        label: 'Take screenshot',
        shortLabel: 'Screenshot',
        editor: Screenshot
    },
    [NodeType.LOGIN]: {
        icon: LoginIcon,
        label: 'Login form',
        shortLabel: 'Login',
        editor: Login
    },
    [NodeType.WAIT]: {
        icon: HourglassEmpty,
        label: 'Wait x amount',
        shortLabel: 'Wait',
        editor: Wait
    },
    [NodeType.SCROLL]: {
        icon: ScrollIcon,
        label: 'Scroll page',
        shortLabel: 'Scroll',
        editor: Scroll
    },
    [NodeType.FUNCTION]: {
        icon: UrlIcon,
        label: 'Function - DEV ONLY',
        shortLabel: 'Function',
        editor: EditUrl
    }
}
