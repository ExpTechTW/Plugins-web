import { SimpleEverything } from "@/catalogue/simple-types";
import { AttributeEntry } from "@/components/attribute-entry";
import { ClickableTooltip } from "@/components/clickable-tooltip";
import { TimeAgoDynamic } from "@/components/time-ago-dynamic";
import { prettyNumber } from "@/utils/unit-utils";
import { IconFileDownload, IconPackages, IconRefresh, IconUsers } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import React from "react";
import { CardSection, SidebarCard } from "./sidebar-common";

export async function StatsCard({everything}: { everything: SimpleEverything }) {
  const t = await getTranslations('page.plugin_list.sidebar')

  const allPlugins = Object.values(everything.plugin_list)
  const authorAmount = allPlugins.length
  const pluginAmount = allPlugins.length
  const downloadSum = allPlugins.reduce((s, plugin) => s + 0, 0)
  const downloadSumNeat = prettyNumber(downloadSum, 1)

  return (
    <SidebarCard>
      <CardSection title={t('stats')} className="gap-1.5">
        <div className="grid grid-cols-2 gap-3">
          <AttributeEntry Icon={IconRefresh} label={t('sync_at')}>
            <TimeAgoDynamic date={new Date(everything.last_update_time)}/>
          </AttributeEntry>
          <AttributeEntry Icon={IconUsers} label={t('author_amount')}>
            {authorAmount}
          </AttributeEntry>
          <AttributeEntry Icon={IconPackages} label={t('plugin_amount')}>
            {pluginAmount}
          </AttributeEntry>
          <AttributeEntry Icon={IconFileDownload} label={t('download_sum')}>
            <ClickableTooltip label={downloadSum}>
              <p>{downloadSumNeat}</p>
            </ClickableTooltip>
          </AttributeEntry>
        </div>
      </CardSection>
    </SidebarCard>
  )
}

