import { AllOfAPlugin } from "@/catalogue/meta-types";
import GfmMarkdown from "@/components/markdown/gfm-markdown";
import { translateLangDict } from "@/utils/i18n-utils";
import { getLocale } from "next-intl/server";
import React from "react";

export async function PluginContentIntroduction({
  plugin,
}: {
  plugin: AllOfAPlugin;
}) {
  const desc = await get_content(plugin.github, plugin.package_name);
  // const introduction = translateLangDict(await getLocale(), desc, true) || ''
  return (
    <>
      {/* SSR, no need to use GfmMarkdownDynamic */}
      <GfmMarkdown allowEmbedHtml>{desc}</GfmMarkdown>
    </>
  );
}

async function get_content(repo: string, pkg: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${repo}/master/${pkg}/info.json`;
  const rsp = await fetch(url);
  const data = await rsp.json();
  const desc = data.description.zh_tw;
  return desc;
}
