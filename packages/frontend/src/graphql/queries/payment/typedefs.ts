import { getInvoices_getInvoices } from './typedefs/getInvoices'
import { getUsageSummary_getUsageSummary } from './typedefs/getUsageSummary'

export type Invoice = Omit<getInvoices_getInvoices, '__typename'>
export type UsageSummary = Omit<getUsageSummary_getUsageSummary, '__typename'>
