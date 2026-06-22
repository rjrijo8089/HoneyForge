export type WizardCloneType = 'full' | 'template' | 'partial' | 'api-mock'

export type WizardDecoyCategory =
  | 'web-app' | 'admin-panel' | 'api-endpoint'
  | 'login-portal' | 'customer-portal' | 'file-server'

export interface WizardStep1 {
  url: string
  cloneType: WizardCloneType
  authRequired: boolean
  username: string
  password: string
  analyzed: boolean
  detectedTitle: string
  detectedPages: number
  detectedForms: number
  detectedLinks: number
}

export interface WizardStep2 {
  name: string
  description: string
  category: WizardDecoyCategory
  tags: string
  department: string
  businessOwner: string
}

export interface WizardStep3 {
  sqlInjection: boolean
  xss: boolean
  lfi: boolean
  rfi: boolean
  commandInjection: boolean
  credentialLogging: boolean
  directoryTraversal: boolean
  payloadCapture: boolean
  userAgentCapture: boolean
  cookieCapture: boolean
  headerCapture: boolean
}

export interface WizardStep4 {
  opensearch: { enabled: boolean; host: string; port: string }
  splunk:     { enabled: boolean; hecUrl: string; token: string }
  sentinel:   { enabled: boolean; workspaceId: string; sharedKey: string }
  qradar:     { enabled: boolean; host: string; port: string }
  misp:       { enabled: boolean; url: string; apiKey: string }
  slack:      { enabled: boolean; webhookUrl: string }
  email:      { enabled: boolean; address: string }
  webhook:    { enabled: boolean; url: string }
}

export interface WizardData {
  step1: WizardStep1
  step2: WizardStep2
  step3: WizardStep3
  step4: WizardStep4
}

export const DEFAULT_WIZARD: WizardData = {
  step1: {
    url: '', cloneType: 'full', authRequired: false,
    username: '', password: '', analyzed: false,
    detectedTitle: '', detectedPages: 0, detectedForms: 0, detectedLinks: 0,
  },
  step2: {
    name: '', description: '', category: 'web-app',
    tags: '', department: '', businessOwner: '',
  },
  step3: {
    sqlInjection: true, xss: true, lfi: true, rfi: false,
    commandInjection: true, credentialLogging: true, directoryTraversal: true,
    payloadCapture: true, userAgentCapture: true, cookieCapture: false, headerCapture: false,
  },
  step4: {
    opensearch: { enabled: true, host: 'localhost', port: '9200' },
    splunk:     { enabled: false, hecUrl: '', token: '' },
    sentinel:   { enabled: false, workspaceId: '', sharedKey: '' },
    qradar:     { enabled: false, host: '', port: '514' },
    misp:       { enabled: false, url: '', apiKey: '' },
    slack:      { enabled: false, webhookUrl: '' },
    email:      { enabled: false, address: '' },
    webhook:    { enabled: false, url: '' },
  },
}
