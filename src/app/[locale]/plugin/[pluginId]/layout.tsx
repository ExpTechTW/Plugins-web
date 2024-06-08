import { createSimplePlugin } from "@/catalogue/conversion";
import { getEverything, getInfo, getPlugin, getPluginOr404, getSimpleEverything } from "@/catalogue/data";
import { CommonContentLayout } from "@/components/layout/common-content-layout";
import { Divider } from "@mantine/core";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";
import { LayoutScrollFix } from "./layout-scroll-fix";
import { PluginContentCard } from "./plugin-content-card";
import { Sidebar } from "./sidebar";

export async function generateMetadata({params: {locale, pluginId}}: {params: {locale: string, pluginId: string}}) {
  const t = await getTranslations({locale, namespace: 'metadata.title'})
  const plugin = await getPlugin(pluginId)
  const plugin_name = plugin ? plugin.name : undefined;
  return {
    title: plugin_name
      ? t('plugin', {name: plugin?.meta?.name || plugin_name})
      : t('catalogue')
  }
}

export async function generateStaticParams() {
  const everything = await getEverything();
  return everything.plugin_list.map((plugin: { name: any; }) => ({
    pluginId: plugin.name
  }));
}

interface LayoutProps {
  children: React.ReactNode
  params: { pluginId: string, locale: string }
}

export default async function Layout({children, params: {locale, pluginId}}: LayoutProps) {
  unstable_setRequestLocale(locale)
  const plugin = await getPluginOr404(pluginId)
  const everything = await getSimpleEverything()
  const timestamp = everything.last_update_time
  const plugin_info = everything.plugin_list[pluginId]

  return (
    <CommonContentLayout>
      <LayoutScrollFix pluginId={pluginId}/>
      <div className="md:fixed md:w-sidebar-width md:h-[calc(100vh-5rem)] md:overflow-y-auto">
        <Sidebar plugin={plugin} simplePlugin={plugin_info} timestamp={timestamp}/>
      </div>
      <div className="flex md:hidden">
        <Divider className="w-full m-6" variant="dashed"/>
      </div>
      <div className="md:pl-sidebar-width">
        <PluginContentCard pluginId={pluginId}>
          {children}
        </PluginContentCard>
      </div>
    </CommonContentLayout>
  )
}