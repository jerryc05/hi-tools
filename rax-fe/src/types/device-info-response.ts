export interface DeviceInfoResponse {
  deviceInfo: DeviceInfo
  appInfo: AppInfoOuter
}

export interface DeviceInfo {
  deviceName: string
  deviceRole: string
  deviceSystemVersion: string
  deviceType: string
  ipAddress: string
}

export interface AppInfoOuter {
  appInfo: AppInfo
  appSettings: AppSettings
}

export interface AppInfo {
  appName: string
  bundleIdentifier: string
  detailInfo: DetailInfo
  appVersion: string
  appChannel: string
  appIconBase64: string
}

export interface DetailInfo {
  'Device ID': string
  'Store region': string
  'Current region': string
  'User ID': string
}

export interface AppSettings {
  rtl: boolean
  account: Account
  country: Country
  theme: Theme
}

export interface Account {
  current: LoginAccount
  loginAccountList?: LoginAccount[]
}

export interface LoginAccount {
  customID: string
  nickname: string
  userID: string
}

export interface Country {
  current: string
}

export interface Theme {
  current: string
}
