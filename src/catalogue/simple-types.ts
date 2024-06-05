import { AuthorInfo, AuthorSummary, LangDict } from "@/catalogue/meta-types";

export interface SimpleEverything {
  timestamp: number
  authors: AuthorSummary
  plugin_list: {
    [key: string]: SimplePlugin
  }
  last_update_time: string
}

export interface SimplePlugin {
  id: string
  repos: string
  reposHome: string
  labels: string[]
  authors: AuthorInfo[]
  downloads: number
  latestRelease: SimpleRelease | undefined
  name: string
  description: string
  tag: string[]
  github: string
  package_name: string
  last_update_time: Date | undefined
}

export interface SimpleRelease {
  version: string
  url: string
  assetName: string
  assetUrl: string
}

