// https://github.com/MCDReforged/PluginCatalogue/tree/catalogue

export interface LangDict {
  [lang: string]: string
}

export interface Everything {
  last_update_time: string
  github(github: any): unknown
  timestamp: number
  authors: AuthorSummary
  plugin_list: {
    [key: string]: AllOfAPlugin
  }
}

export interface AuthorInfo {
  name: string
  link: string
}

export interface AuthorSummary {
  amount: number
  authors: {
    [key: string]: AuthorInfo
  }
}

export interface AllOfAPlugin {
  forEach(arg0: (element: any) => void): unknown
  last_update_time: Date | undefined
  description: any
  tag: string[]
  name: any
  package_name: any
  github(github: any): unknown
  meta: MetaInfo | null
  plugin: PluginInfo
  release: ReleaseSummary | null
  repository: RepositoryInfo | null
}

export interface MetaInfo {
  id: string
  name: string
  version: string
  repository: string
  link: string
  authors: string[]

  dependencies: {[key: string]: string}
  requirements: string[]
  description: string
}

export interface PluginInfo {
  id: string
  authors: string[]
  repository: string
  branch: string
  related_path: string
  labels: string[]
  introduction: LangDict
}

export interface ReleaseSummary {
  id: string
  latest_version: string | null
  latest_version_index: number | null
  releases: ReleaseInfo[]
}

export interface ReleaseInfo {
  url: string
  name: string
  tag_name: string
  created_at: string

  description: string | null
  prerelease: string

  asset: AssetInfo
  meta: MetaInfo
}

export interface AssetInfo {
  name: string
  size: number
  download_count: number
  created_at: string
  browser_download_url: string
  hash_md5: string
  hash_sha256: string
}

export interface RepositoryInfo {
	url: string
	name: string
	full_name: string
	description: string | null
	archived: boolean

	stargazers_count: number
	watchers_count: number
	forks_count: number

	readme: string | null
	readme_url: string | null
}
