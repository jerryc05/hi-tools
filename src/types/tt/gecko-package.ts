export interface GeckoPackageInfo {
  package: Package
}

interface Package {
  id: number
  version: number
  url: string
  channel: string
  md5: string
  zstdUrl: string
  zstdMD5: string
  zstdDecompressMD5: string
  zstdPkgByteSize: number
  targetAppVersion: string
  targetOs: number
  description: string
  issueStatus: number
  issueType: number
  issueValue: string
  issuePlan: number
  status: number
  createdAt: string
  updatedAt: string
  deploymentId: number
  candidatePackageId: number
  creator: string
  delIfDownloadFailed: number
  delOldPkgBeforeDownload: number
  needUnzip: number
  pkgSize: number
  pkgByteSize: number
  pkgLarkNoticeGroups: string
  businessType: number
  packageType: number
  configMark: number
  content: string
  contentType: number
  qrCodeScheme: string
  distributeRule: DistributeRule
  didList: string[]
  derivedStatus: number
  allowActions: number[]
  deploymentAk: string
  candidatePackage: CandidatePackage
  isPackageOnline: number
  region: string
  channelId: number
  buildId: string
  jobIndex: string
  apiVersion: string
  channelMetaID: number
  channelEnableMultiVerCDN: boolean
  deploymentMetaID: number
  deploymentName: string
  deploymentAccessKey: string
  deploymentType: number
  appId: number
  appName: string
  globalKey: string
  detailLink: string
  packageID: number
}

interface DistributeRule {
  envLaneList: EnvLaneList[]
}

interface EnvLaneList {
  type: number
  values: string[]
}

interface CandidatePackage {
  url: string
  scmVersion: string
  createdAt: string
  updatedAt: string
}
