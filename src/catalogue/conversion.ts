import { AllOfAPlugin, AuthorSummary, Everything, MetaInfo, ReleaseInfo } from "./meta-types";
import { SimpleEverything, SimplePlugin, SimpleRelease } from "./simple-types";

export function createSimpleEverything(everything: Everything): SimpleEverything {
  const simpleEverything: SimpleEverything = {
    timestamp: everything.timestamp,
    authors: everything.authors,
    plugin_list: {},
    last_update_time: everything.last_update_time,
  }
  Object.entries(everything.plugin_list).forEach(([pluginId, plugin], _) => {
    simpleEverything.plugin_list[pluginId] = createSimplePlugin(plugin, everything.authors, everything.last_update_time)
  })
  return simpleEverything
}

export function createSimplePlugin(plugin: AllOfAPlugin, authorData: AuthorSummary, last_plugins_update_time: string): SimplePlugin {
  let downloads = 0
  let latestDate: Date | undefined = undefined
  const releases = plugin.release?.releases || []
  downloads = 0;
  latestDate = plugin.last_update_time
  // releases.forEach(r => {
  //   downloads += r.asset.download_count
  //   const date: Date = new Date(r.asset.created_at)
  //   if (latestDate === undefined || date > latestDate) {
  //     latestDate = date
  //   }
  // })
  const latestRelease: ReleaseInfo | undefined = releases[plugin.release?.latest_version_index ?? -1]
  const latestSimpleRelease: SimpleRelease | undefined = latestRelease === undefined ? undefined : createSimpleRelease(latestRelease)

  const latestMeta: MetaInfo | undefined = latestRelease?.meta || plugin.meta || undefined

  const github = plugin.github
  const package_name = plugin.package_name
  const label = plugin.tag[0]
  const authors = plugin.name
  const description = plugin.description
  return {
    id: package_name,
    repos: `https://github.com/${github}`,
    reposHome: 'https://github.com/ExpTechTW/CDPS',
    labels: [label],
    authors: authors,
    downloads: downloads,
    latestRelease: latestSimpleRelease,
    name: latestMeta?.name ?? authors,
    description: latestMeta?.description ?? description,
    tag: plugin.tag,
    github: `https://github.com/${github}`,
    package_name: latestMeta?.name ?? authors,
    last_update_time: latestDate,
    last_plugins_update_time,
  }
}

export function createSimpleRelease(release: ReleaseInfo): SimpleRelease {
  return {
    version: release.meta.version,
    url: release.url,
    assetName: release.asset.name,
    assetUrl: release.asset.browser_download_url,
  }
}
