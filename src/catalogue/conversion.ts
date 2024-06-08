import { getInfo, getPluginInfo } from "./data";
import { AllOfAPlugin, AuthorSummary, Everything, MetaInfo, ReleaseInfo, Releases, ReleasesAsset, cdps_json } from "./meta-types";
import { SimpleEverything, SimplePlugin, SimpleRelease } from "./simple-types";

export async function createSimpleEverything(everything: Everything): Promise<SimpleEverything> {
  const simpleEverythingTemp: SimpleEverything = {
    // timestamp: everything.timestamp,
    // authors: everything.authors,
    plugin_list: {},
    last_update_time: everything.last_update_time,
  };

  for (const [pluginId, plugin] of Object.entries(everything.plugin_list)) {
    const info = await getInfo(plugin.github, plugin.package_name);
    const PluginInfo = await getPluginInfo(plugin.github)
    simpleEverythingTemp.plugin_list[plugin.package_name] = createSimplePlugin(plugin, info, PluginInfo);
  }

  return simpleEverythingTemp;
}

export function createSimplePlugin(plugin: AllOfAPlugin, info: cdps_json, PluginInfo: Releases[]): SimplePlugin {
  let downloads = 0
  // let latestDate = ""
  // const releases = plugin.release?.releases || []

  if(Array.isArray(PluginInfo)){
    PluginInfo.forEach((release: { assets: ReleasesAsset[]; }) => {
      release.assets.forEach((asset: { download_count: number; }) => {
        downloads += asset.download_count
      });
    });
  }
  // latestDate = plugin.last_update_time
  // releases.forEach(r => {
  //   downloads += r.asset.download_count
  //   const date: Date = new Date(r.asset.created_at)
  //   if (latestDate === undefined || date > latestDate) {
  //     latestDate = date
  //   }
  // })
  // const latestRelease: ReleaseInfo | undefined = releases[plugin.release?.latest_version_index ?? -1]
  // const latestSimpleRelease: SimpleRelease | undefined = latestRelease === undefined ? undefined : createSimpleRelease(latestRelease)

  // const latestMeta: MetaInfo | undefined = latestRelease?.meta || plugin.meta || undefined

  const github = plugin.github
  // const package_name = plugin.package_name
  // const label = [0]
  // const authors = plugin.name
  // const description = plugin.description
  return {
    id: plugin.package_name,
    repos: `https://github.com/${github}`,
    reposHome: 'https://github.com/ExpTechTW/CDPS',
    labels: plugin.tag,
    authors: [{
      name: info.author[0],
      link: `https://github.com/${info.author[0]}`,
    }],
    downloads: downloads,
    // latestRelease: latestSimpleRelease,
    latestRelease: {
      version: PluginInfo[0] ? PluginInfo[0].tag_name : '',
      url: PluginInfo[0] ? PluginInfo[0].url : '',
      assetName: PluginInfo[0] ? PluginInfo[0].assets[0].name : '',
      assetUrl: PluginInfo[0] ? PluginInfo[0].assets[0].browser_download_url : '',
    },
    name: plugin.name,
    description: plugin.description,
    tag: plugin.tag,
    github: plugin.github,
    // github: `https://github.com/${github}`,
    package_name: plugin.package_name,
    last_update_time: plugin.last_update_time,
    version: info.version
  }
}

export function createSimpleRelease(release: ReleaseInfo): SimpleRelease {
  return {
    version: release.tag_name,
    url: release.url,
    assetName: release.asset.name,
    assetUrl: release.asset.browser_download_url,
  }
}
