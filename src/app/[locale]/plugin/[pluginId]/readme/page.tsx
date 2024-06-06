import { getPluginOr404 } from "@/catalogue/data";
import { AllOfAPlugin } from "@/catalogue/meta-types";
import GfmMarkdown from "@/components/markdown/gfm-markdown";
import { NaLink } from "@/components/na-link";
import { NoneText } from "@/components/none-text";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

async function PluginContentReadme({plugin}: { plugin: AllOfAPlugin }) {
  const t = await getTranslations('page.plugin.readme')
  const readme_text = await get_readme(plugin.github)

  if (!readme_text.data) {
    return <NoneText>{t('no_readme')}</NoneText>
  }

  if (readme_text.url) {
    let readmeSrc: React.ReactNode = <span>N/A</span>
    const parts = readme_text.url?.replace(/https:\/\/raw.githubusercontent.com\//, '').split('/')
      if (parts && parts.length >= 4) {
        const reposPair = parts.slice(0, 2).join('/')
        const reposUrl = `https://github.com/${reposPair}`
        const branch = parts[2]
        const path = parts.slice(3).join('/')
        readmeSrc = <NaLink href={`${reposUrl}/blob/${branch}/${path}`} hoverUnderline>{path}</NaLink>
      }

      return (
        <div>
          <GfmMarkdown allowEmbedHtml>{readme_text.data}</GfmMarkdown>  {/* SSR, no need to use GfmMarkdownDynamic */}
          <p className="mt-5 text-end text-sm text-mantine-dimmed">
            {t('readme_source')}
            {readmeSrc}
          </p>
        </div>
      )
  }
}

export default async function Page({params: {pluginId, locale}}: { params: { pluginId: string, locale: string } }) {
  unstable_setRequestLocale(locale)
  const plugin = await getPluginOr404(pluginId)

  return (
    <PluginContentReadme plugin={plugin}/>
  )
}

async function get_readme(repo: string): Promise<{ data: string, url: string }> {
  const url = `https://raw.githubusercontent.com/${repo}/master/README.md`
  const rsp = await fetch(url)
  const data = await rsp.text()
  const replace = replace_hashtag(repo,data)

  return { data: replace, url }
}

function replace_hashtag(repo:string,data: string){
  const modifiedData = data.replace(/\(#([^)]+)\)/g, `(https://github.com/${repo}/#$1)`)
  return modifiedData
}