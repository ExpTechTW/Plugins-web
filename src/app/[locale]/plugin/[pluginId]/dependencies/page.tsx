import { getInfo, getPluginOr404 } from "@/catalogue/data";
import { AllOfAPlugin } from "@/catalogue/meta-types";
import { NoneText } from "@/components/none-text";
import { PluginDependenciesAll } from "@/components/plugin/plugin-dependencies";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

async function PageContent({plugin}: { plugin: AllOfAPlugin }) {
  const t = await getTranslations('page.plugin.dependencies')
  const info = await getInfo(plugin.github)

  if (!info) {
    return <NoneText>{t('meta_unavailable')}</NoneText>
  }

  return (
    <div>
      <PluginDependenciesAll meta={info}/>
      <p className="mt-5 text-end text-sm text-mantine-dimmed">
        {t('meta_source', {
          src: info
            ? t('meta_source_latest_release', {version: info.version})
            : t('meta_source_branch', {branch: plugin.plugin.branch})
        })}
      </p>
    </div>
  )
}

export default async function Page({params: {pluginId, locale}}: { params: { pluginId: string, locale: string } }) {
  unstable_setRequestLocale(locale)
  const plugin = await getPluginOr404(pluginId)

  return (
    <PageContent plugin={plugin}/>
  )
}
