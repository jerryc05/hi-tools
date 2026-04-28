/** biome-ignore-all lint/suspicious/noEmptyInterface: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
export interface Data {
  count: number
  pipelineRuns: PipelineRun[]
  blockingCount: number
  runningCount: number
}

export interface PipelineRun {
  pipelineId: string
  orcaId: string
  runId: string
  runName: string
  runSeq: string
  runStatus: number
  triggerInfo: TriggerInfo
  failType: number
  failReason: any
  allowRollback: boolean
  runRollback: any
  pipeline: Pipeline
  jobs: Job2[]
  assignmentIds: string[]
  artifactCount: number
  pipelineRunArtifacts: PipelineRunArtifact[]
  postTriggers: any[]
  runNotificationIds: any[]
  pipelineRunUrl: string
  templateId: string
  runParams: RunParams
  note: string
  createdAt: string
  createdBy: string
  startedAt: string
  updatedAt: string
  completedAt: string
  timeCostSec: string
  webhookEvents: any[]
  hiddenJobIds: string[]
}

export interface TriggerInfo {
  triggeredBy: string
  triggeredAt: string
  triggerType: number
  gitRepo: string
  gitBranch: string
  gitBranchUrl: string
  yamlFilename: string
  commitSha: string
  commitMessage: string
  commitUrl: string
  gitTag: string
  mrId: string
  mrUrl: string
  mrTitle: string
  mrStatus: number
  mrSourceBranch: string
  mrTargetBranch: string
}

export interface Pipeline {
  schemaVersion: string
  id: string
  name: Name
  desc: Desc
  exprSyntax: number
  stages: Stage[]
  concurrency: Concurrency
  env: Env2
  varPreference: number
  triggers: any[]
  notifications: Notification[]
  varGroup: any
  citedBy: CitedBy
  authorizations: Authorization[]
  tag: Tag
  lockInfos: any[]
  triggerGroup: any
  notificationGroup: any
  varOption: VarOption
  controlPanel: number
  expiredDays: string
  disableManualRun: boolean
}

export interface Name {
  value: string
  lang: string
  texts: Texts
}

export interface Texts {
  en: string
  zh: string
}

export interface Desc {
  value: string
  lang: string
  texts: Texts2
}

export interface Texts2 {}

export interface Stage {
  id: string
  name: Name2
  if: string
  jobs: Job[]
}

export interface Name2 {
  value: string
  lang: string
  texts: Texts3
}

export interface Texts3 {
  en: string
  zh: string
}

export interface Job {
  id: string
  name: Name3
  if: string
  ifSkip: string
  dependsOn: string[]
  extraIf: string
  manual: boolean
  uses: string
  inputs: Inputs
  outputs: any[]
  envs: any[]
  caches: Cach[]
  inputArtifacts: any[]
  runsOn: RunsOn
  env: Env
  steps: any[]
  services: any[]
  allowPush: boolean
  autoCheckout: boolean
  autoCache: boolean
  autoGitLfsCache: boolean
  autoGoModuleProxy: boolean
  supportTimeout: boolean
  timeout: number
  retry?: Retry
  onFailed: number
  onTimeout: number
  manualOperations: any
  onIgnored: number
  enablePipelineRollback: boolean
  notifications: any[]
  missingRequiredInputs: number
  runEnv: string
  disableOperations: any[]
  jobRunOperations: JobRunOperation[]
  jobRunOperationsUsed: string
}

export interface Name3 {
  value: string
  lang: string
  texts: Texts4
}

export interface Texts4 {
  en: string
  zh: string
}

export interface Inputs {
  adc2?: Adc2
  custom_fail_reason_enabled?: boolean
  custom_reasons_for_failure?: CustomReasonsForFailure
  custom_reject_button_enabled?: boolean
  custom_reject_note?: CustomRejectNote
  manually_select?: boolean
  no_rule_matched_policy?: string
  selector_fd3e?: SelectorFd3e
  init_empty_env_b862?: InitEmptyEnvB862
  d74f?: D74f
  selector_f2b2?: SelectorF2b2
  env_managers?: any[]
  env_name?: string
  env_type?: string
  feature_ids?: string
  init_empty_env_e2b4?: InitEmptyEnvE2b4
  init_empty_env_ae30?: InitEmptyEnvAe30
  init_empty_env_c370?: InitEmptyEnvC370
  __disable_forms_value__?: boolean
  compile_trigger_branch?: boolean
  rest_upgrade_policy?: string
  scm_configs?: ScmConfig[]
  channelId?: string
  channelName?: string
  channelSectedByName?: string
  customConfig?: string
  customDistributeRule?: string[]
  deploymentId?: string
  hostAppId?: string
  isPackageOnline?: string
  'magellan_bits_info-a1d58c'?: MagellanBitsInfoA1d58c
  main_scm_repo_name?: string
  region?: string
  resourcePath?: string
  targetAppVersion?: string
  targetOS?: string
  branch_name?: string
  repo_name?: string
  env?: string
  env_land?: string
  expire_time?: number
  i18nx_config_dir?: string
  view_suffix?: string
  auto_submit?: boolean
  code_repo_name?: string
  commit_hash?: string
  git_project_id?: string
  sync_params_type?: string
  train_id?: string
  desc?: string
  enable_reuse_version?: boolean
  'magellan_bits_info-df9e01'?: MagellanBitsInfoDf9e01
  pub_base?: string
  reuse_version?: string
  revision?: string
  scm_repo_name?: string
  scm_type?: string
  upgrade_policy?: string
  user_envs?: UserEnvs2
  version?: string
  version_of_package_to_be_compiled?: string
  'magellan_bits_info-a2e0ea'?: MagellanBitsInfoA2e0ea
  'magellan_bits_info-9c7d00'?: MagellanBitsInfo9c7d00
  channel_info?: string
  envLane?: string
  feature_list?: string
  group_id?: string
  issue_list?: string
  meego_id?: string
  package_info?: string
  scm_info?: string
  gecc_deploy_app?: string
  gecc_deploy_region?: string
  context_values?: string
}

export interface Adc2 {
  expr: string
  next: string
  next_jobs: string[]
  ruleIdxTip: string
  rule_idx: number
}

export interface CustomReasonsForFailure {
  texts: Texts5
}

export interface Texts5 {
  en: string
  zh: string
}

export interface CustomRejectNote {
  texts: Texts6
}

export interface Texts6 {
  en: string
  zh: string
}

export interface SelectorFd3e {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvB862 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface D74f {
  expr: string
  next: string
  next_jobs: string[]
  ruleIdxTip: string
  rule_idx: number
}

export interface SelectorF2b2 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvE2b4 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvAe30 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvC370 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface ScmConfig {
  compile_without_trigger_event: boolean
  desc: string
  merge_build_config_type: string
  pub_base: string
  revision: string
  scm_repo_name: string
  scm_type: string
  sync: string[]
  upgrade_policy: string
  use_cache: string
  user_envs: UserEnvs
  version: string
  version_of_package_to_be_compiled: string
}

export interface UserEnvs {
  CUSTOM_CHANNEL_NAME?: string
  CUSTOM_ENABLE_COVERAGE?: string
  CUSTOM_ENABLE_HUATUO?: string
  CUSTOM_GECC_BUILD_ID?: string
  CUSTOM_GECC_DEPLOY_APP?: string
  CUSTOM_GECC_DEPLOY_REGION?: string
  CUSTOM_GECC_I18N_CHECK?: string
  CUSTOM_IS_US_TTP?: string
  CUSTOM_PAGE: string
  CUSTOM_USE_EXCHANGE?: string
}

export interface MagellanBitsInfoA1d58c {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface MagellanBitsInfoDf9e01 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface UserEnvs2 {
  CUSTOM_ENABLE_COVERAGE: string
  CUSTOM_ENABLE_HUATUO: string
  CUSTOM_GECC_DEPLOY_APP: string
  CUSTOM_GECC_DEPLOY_REGION: string
  CUSTOM_IS_US_TTP: string
  CUSTOM_PAGE: string
  CUSTOM_USE_EXCHANGE: string
}

export interface MagellanBitsInfoA2e0ea {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface MagellanBitsInfo9c7d00 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface Cach {
  cacheStorageType: number
  key: string
  policy: number
  cacheAll: boolean
  paths: any[]
  pathInJson: string
  restoreKeys: any[]
  expiresIn: number
  prefix: string
  size: number
  updateSnapshot: string
  cloneIfBranchMiss: boolean
  gitClean: string
}

export interface RunsOn {
  engine: number
  resourceCombo: string
  bytenv: string
  resource: any
  labels: any[]
  cluster: string
  image: string
  workingDirectory: string
  useWarmupContainer: boolean
  os: number
  runtime: number
  arch: number
  volumeMounts: any[]
  setting?: Setting
  selectors: any[]
}

export interface Setting {
  labels: any[]
  tenant: string
  queueName: string
  priority: number
  xcodeVersion: string
}

export interface Env {}

export interface Retry {
  max: number
  interval: number
}

export interface JobRunOperation {
  supportOperation: number
  allowRoles: any[]
  allowUsernames: any[]
}

export interface Concurrency {
  max: number
  newRunFirst: boolean
  retryFailedRunStrongBlock: boolean
}

export interface Env2 {}

export interface Notification {
  when: When
  lark: any
  webhook: Webhook
  name: string
  type: number
  id: string
  templateNotificationId: string
  triggerType: number
}

export interface When {
  status: string[]
  timeout: number
}

export interface Webhook {
  actionType: number
  httpAction: HttpAction
  pipelineAction: any
}

export interface HttpAction {
  url: string
  method: string
  headers: Headers
  body: string
}

export interface Headers {
  'x-tt-env': string
}

export interface CitedBy {
  context: Context
  'context.build': ContextBuild
  'context.build.deployConfigBOEI18N': ContextBuildDeployConfigBoei18N
  'context.build.deployConfigEUTTP': ContextBuildDeployConfigEuttp
  'context.build.deployConfigUSTTP': ContextBuildDeployConfigUsttp
  'context.build.ppe_i18n_env_name': ContextBuildPpeI18nEnvName
  'context.build.rawResponse': ContextBuildRawResponse
  'context.build.splitDeployConfig': ContextBuildSplitDeployConfig
  'context.get_gecc_home_config_sg_a955': ContextGetGeccHomeConfigSgA955
  'context.get_gecc_home_config_sg_a955.jsonResult': ContextGetGeccHomeConfigSgA955JsonResult
  'context.get_gecc_repo_branch_info_fc0d': ContextGetGeccRepoBranchInfoFc0d
  'context.get_gecc_repo_branch_info_fc0d.commit_hash': ContextGetGeccRepoBranchInfoFc0dCommitHash
  'context.project': ContextProject
  'context.project.gecko_push': ContextProjectGeckoPush
  'context.selector-e94f5b': ContextSelectorE94f5b
  'context.selector-e94f5b.selected_rule': ContextSelectorE94f5bSelectedRule
  'context.selector_a9fb': ContextSelectorA9fb
  'context.selector_a9fb.selected_rule': ContextSelectorA9fbSelectedRule
  'context.selector_b599': ContextSelectorB599
  'context.selector_b599.selected_rule': ContextSelectorB599SelectedRule
  'context.selector_b85f': ContextSelectorB85f
  'context.selector_b85f.selected_rule': ContextSelectorB85fSelectedRule
  'context.selector_c7fb': ContextSelectorC7fb
  'context.selector_c7fb.selected_rule': ContextSelectorC7fbSelectedRule
  'context.selector_f2b2': ContextSelectorF2b2
  'context.selector_f2b2.selected_rule': ContextSelectorF2b2SelectedRule
  'context.selector_f4be': ContextSelectorF4be
  'context.selector_f4be.selected_rule': ContextSelectorF4beSelectedRule
  'context.selector_fd3e': ContextSelectorFd3e
  'context.selector_fd3e.selected_rule': ContextSelectorFd3eSelectedRule
  'context.tiktok_gecko_create_package-3596e9': ContextTiktokGeckoCreatePackage3596e9
  'context.tiktok_gecko_create_package-3596e9.GECKO_packages': ContextTiktokGeckoCreatePackage3596e9GeckoPackages
  'context.tiktok_gecko_create_package-3596e9.scmBuildResult': ContextTiktokGeckoCreatePackage3596e9ScmBuildResult
  'context.tiktok_gecko_create_package-a2b0c3': ContextTiktokGeckoCreatePackageA2b0c3
  'context.tiktok_gecko_create_package-a2b0c3.GECKO_packages': ContextTiktokGeckoCreatePackageA2b0c3GeckoPackages
  'context.tiktok_gecko_create_package-a2b0c3.scmBuildResult': ContextTiktokGeckoCreatePackageA2b0c3ScmBuildResult
  'context.tiktok_gecko_create_package-a58828': ContextTiktokGeckoCreatePackageA58828
  'context.tiktok_gecko_create_package-a58828.GECKO_packages': ContextTiktokGeckoCreatePackageA58828GeckoPackages
  'context.tiktok_gecko_create_package-a58828.scmBuildResult': ContextTiktokGeckoCreatePackageA58828ScmBuildResult
  'context.tiktok_gecko_create_package-be3956': ContextTiktokGeckoCreatePackageBe3956
  'context.tiktok_gecko_create_package-be3956.GECKO_packages': ContextTiktokGeckoCreatePackageBe3956GeckoPackages
  'context.tiktok_gecko_create_package-be3956.scmBuildResult': ContextTiktokGeckoCreatePackageBe3956ScmBuildResult
  'context.tiktok_gecko_create_package-f70525': ContextTiktokGeckoCreatePackageF70525
  'context.tiktok_gecko_create_package-f70525.GECKO_packages': ContextTiktokGeckoCreatePackageF70525GeckoPackages
  'context.tiktok_gecko_create_package-f70525.scmBuildResult': ContextTiktokGeckoCreatePackageF70525ScmBuildResult
  'context.tiktok_gecko_create_package_bc8d': ContextTiktokGeckoCreatePackageBc8d
  'context.tiktok_gecko_create_package_bc8d.GECKO_packages': ContextTiktokGeckoCreatePackageBc8dGeckoPackages
  'context.tiktok_gecko_create_package_bc8d.scmBuildResult': ContextTiktokGeckoCreatePackageBc8dScmBuildResult
  'context.tiktok_gecko_create_package_cfe9': ContextTiktokGeckoCreatePackageCfe9
  'context.tiktok_gecko_create_package_cfe9.GECKO_packages': ContextTiktokGeckoCreatePackageCfe9GeckoPackages
  'context.tiktok_gecko_create_package_cfe9.scmBuildResult': ContextTiktokGeckoCreatePackageCfe9ScmBuildResult
  'context.tiktok_gecko_create_package_d009': ContextTiktokGeckoCreatePackageD009
  'context.tiktok_gecko_create_package_d009.GECKO_packages': ContextTiktokGeckoCreatePackageD009GeckoPackages
  'context.tiktok_gecko_create_package_d009.scmBuildResult': ContextTiktokGeckoCreatePackageD009ScmBuildResult
  'context.tiktok_gecko_create_package_e418': ContextTiktokGeckoCreatePackageE418
  'context.tiktok_gecko_create_package_e418.GECKO_packages': ContextTiktokGeckoCreatePackageE418GeckoPackages
  'context.tiktok_gecko_create_package_e418.scmBuildResult': ContextTiktokGeckoCreatePackageE418ScmBuildResult
  'context.tiktok_gecko_create_package_e738': ContextTiktokGeckoCreatePackageE738
  'context.tiktok_gecko_create_package_e738.GECKO_packages': ContextTiktokGeckoCreatePackageE738GeckoPackages
  'context.tiktok_gecko_create_package_e738.scmBuildResult': ContextTiktokGeckoCreatePackageE738ScmBuildResult
  'context.tiktok_gecko_create_package_f609': ContextTiktokGeckoCreatePackageF609
  'context.tiktok_gecko_create_package_f609.GECKO_packages': ContextTiktokGeckoCreatePackageF609GeckoPackages
  'context.tiktok_gecko_create_package_f609.scmBuildResult': ContextTiktokGeckoCreatePackageF609ScmBuildResult
  'context.tiktok_gecko_create_package_f812': ContextTiktokGeckoCreatePackageF812
  'context.tiktok_gecko_create_package_f812.GECKO_packages': ContextTiktokGeckoCreatePackageF812GeckoPackages
  'context.tiktok_gecko_create_package_f812.scmBuildResult': ContextTiktokGeckoCreatePackageF812ScmBuildResult
  custom: Custom
  'custom.compile_type': CustomCompileType
  'custom.enable_coverage': CustomEnableCoverage
  'custom.enable_huatuo': CustomEnableHuatuo
  'custom.gecc_deploy_app': CustomGeccDeployApp
  'custom.gecc_deploy_region': CustomGeccDeployRegion
  'custom.promotion_pia_page': CustomPromotionPiaPage
  'custom.use_exchange': CustomUseExchange
  default: Default
  get_key: GetKey
  join: Join
  len: Len
  list_expand: ListExpand
  safe_json_loads: SafeJsonLoads
  string: String
  succeeded: Succeeded
  sys: Sys
  'sys.development_task': SysDevelopmentTask
  'sys.development_task.boe_env_name': SysDevelopmentTaskBoeEnvName
  'sys.development_task.development_task_id': SysDevelopmentTaskDevelopmentTaskId
  'sys.development_task.feature_ids': SysDevelopmentTaskFeatureIds
  'sys.development_task.main_git_repo_id': SysDevelopmentTaskMainGitRepoId
  'sys.development_task.main_git_repo_name': SysDevelopmentTaskMainGitRepoName
  'sys.development_task.main_repo_feature_branch': SysDevelopmentTaskMainRepoFeatureBranch
  'sys.development_task.main_scm_repo_name': SysDevelopmentTaskMainScmRepoName
  'sys.development_task.ppe_i18n_env_name': SysDevelopmentTaskPpeI18nEnvName
}

export interface Context {
  atomNames: AtomName[]
}

export interface AtomName {
  value: string
  lang: string
  texts: Texts7
}

export interface Texts7 {
  en: string
  zh: string
}

export interface ContextBuild {
  atomNames: AtomName2[]
}

export interface AtomName2 {
  value: string
  lang: string
  texts: Texts8
}

export interface Texts8 {
  en: string
  zh: string
}

export interface ContextBuildDeployConfigBoei18N {
  atomNames: AtomName3[]
}

export interface AtomName3 {
  value: string
  lang: string
  texts: Texts9
}

export interface Texts9 {
  en: string
  zh: string
}

export interface ContextBuildDeployConfigEuttp {
  atomNames: AtomName4[]
}

export interface AtomName4 {
  value: string
  lang: string
  texts: Texts10
}

export interface Texts10 {
  en: string
  zh: string
}

export interface ContextBuildDeployConfigUsttp {
  atomNames: AtomName5[]
}

export interface AtomName5 {
  value: string
  lang: string
  texts: Texts11
}

export interface Texts11 {
  en: string
  zh: string
}

export interface ContextBuildPpeI18nEnvName {
  atomNames: AtomName6[]
}

export interface AtomName6 {
  value: string
  lang: string
  texts: Texts12
}

export interface Texts12 {
  en: string
  zh: string
}

export interface ContextBuildRawResponse {
  atomNames: AtomName7[]
}

export interface AtomName7 {
  value: string
  lang: string
  texts: Texts13
}

export interface Texts13 {
  en: string
  zh: string
}

export interface ContextBuildSplitDeployConfig {
  atomNames: AtomName8[]
}

export interface AtomName8 {
  value: string
  lang: string
  texts: Texts14
}

export interface Texts14 {
  en: string
  zh: string
}

export interface ContextGetGeccHomeConfigSgA955 {
  atomNames: AtomName9[]
}

export interface AtomName9 {
  value: string
  lang: string
  texts: Texts15
}

export interface Texts15 {
  en: string
  zh: string
}

export interface ContextGetGeccHomeConfigSgA955JsonResult {
  atomNames: AtomName10[]
}

export interface AtomName10 {
  value: string
  lang: string
  texts: Texts16
}

export interface Texts16 {
  en: string
  zh: string
}

export interface ContextGetGeccRepoBranchInfoFc0d {
  atomNames: AtomName11[]
}

export interface AtomName11 {
  value: string
  lang: string
  texts: Texts17
}

export interface Texts17 {
  en: string
  zh: string
}

export interface ContextGetGeccRepoBranchInfoFc0dCommitHash {
  atomNames: AtomName12[]
}

export interface AtomName12 {
  value: string
  lang: string
  texts: Texts18
}

export interface Texts18 {
  en: string
  zh: string
}

export interface ContextProject {
  atomNames: AtomName13[]
}

export interface AtomName13 {
  value: string
  lang: string
  texts: Texts19
}

export interface Texts19 {
  en: string
  zh: string
}

export interface ContextProjectGeckoPush {
  atomNames: AtomName14[]
}

export interface AtomName14 {
  value: string
  lang: string
  texts: Texts20
}

export interface Texts20 {
  en: string
  zh: string
}

export interface ContextSelectorE94f5b {
  atomNames: AtomName15[]
}

export interface AtomName15 {
  value: string
  lang: string
  texts: Texts21
}

export interface Texts21 {
  en: string
  zh: string
}

export interface ContextSelectorE94f5bSelectedRule {
  atomNames: AtomName16[]
}

export interface AtomName16 {
  value: string
  lang: string
  texts: Texts22
}

export interface Texts22 {
  en: string
  zh: string
}

export interface ContextSelectorA9fb {
  atomNames: AtomName17[]
}

export interface AtomName17 {
  value: string
  lang: string
  texts: Texts23
}

export interface Texts23 {
  en: string
  zh: string
}

export interface ContextSelectorA9fbSelectedRule {
  atomNames: AtomName18[]
}

export interface AtomName18 {
  value: string
  lang: string
  texts: Texts24
}

export interface Texts24 {
  en: string
  zh: string
}

export interface ContextSelectorB599 {
  atomNames: AtomName19[]
}

export interface AtomName19 {
  value: string
  lang: string
  texts: Texts25
}

export interface Texts25 {
  en: string
  zh: string
}

export interface ContextSelectorB599SelectedRule {
  atomNames: AtomName20[]
}

export interface AtomName20 {
  value: string
  lang: string
  texts: Texts26
}

export interface Texts26 {
  en: string
  zh: string
}

export interface ContextSelectorB85f {
  atomNames: AtomName21[]
}

export interface AtomName21 {
  value: string
  lang: string
  texts: Texts27
}

export interface Texts27 {
  en: string
  zh: string
}

export interface ContextSelectorB85fSelectedRule {
  atomNames: AtomName22[]
}

export interface AtomName22 {
  value: string
  lang: string
  texts: Texts28
}

export interface Texts28 {
  en: string
  zh: string
}

export interface ContextSelectorC7fb {
  atomNames: AtomName23[]
}

export interface AtomName23 {
  value: string
  lang: string
  texts: Texts29
}

export interface Texts29 {
  en: string
  zh: string
}

export interface ContextSelectorC7fbSelectedRule {
  atomNames: AtomName24[]
}

export interface AtomName24 {
  value: string
  lang: string
  texts: Texts30
}

export interface Texts30 {
  en: string
  zh: string
}

export interface ContextSelectorF2b2 {
  atomNames: AtomName25[]
}

export interface AtomName25 {
  value: string
  lang: string
  texts: Texts31
}

export interface Texts31 {
  en: string
  zh: string
}

export interface ContextSelectorF2b2SelectedRule {
  atomNames: AtomName26[]
}

export interface AtomName26 {
  value: string
  lang: string
  texts: Texts32
}

export interface Texts32 {
  en: string
  zh: string
}

export interface ContextSelectorF4be {
  atomNames: AtomName27[]
}

export interface AtomName27 {
  value: string
  lang: string
  texts: Texts33
}

export interface Texts33 {
  en: string
  zh: string
}

export interface ContextSelectorF4beSelectedRule {
  atomNames: AtomName28[]
}

export interface AtomName28 {
  value: string
  lang: string
  texts: Texts34
}

export interface Texts34 {
  en: string
  zh: string
}

export interface ContextSelectorFd3e {
  atomNames: AtomName29[]
}

export interface AtomName29 {
  value: string
  lang: string
  texts: Texts35
}

export interface Texts35 {
  en: string
  zh: string
}

export interface ContextSelectorFd3eSelectedRule {
  atomNames: AtomName30[]
}

export interface AtomName30 {
  value: string
  lang: string
  texts: Texts36
}

export interface Texts36 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackage3596e9 {
  atomNames: AtomName31[]
}

export interface AtomName31 {
  value: string
  lang: string
  texts: Texts37
}

export interface Texts37 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackage3596e9GeckoPackages {
  atomNames: AtomName32[]
}

export interface AtomName32 {
  value: string
  lang: string
  texts: Texts38
}

export interface Texts38 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackage3596e9ScmBuildResult {
  atomNames: AtomName33[]
}

export interface AtomName33 {
  value: string
  lang: string
  texts: Texts39
}

export interface Texts39 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageA2b0c3 {
  atomNames: AtomName34[]
}

export interface AtomName34 {
  value: string
  lang: string
  texts: Texts40
}

export interface Texts40 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageA2b0c3GeckoPackages {
  atomNames: AtomName35[]
}

export interface AtomName35 {
  value: string
  lang: string
  texts: Texts41
}

export interface Texts41 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageA2b0c3ScmBuildResult {
  atomNames: AtomName36[]
}

export interface AtomName36 {
  value: string
  lang: string
  texts: Texts42
}

export interface Texts42 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageA58828 {
  atomNames: AtomName37[]
}

export interface AtomName37 {
  value: string
  lang: string
  texts: Texts43
}

export interface Texts43 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageA58828GeckoPackages {
  atomNames: AtomName38[]
}

export interface AtomName38 {
  value: string
  lang: string
  texts: Texts44
}

export interface Texts44 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageA58828ScmBuildResult {
  atomNames: AtomName39[]
}

export interface AtomName39 {
  value: string
  lang: string
  texts: Texts45
}

export interface Texts45 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageBe3956 {
  atomNames: AtomName40[]
}

export interface AtomName40 {
  value: string
  lang: string
  texts: Texts46
}

export interface Texts46 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageBe3956GeckoPackages {
  atomNames: AtomName41[]
}

export interface AtomName41 {
  value: string
  lang: string
  texts: Texts47
}

export interface Texts47 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageBe3956ScmBuildResult {
  atomNames: AtomName42[]
}

export interface AtomName42 {
  value: string
  lang: string
  texts: Texts48
}

export interface Texts48 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageF70525 {
  atomNames: AtomName43[]
}

export interface AtomName43 {
  value: string
  lang: string
  texts: Texts49
}

export interface Texts49 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageF70525GeckoPackages {
  atomNames: AtomName44[]
}

export interface AtomName44 {
  value: string
  lang: string
  texts: Texts50
}

export interface Texts50 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageF70525ScmBuildResult {
  atomNames: AtomName45[]
}

export interface AtomName45 {
  value: string
  lang: string
  texts: Texts51
}

export interface Texts51 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageBc8d {
  atomNames: AtomName46[]
}

export interface AtomName46 {
  value: string
  lang: string
  texts: Texts52
}

export interface Texts52 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageBc8dGeckoPackages {
  atomNames: AtomName47[]
}

export interface AtomName47 {
  value: string
  lang: string
  texts: Texts53
}

export interface Texts53 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageBc8dScmBuildResult {
  atomNames: AtomName48[]
}

export interface AtomName48 {
  value: string
  lang: string
  texts: Texts54
}

export interface Texts54 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageCfe9 {
  atomNames: AtomName49[]
}

export interface AtomName49 {
  value: string
  lang: string
  texts: Texts55
}

export interface Texts55 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageCfe9GeckoPackages {
  atomNames: AtomName50[]
}

export interface AtomName50 {
  value: string
  lang: string
  texts: Texts56
}

export interface Texts56 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageCfe9ScmBuildResult {
  atomNames: AtomName51[]
}

export interface AtomName51 {
  value: string
  lang: string
  texts: Texts57
}

export interface Texts57 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageD009 {
  atomNames: AtomName52[]
}

export interface AtomName52 {
  value: string
  lang: string
  texts: Texts58
}

export interface Texts58 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageD009GeckoPackages {
  atomNames: AtomName53[]
}

export interface AtomName53 {
  value: string
  lang: string
  texts: Texts59
}

export interface Texts59 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageD009ScmBuildResult {
  atomNames: AtomName54[]
}

export interface AtomName54 {
  value: string
  lang: string
  texts: Texts60
}

export interface Texts60 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageE418 {
  atomNames: AtomName55[]
}

export interface AtomName55 {
  value: string
  lang: string
  texts: Texts61
}

export interface Texts61 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageE418GeckoPackages {
  atomNames: AtomName56[]
}

export interface AtomName56 {
  value: string
  lang: string
  texts: Texts62
}

export interface Texts62 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageE418ScmBuildResult {
  atomNames: AtomName57[]
}

export interface AtomName57 {
  value: string
  lang: string
  texts: Texts63
}

export interface Texts63 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageE738 {
  atomNames: AtomName58[]
}

export interface AtomName58 {
  value: string
  lang: string
  texts: Texts64
}

export interface Texts64 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageE738GeckoPackages {
  atomNames: AtomName59[]
}

export interface AtomName59 {
  value: string
  lang: string
  texts: Texts65
}

export interface Texts65 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageE738ScmBuildResult {
  atomNames: AtomName60[]
}

export interface AtomName60 {
  value: string
  lang: string
  texts: Texts66
}

export interface Texts66 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageF609 {
  atomNames: AtomName61[]
}

export interface AtomName61 {
  value: string
  lang: string
  texts: Texts67
}

export interface Texts67 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageF609GeckoPackages {
  atomNames: AtomName62[]
}

export interface AtomName62 {
  value: string
  lang: string
  texts: Texts68
}

export interface Texts68 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageF609ScmBuildResult {
  atomNames: AtomName63[]
}

export interface AtomName63 {
  value: string
  lang: string
  texts: Texts69
}

export interface Texts69 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageF812 {
  atomNames: AtomName64[]
}

export interface AtomName64 {
  value: string
  lang: string
  texts: Texts70
}

export interface Texts70 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageF812GeckoPackages {
  atomNames: AtomName65[]
}

export interface AtomName65 {
  value: string
  lang: string
  texts: Texts71
}

export interface Texts71 {
  en: string
  zh: string
}

export interface ContextTiktokGeckoCreatePackageF812ScmBuildResult {
  atomNames: AtomName66[]
}

export interface AtomName66 {
  value: string
  lang: string
  texts: Texts72
}

export interface Texts72 {
  en: string
  zh: string
}

export interface Custom {
  atomNames: AtomName67[]
}

export interface AtomName67 {
  value: string
  lang: string
  texts: Texts73
}

export interface Texts73 {
  en: string
  zh: string
}

export interface CustomCompileType {
  atomNames: AtomName68[]
}

export interface AtomName68 {
  value: string
  lang: string
  texts: Texts74
}

export interface Texts74 {
  en: string
  zh: string
}

export interface CustomEnableCoverage {
  atomNames: AtomName69[]
}

export interface AtomName69 {
  value: string
  lang: string
  texts: Texts75
}

export interface Texts75 {
  en: string
  zh: string
}

export interface CustomEnableHuatuo {
  atomNames: AtomName70[]
}

export interface AtomName70 {
  value: string
  lang: string
  texts: Texts76
}

export interface Texts76 {
  en: string
  zh: string
}

export interface CustomGeccDeployApp {
  atomNames: AtomName71[]
}

export interface AtomName71 {
  value: string
  lang: string
  texts: Texts77
}

export interface Texts77 {
  en: string
  zh: string
}

export interface CustomGeccDeployRegion {
  atomNames: AtomName72[]
}

export interface AtomName72 {
  value: string
  lang: string
  texts: Texts78
}

export interface Texts78 {
  en: string
  zh: string
}

export interface CustomPromotionPiaPage {
  atomNames: AtomName73[]
}

export interface AtomName73 {
  value: string
  lang: string
  texts: Texts79
}

export interface Texts79 {
  en: string
  zh: string
}

export interface CustomUseExchange {
  atomNames: AtomName74[]
}

export interface AtomName74 {
  value: string
  lang: string
  texts: Texts80
}

export interface Texts80 {
  en: string
  zh: string
}

export interface Default {
  atomNames: AtomName75[]
}

export interface AtomName75 {
  value: string
  lang: string
  texts: Texts81
}

export interface Texts81 {
  en: string
  zh: string
}

export interface GetKey {
  atomNames: AtomName76[]
}

export interface AtomName76 {
  value: string
  lang: string
  texts: Texts82
}

export interface Texts82 {
  en: string
  zh: string
}

export interface Join {
  atomNames: AtomName77[]
}

export interface AtomName77 {
  value: string
  lang: string
  texts: Texts83
}

export interface Texts83 {
  en: string
  zh: string
}

export interface Len {
  atomNames: AtomName78[]
}

export interface AtomName78 {
  value: string
  lang: string
  texts: Texts84
}

export interface Texts84 {
  en: string
  zh: string
}

export interface ListExpand {
  atomNames: AtomName79[]
}

export interface AtomName79 {
  value: string
  lang: string
  texts: Texts85
}

export interface Texts85 {
  en: string
  zh: string
}

export interface SafeJsonLoads {
  atomNames: AtomName80[]
}

export interface AtomName80 {
  value: string
  lang: string
  texts: Texts86
}

export interface Texts86 {
  en: string
  zh: string
}

export interface String {
  atomNames: AtomName81[]
}

export interface AtomName81 {
  value: string
  lang: string
  texts: Texts87
}

export interface Texts87 {
  en: string
  zh: string
}

export interface Succeeded {
  atomNames: AtomName82[]
}

export interface AtomName82 {
  value: string
  lang: string
  texts: Texts88
}

export interface Texts88 {
  en: string
  zh: string
}

export interface Sys {
  atomNames: AtomName83[]
}

export interface AtomName83 {
  value: string
  lang: string
  texts: Texts89
}

export interface Texts89 {
  en: string
  zh: string
}

export interface SysDevelopmentTask {
  atomNames: AtomName84[]
}

export interface AtomName84 {
  value: string
  lang: string
  texts: Texts90
}

export interface Texts90 {
  en: string
  zh: string
}

export interface SysDevelopmentTaskBoeEnvName {
  atomNames: AtomName85[]
}

export interface AtomName85 {
  value: string
  lang: string
  texts: Texts91
}

export interface Texts91 {
  en: string
  zh: string
}

export interface SysDevelopmentTaskDevelopmentTaskId {
  atomNames: AtomName86[]
}

export interface AtomName86 {
  value: string
  lang: string
  texts: Texts92
}

export interface Texts92 {
  en: string
  zh: string
}

export interface SysDevelopmentTaskFeatureIds {
  atomNames: AtomName87[]
}

export interface AtomName87 {
  value: string
  lang: string
  texts: Texts93
}

export interface Texts93 {
  en: string
  zh: string
}

export interface SysDevelopmentTaskMainGitRepoId {
  atomNames: AtomName88[]
}

export interface AtomName88 {
  value: string
  lang: string
  texts: Texts94
}

export interface Texts94 {
  en: string
  zh: string
}

export interface SysDevelopmentTaskMainGitRepoName {
  atomNames: AtomName89[]
}

export interface AtomName89 {
  value: string
  lang: string
  texts: Texts95
}

export interface Texts95 {
  en: string
  zh: string
}

export interface SysDevelopmentTaskMainRepoFeatureBranch {
  atomNames: AtomName90[]
}

export interface AtomName90 {
  value: string
  lang: string
  texts: Texts96
}

export interface Texts96 {
  en: string
  zh: string
}

export interface SysDevelopmentTaskMainScmRepoName {
  atomNames: AtomName91[]
}

export interface AtomName91 {
  value: string
  lang: string
  texts: Texts97
}

export interface Texts97 {
  en: string
  zh: string
}

export interface SysDevelopmentTaskPpeI18nEnvName {
  atomNames: AtomName92[]
}

export interface AtomName92 {
  value: string
  lang: string
  texts: Texts98
}

export interface Texts98 {
  en: string
  zh: string
}

export interface Authorization {
  roleName: string
  principals: string[]
}

export interface Tag {
  psm: string
  customs: any[]
  envs: any[]
  regions: any[]
  resources: any[]
}

export interface VarOption {
  allowCustomVarsInBuildContext: boolean
}

export interface Job2 {
  jobId: string
  jobRunId: string
  jobName: string
  jobNameI18n: JobNameI18n
  jobAtom: JobAtom
  jobType: number
  jobStatus: number
  jobRunSeq: number
  startedAt: string
  completedAt: string
  createdAt: string
  updatedAt: string
  engineScheduleAt: string
  engineRunAt: string
  timeCostSec: string
  failType: number
  failReason: any
  onFailed: number
  operations: any[]
  atomErrType: number
  stepInfos: any[]
  jobRunArtifacts: any[]
  jobRescheduledSeq: number
  reruns: any[]
  rescheduledReruns: any[]
  thisTriedInfo: any
  hasOutput: boolean
  hasLog: boolean
  hasTroubleshootRecords: boolean
  tag: any
  pipelineRunId: string
  if: boolean
  ifSkip: boolean
  notifications: any[]
  controlPanel: number
  clusterLabel: string
  agentLabel: string
  manual: boolean
  waitingTimes: any[]
}

export interface JobNameI18n {
  value: string
  lang: string
  texts: Texts99
}

export interface Texts99 {
  en: string
  zh: string
}

export interface JobAtom {
  atomId: string
  uniqueId: string
  version: string
  atomType: number
  actions: any[]
  views: View[]
  inputs?: Inputs2
  rawInputs: RawInputs
  output?: Output
  runEnv: string
}

export interface View {
  type: string
  value: any
  visibility?: Visibility
  _key?: string
}

export interface Visibility {
  platforms?: string[]
}

export interface Inputs2 {
  __state_key__: string
  channel_info?: ChannelInfo
  envLane?: string
  feature_list?: string[]
  group_id?: string
  issue_list?: string
  meego_id?: string
  package_info?: PackageInfo[]
  scm_info?: ScmInfo
  'magellan_bits_info-9c7d00'?: MagellanBitsInfo9c7d002
  'magellan_bits_info-a1d58c'?: MagellanBitsInfoA1d58c2
  channelId?: string
  channelName?: string
  channelSectedByName?: string
  customConfig?: string
  customDistributeRule?: any[]
  deploymentId?: string
  hostAppId?: string
  isPackageOnline?: string
  main_scm_repo_name?: string
  region?: string
  resourcePath?: string
  targetAppVersion?: string
  targetOS?: string
  'magellan_bits_info-a2e0ea'?: MagellanBitsInfoA2e0ea2
  desc?: string
  enable_reuse_version?: boolean
  'magellan_bits_info-df9e01'?: MagellanBitsInfoDf9e012
  pub_base?: string
  reuse_version?: string
  revision?: string
  scm_repo_name?: string
  scm_type?: string
  upgrade_policy?: string
  user_envs?: UserEnvs3
  version?: string
  version_of_package_to_be_compiled?: string
  auto_submit?: boolean
  code_repo_name?: string
  commit_hash?: string
  git_project_id?: string
  sync_params_type?: string
  train_id?: string
  env?: string
  env_land?: string
  expire_time?: number
  i18nx_config_dir?: string
  view_suffix?: string
  branch_name?: string
  repo_name?: string
  __disable_forms_value__?: boolean
  compile_trigger_branch?: boolean
  rest_upgrade_policy?: string
  scm_configs?: ScmConfig2[]
  env_name?: string
  env_type?: string
  feature_ids?: string
  custom_fail_reason_enabled?: boolean
  custom_reasons_for_failure?: CustomReasonsForFailure2
  custom_reject_button_enabled?: boolean
  custom_reject_note?: CustomRejectNote2
  init_empty_env_ae30?: InitEmptyEnvAe302
  manually_select?: boolean
  no_rule_matched_policy?: string
  init_empty_env_e2b4?: InitEmptyEnvE2b42
  gecc_deploy_app?: string
  gecc_deploy_region?: string
  context_values?: string
  adc2?: Adc22
  selector_fd3e?: SelectorFd3e2
  init_empty_env_b862?: InitEmptyEnvB8622
  d74f?: D74f2
}

export interface ChannelInfo {
  allowActions: number[]
  apiVersion: string
  appId: number
  appName: string
  buildId: string
  businessType: number
  candidatePackage: CandidatePackage
  candidatePackageId: number
  channel: string
  channelEnableMultiVerCDN: boolean
  channelId: number
  channelMetaID: number
  configMark: number
  content: string
  contentType: number
  createdAt: string
  creator: string
  delIfDownloadFailed: number
  delOldPkgBeforeDownload: number
  deploymentAccessKey: string
  deploymentAk: string
  deploymentId: number
  deploymentMetaID: number
  deploymentName: string
  deploymentType: number
  derivedStatus: number
  description: string
  detailLink: string
  didList: string[]
  distributeRule: DistributeRule
  globalKey: string
  id: number
  isPackageOnline: number
  issuePlan: number
  issueStatus: number
  issueType: number
  issueValue: string
  jobIndex: string
  md5: string
  needUnzip: number
  packageType: number
  pkgByteSize: number
  pkgLarkNoticeGroups: string
  pkgSize: number
  pocmCheckResult?: PocmCheckResult
  qrCodeScheme: string
  region: string
  status: number
  targetAppVersion: string
  targetOs: number
  updatedAt: string
  url: string
  version: number
  zstdDecompressMD5: string
  zstdMD5: string
  zstdPkgByteSize: number
  zstdUrl: string
  sdlcCheckResult?: SdlcCheckResult
}

export interface CandidatePackage {
  accessKey: string
  buildRepoBranch: string
  buildRepoName: string
  businessType: number
  channel: string
  commitId: string
  configMark: number
  createdAt: string
  description: string
  disableOffline: number
  id: string
  md5: string
  packageType: number
  pkgByteSize: number
  pkgSize: number
  scmVersion: string
  targetAppVersion: string
  targetOs: number
  taskUuid: string
  updatedAt: string
  url: string
  used: number
}

export interface DistributeRule {
  envLaneList: EnvLaneList[]
}

export interface EnvLaneList {
  type: number
  values: string[]
}

export interface PocmCheckResult {
  auditDetail: any[]
  status: number
}

export interface SdlcCheckResult {
  auditDetail: AuditDetail[]
  status: string
}

export interface AuditDetail {
  description: string
  msg: string
  name: string
  status: string
}

export interface PackageInfo {
  allowActions: number[]
  apiVersion: string
  appId: number
  appName: string
  buildId: string
  businessType: number
  candidatePackage: CandidatePackage2
  candidatePackageId: number
  channel: string
  channelEnableMultiVerCDN: boolean
  channelId: number
  channelMetaID: number
  configMark: number
  content: string
  contentType: number
  createdAt: string
  creator: string
  delIfDownloadFailed: number
  delOldPkgBeforeDownload: number
  deploymentAccessKey: string
  deploymentAk: string
  deploymentId: number
  deploymentMetaID: number
  deploymentName: string
  deploymentType: number
  derivedStatus: number
  description: string
  detailLink: string
  didList: string[]
  distributeRule: DistributeRule2
  globalKey: string
  id: number
  isPackageOnline: number
  issuePlan: number
  issueStatus: number
  issueType: number
  issueValue: string
  jobIndex: string
  md5: string
  needUnzip: number
  packageType: number
  pkgByteSize: number
  pkgLarkNoticeGroups: string
  pkgSize: number
  pocmCheckResult?: PocmCheckResult2
  qrCodeScheme: string
  region: string
  status: number
  targetAppVersion: string
  targetOs: number
  updatedAt: string
  url: string
  version: number
  zstdDecompressMD5: string
  zstdMD5: string
  zstdPkgByteSize: number
  zstdUrl: string
  sdlcCheckResult?: SdlcCheckResult2
}

export interface CandidatePackage2 {
  accessKey: string
  buildRepoBranch: string
  buildRepoName: string
  businessType: number
  channel: string
  commitId: string
  configMark: number
  createdAt: string
  description: string
  disableOffline: number
  id: string
  md5: string
  packageType: number
  pkgByteSize: number
  pkgSize: number
  scmVersion: string
  targetAppVersion: string
  targetOs: number
  taskUuid: string
  updatedAt: string
  url: string
  used: number
}

export interface DistributeRule2 {
  envLaneList: EnvLaneList2[]
}

export interface EnvLaneList2 {
  type: number
  values: string[]
}

export interface PocmCheckResult2 {
  auditDetail: any[]
  status: number
}

export interface SdlcCheckResult2 {
  auditDetail: AuditDetail2[]
  status: string
}

export interface AuditDetail2 {
  description: string
  msg: string
  name: string
  status: string
}

export interface ScmInfo {
  base_commit_hash: string
  branch_name: string
  commit_url: string
  create_date: string
  desc: string
  id: number
  product_size: string
  repo_name: string
  tar_url: string
  type: string
  version: string
}

export interface MagellanBitsInfo9c7d002 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface MagellanBitsInfoA1d58c2 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface MagellanBitsInfoA2e0ea2 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface MagellanBitsInfoDf9e012 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface UserEnvs3 {
  CUSTOM_ENABLE_COVERAGE: number
  CUSTOM_ENABLE_HUATUO: string
  CUSTOM_GECC_DEPLOY_APP: string
  CUSTOM_GECC_DEPLOY_REGION: string
  CUSTOM_IS_US_TTP: string
  CUSTOM_PAGE: string
  CUSTOM_USE_EXCHANGE: number
}

export interface ScmConfig2 {
  compile_without_trigger_event: boolean
  desc: string
  merge_build_config_type: string
  pub_base: string
  revision: string
  scm_repo_name: string
  scm_type: string
  sync: string[]
  upgrade_policy: string
  use_cache: string
  user_envs: UserEnvs4
  version: string
  version_of_package_to_be_compiled: string
}

export interface UserEnvs4 {
  CUSTOM_CHANNEL_NAME: string
  CUSTOM_ENABLE_COVERAGE: number
  CUSTOM_ENABLE_HUATUO: number
  CUSTOM_GECC_BUILD_ID: string
  CUSTOM_GECC_DEPLOY_APP: string
  CUSTOM_GECC_DEPLOY_REGION: string
  CUSTOM_GECC_I18N_CHECK: string
  CUSTOM_IS_US_TTP: string
  CUSTOM_PAGE: string
  CUSTOM_USE_EXCHANGE: number
}

export interface CustomReasonsForFailure2 {
  texts: Texts100
}

export interface Texts100 {
  en: string
  zh: string
}

export interface CustomRejectNote2 {
  texts: Texts101
}

export interface Texts101 {
  en: string
  zh: string
}

export interface InitEmptyEnvAe302 {
  expr: boolean
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvE2b42 {
  expr: boolean
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface Adc22 {
  expr: boolean
  next: string
  next_jobs: string[]
  ruleIdxTip: string
  rule_idx: number
}

export interface SelectorFd3e2 {
  expr: boolean
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvB8622 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface D74f2 {
  expr: string
  next: string
  next_jobs: string[]
  ruleIdxTip: string
  rule_idx: number
}

export interface RawInputs {
  __state_key__: string
  gecc_deploy_app?: string
  gecc_deploy_region?: string
  context_values?: string
  adc2?: Adc23
  custom_fail_reason_enabled?: boolean
  custom_reasons_for_failure?: CustomReasonsForFailure3
  custom_reject_button_enabled?: boolean
  custom_reject_note?: CustomRejectNote3
  manually_select?: boolean
  no_rule_matched_policy?: string
  selector_fd3e?: SelectorFd3e3
  init_empty_env_b862?: InitEmptyEnvB8623
  d74f?: D74f3
  selector_f2b2?: SelectorF2b22
  env_managers?: any[]
  env_name?: string
  env_type?: string
  feature_ids?: string
  init_empty_env_e2b4?: InitEmptyEnvE2b43
  init_empty_env_ae30?: InitEmptyEnvAe303
  init_empty_env_c370?: InitEmptyEnvC3702
  __disable_forms_value__?: boolean
  compile_trigger_branch?: boolean
  rest_upgrade_policy?: string
  scm_configs?: ScmConfig3[]
  channelId?: string
  channelName?: string
  channelSectedByName?: string
  customConfig?: string
  customDistributeRule?: string[]
  deploymentId?: string
  hostAppId?: string
  isPackageOnline?: string
  'magellan_bits_info-a1d58c'?: MagellanBitsInfoA1d58c3
  main_scm_repo_name?: string
  region?: string
  resourcePath?: string
  targetAppVersion?: string
  targetOS?: string
  branch_name?: string
  repo_name?: string
  env?: string
  env_land?: string
  expire_time?: number
  i18nx_config_dir?: string
  view_suffix?: string
  auto_submit?: boolean
  code_repo_name?: string
  commit_hash?: string
  git_project_id?: string
  sync_params_type?: string
  train_id?: string
  desc?: string
  enable_reuse_version?: boolean
  'magellan_bits_info-df9e01'?: MagellanBitsInfoDf9e013
  pub_base?: string
  reuse_version?: string
  revision?: string
  scm_repo_name?: string
  scm_type?: string
  upgrade_policy?: string
  user_envs?: UserEnvs6
  version?: string
  version_of_package_to_be_compiled?: string
  'magellan_bits_info-a2e0ea'?: MagellanBitsInfoA2e0ea3
  'magellan_bits_info-9c7d00'?: MagellanBitsInfo9c7d003
  channel_info?: string
  envLane?: string
  feature_list?: string
  group_id?: string
  issue_list?: string
  meego_id?: string
  package_info?: string
  scm_info?: string
}

export interface Adc23 {
  expr: string
  next: string
  next_jobs: string[]
  ruleIdxTip: string
  rule_idx: number
}

export interface CustomReasonsForFailure3 {
  texts: Texts102
}

export interface Texts102 {
  en: string
  zh: string
}

export interface CustomRejectNote3 {
  texts: Texts103
}

export interface Texts103 {
  en: string
  zh: string
}

export interface SelectorFd3e3 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvB8623 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface D74f3 {
  expr: string
  next: string
  next_jobs: string[]
  ruleIdxTip: string
  rule_idx: number
}

export interface SelectorF2b22 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvE2b43 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvAe303 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface InitEmptyEnvC3702 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
}

export interface ScmConfig3 {
  compile_without_trigger_event: boolean
  desc: string
  merge_build_config_type: string
  pub_base: string
  revision: string
  scm_repo_name: string
  scm_type: string
  sync: string[]
  upgrade_policy: string
  use_cache: string
  user_envs: UserEnvs5
  version: string
  version_of_package_to_be_compiled: string
}

export interface UserEnvs5 {
  CUSTOM_CHANNEL_NAME?: string
  CUSTOM_ENABLE_COVERAGE?: string
  CUSTOM_ENABLE_HUATUO?: string
  CUSTOM_GECC_BUILD_ID?: string
  CUSTOM_GECC_DEPLOY_APP?: string
  CUSTOM_GECC_DEPLOY_REGION?: string
  CUSTOM_GECC_I18N_CHECK?: string
  CUSTOM_IS_US_TTP?: string
  CUSTOM_PAGE: string
  CUSTOM_USE_EXCHANGE?: string
}

export interface MagellanBitsInfoA1d58c3 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface MagellanBitsInfoDf9e013 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface UserEnvs6 {
  CUSTOM_ENABLE_COVERAGE: string
  CUSTOM_ENABLE_HUATUO: string
  CUSTOM_GECC_DEPLOY_APP: string
  CUSTOM_GECC_DEPLOY_REGION: string
  CUSTOM_IS_US_TTP: string
  CUSTOM_PAGE: string
  CUSTOM_USE_EXCHANGE: string
}

export interface MagellanBitsInfoA2e0ea3 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface MagellanBitsInfo9c7d003 {
  expr: string
  next: string
  ruleIdxTip: string
  rule_idx: number
  text: string
}

export interface Output {
  current_time: string
  execute_user?: string
  message?: string
  service_trigger?: string
  GECKO_packages?: string
  buildId?: string
  display_params?: string
  jobId?: string
  jobIndex?: string
  logId?: string
  runEnv?: string
  startTime?: string
  GECKO_channelId?: string
  GECKO_isPackageOnline?: string
  GECKO_packageId?: string
  GECKO_packageInfo?: string
  GECKO_region?: string
  scmBuildResult: any
  code?: string
  commit_hash?: string
  context?: string
  create_user?: string
  data?: string
  desc?: string
  display_version_id?: string
  error?: string
  pub_base?: string
  region?: string
  repo_id?: string
  repo_name?: string
  repos?: string
  scm_info?: string
  scm_params?: string
  scm_repo_name?: string
  skip_version_check?: string
  state?: string
  state_aarch64?: string
  type?: string
  uniq_version_id?: string
  update_info?: string
  user_envs?: string
  version?: string
  log_id?: string
  artifactName?: string
  configs?: any[]
  originalTickets?: any[]
  scmOutputPath?: string
  tickets?: any[]
  username?: string
  viewConfigs?: any[]
  views?: any[]
  __artifact__?: Artifact[]
  base_commit_hash?: string
  notification_data?: NotificationData
  product_size?: string
  detail?: string
  envplatform_env_info?: string
  selected_rule?: string
  jsonResult?: string
  build_context?: string
  deployAppConfigNames?: string
  deployConfigBOEI18N?: string
  deployConfigEUTTP?: string
  deployConfigROW?: string
  deployConfigUSTTP?: string
  deployRegionLabels?: string
  enableDeployApp?: string
  enableRegionLabel?: string
  rawResponse?: string
  releaseNotif?: string
  splitDeployConfig?: string
  clear_store?: string
}

export interface Artifact {
  artifact_type: string
  extra_content: ExtraContent
  region: string
  repo_name: string
  version: string
}

export interface ExtraContent {
  branch: string
  pattern: string
  rest_upgrade_policy: string
  scm_type: string
  version: string
}

export interface NotificationData {
  Branch: string
  CommitSha: string
  Description: string
  ErrMessage: string
  GitRepoName: string
  HitCache: boolean
  PubBase: string
  SCMId: number
  SCMRepoName: string
  Version: string
}

export interface PipelineRunArtifact {
  name: string
  sizeKb: string
  source: string
  pipelineRunId: string
  jobRunId: string
  type: number
  category: number
  externalArtifacts: ExternalArtifacts
  expiredAt: string
  lastUpdatedAt: string
  objectKey: string
  url: string
}

export interface ExternalArtifacts {
  artifactRepoId: string
  artifactRepoName: string
  repoRegion: number
  provider: number
  artifactId: string
  versionId: string
  assetId: string
  assetName: string
  contentType: string
  arch: string
  sizeKb: string
}

export interface RunParams {
  __jwt__: string
  archive_branch: string
  author: string
  boe_repo_infos: any
  branch: string
  build_reason: string
  build_scene_info: BuildSceneInfo
  bytecycle_scene_info: BytecycleSceneInfo
  change_psm: string
  code_repo: string
  code_repo_provider_id: number
  dependent_scm_list: any
  detail_url: string
  developer: string[]
  development_task_id: string
  development_task_name: string
  env_operators: string[]
  env_repo_infos: any
  feature_id: string
  feature_ids: string[]
  feature_ids_str: string
  feature_name: string
  feature_type: string
  feature_url: string
  feature_urls: string[]
  ies_batch_gecko_map: IesBatchGeckoMap
  ies_geckolist: any[]
  instance_id: number
  integration_branch: string
  is_bits_dev_mode_pipeline: boolean
  issue_ids_str: string
  issues: any[]
  item_identity: string
  lark_group_ids_str: string
  main_git_repo_id: number
  main_git_repo_name: string
  main_repo_archive_branch: string
  main_repo_deploy_branch: string
  main_repo_feature_branch: string
  main_repo_integration_branch: string
  main_repo_name: string
  main_scm_repo_id: number
  main_scm_repo_name: string
  meego_simple_name: string
  members: string[]
  merge_request_url: string
  mr_target_branch: string
  need_boe: string
  need_ppe: string
  node_id: number
  node_name_cn: string
  node_name_en: string
  parent_ppl_run_id: number
  parent_ppl_run_name: ParentPplRunName
  parent_ppl_run_seq: number
  parent_ppl_run_url: string
  pipeline_control_plane: string
  ppe_i18n_env_name: string
  ppe_i18nbd_env_name: string
  ppe_repo_infos: any
  ppe_us_ttp_name: string
  process_type: string
  project_key: string
  project_list: ProjectList[]
  project_owners: string[]
  project_type: string
  provider: string
  psm: string
  psm_list: string[]
  qa_role: string[]
  release_branch: string
  repo_name: string
  requirement_ids_str: string
  requirement_url: string
  requirements: Requirement[]
  scm_configs_be: string
  scm_repo_id: number
  scm_version_list: any
  sdlc_info: SdlcInfo[]
  sdlc_info_list: SdlcInfoList[]
  source_branch: string
  target_branch: string
  test_approver: string[]
  test_approver_str: string
  ticket_id: number
  ticket_name: string
  title: string
  train_feature_id_list: string[]
  train_region: string
  tt_geckolist: TtGeckolist[]
  ttops_reviewers_and_groups: any[]
  ttp_change_items: any[]
  ttp_dependency: any[]
  type: string
  type_cn: string
  url: string
  version_info: VersionInfo
  workItem_list: WorkItemList3[]
  work_item_list: WorkItemList4[]
  work_items: WorkItem[]
}

export interface BuildSceneInfo {
  scene_id: string
  scene_name: string
  scene_type: string
  scene_url: string
}

export interface BytecycleSceneInfo {
  scene_id: string
  scene_name: string
  scene_type: string
  scene_url: string
}

export interface IesBatchGeckoMap {}

export interface ParentPplRunName {
  en: string
  zh: string
}

export interface ProjectList {
  control_plane: string
  project_name: string
  project_type: string
  project_unique_id: string
}

export interface Requirement {
  project_key: string
  requirement_id: number
  requirement_project: string
  requirement_type: string
}

export interface SdlcInfo {
  branch: string
  commit_hash: string
  feature_id: string[]
  git_url: string
  name: string
  repo_name: string
  type: string
  workItem_list: WorkItemList[]
}

export interface WorkItemList {
  id: string
  platform: string
  source_type: string
  space_key: string
  type: string
  username: string
}

export interface SdlcInfoList {
  branch: string
  commit_hash: string
  feature_id: string[]
  git_url: string
  name: string
  repo_name: string
  type: string
  workItem_list: WorkItemList2[]
}

export interface WorkItemList2 {
  id: string
  platform: string
  source_type: string
  space_key: string
  type: string
  username: string
}

export interface TtGeckolist {
  app_name: string
  channel_id: string
  channel_name: string
  env_lane: string
  env_type: number
  gecko_app_id: number
  gecko_package_types: string[]
  region: string
}

export interface VersionInfo {}

export interface WorkItemList3 {
  workItem_id: string
  workItem_platform: string
  workItem_space_id: string
  workItem_space_key: string
  workItem_type: string
  workItem_url: string
}

export interface WorkItemList4 {
  workItem_id: string
  workItem_platform: string
  workItem_space_id: string
  workItem_space_key: string
  workItem_type: string
  workItem_url: string
}

export interface WorkItem {
  id: string
  platform: string
  source_type: string
  space_key: string
  type: string
  username: string
}

export interface Context2 {
  execution_time_ms: number
  timestamp: string
  api_endpoint: string
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export interface GeckoPackageInfo {
  app: App
  deployment: Deployment
  channel: Channel
  package: Package
}

export interface App {
  id: number
  name: string
}

export interface Deployment {
  id: number
  name: string
  accessKey: string
}

export interface Channel {
  id: number
  name: string
}

export interface Package {
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
  pocmCheckResult: PocmCheckResult
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

export interface DistributeRule {
  envLaneList: EnvLaneList[]
}

export interface EnvLaneList {
  type: number
  values: string[]
}

export interface CandidatePackage {
  id: string
  accessKey: string
  channel: string
  url: string
  md5: string
  scmVersion: string
  commitId: string
  description: string
  used: number
  pkgSize: number
  pkgByteSize: number
  targetOs: number
  targetAppVersion: string
  buildRepoName: string
  buildRepoBranch: string
  businessType: number
  packageType: number
  configMark: number
  disableOffline: number
  taskUuid: string
  createdAt: string
  updatedAt: string
}

export interface PocmCheckResult {
  status: number
  auditDetail: any[]
}
