import { AuthorInfo, AuthorSummary, LangDict } from "@/catalogue/meta-types";

export interface SimpleEverything {
  timestamp: number
  authors: AuthorSummary
  plugin_list: {
    [key: string]: SimplePlugin
  }
}

export interface SimplePlugin {
  id: string
  name: string
  description: string
  repos: string
  reposHome: string
  labels: string[]
  authors: AuthorInfo[]
  downloads: number
  last_update_time: Date | undefined
  latestRelease: SimpleRelease | undefined
}

export interface SimpleRelease {
  version: string
  url: string
  assetName: string
  assetUrl: string
}

