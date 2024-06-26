import { createSimplePlugin } from "@/catalogue/conversion";
import { getEverything, getInfo, getPlugin, getPluginInfo, getPluginOr404, getSimpleEverything } from "@/catalogue/data";
import { AllOfAPlugin, ReleaseInfo } from "@/catalogue/meta-types";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReleaseDisplay } from "./release-display";

interface PageParams {
  locale: string
  pluginId: string
  version: string
}

// async function getRelease(plugin: AllOfAPlugin, version: string): Promise<ReleaseInfo | undefined> {
//   const releases = await getPluginInfo(plugin.github);
//   if (releases && releases.length > 0) {
//     const release = releases.find(r => r.tag_name === version);
//     return release;
//   } else {
//     return undefined;
//   }
// }

export async function generateMetadata({params}: {params: PageParams}) {
  const t = await getTranslations({locale: params.locale, namespace: 'metadata.title'})
  const plugin = await getPlugin(params.pluginId)
  const everything = await getSimpleEverything()

  let title = t('catalogue')
  if (plugin) {
    const version = decodeURIComponent(params.version)
    const release = everything.PluginInfo[params.pluginId].find(r => r.tag_name === version);
    const pluginName = params.pluginId
    if (release) {
      title = t('plugin_release', {
        name: pluginName,
        version: version,
      })
    } else {
      title = t('plugin', {name: pluginName})
    }
  }

  return {title}
}

// export async function generateStaticParams({params}: {params: {pluginId: string}}) {
//   const plugin = await getPluginOr404(params.pluginId)
//   if (plugin.release) {
//     return plugin.release.releases.map(r => {
//       return {version: r.meta.version}
//     })
//   } else {
//     return []
//   }
// }

export default async function Page({params}: {params: PageParams}) {
  unstable_setRequestLocale(params.locale)

  const version = decodeURIComponent(params.version)
  const pluginId = decodeURIComponent(params.pluginId)

  const everything = await getSimpleEverything()
  const plugin_list = everything.plugin_list[pluginId]
  if (!plugin_list) {
    notFound()
  }
  const plugin_info = everything.PluginInfo[pluginId]
  if (!plugin_info) {
    notFound()
  }
  const release = plugin_info.find(r => r.tag_name === version);
  if (!release) {
    notFound()
  }

  return (
    <ReleaseDisplay
      plugin={plugin_list}
      release={release}
    />
  )
}
