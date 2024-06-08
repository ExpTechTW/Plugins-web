export const siteConfig = {
  title: 'ExpTech Studio',
  titleTemplate: '%s - ExpTech Studio',
  description: 'ExpTech Studio',
  favicon: "/favicon.svg",
  links: {
    docs: "https://exptech.dev",
    WebSite: "https://exptech.com.tw/trem",
    Discord: "https://discord.gg/exptech-studio",
    githubMcdr: "https://github.com/ExpTechTW/CDPS",
    // githubWebsite: "https://github.com/MCDReforged/website",
    // githubCatalogue: "https://github.com/MCDReforged/PluginCatalogue",
    pypi: "https://pypi.org/project/cdps",
    // dockerhub: "https://hub.docker.com/r/mcdreforged/mcdreforged",
  },

  // Files to sync:
  // - "src/messages" translation files
  // - "config.matcher" in "src/middleware.ts"
  languages: [
    'en',
    'zh-TW',
    'ja',
  ],
  defaultLanguage: 'en',
}
