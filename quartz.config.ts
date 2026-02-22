import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "cavegeek.ai",
    pageTitleSuffix: " | 知識探索與技術分享",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "zh-TW",
    baseUrl: "cavegeek.ai",
    ignorePatterns: [
      "private", 
      "templates", 
      ".obsidian",
      "**/003-AICoding/prompt_example/**",
      "**/Private/**",
      "300-Area/002-Programming/水球軟體設計模式精通之旅/**",
      "400-Resource/Clippings/**",
      "400-Resource/Templates/**"
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f7fafc",
          lightgray: "#e2e8f0",
          gray: "#a0aec0",
          darkgray: "#4a5568",
          dark: "#1a365d",
          secondary: "#3182ce",
          tertiary: "#ed8936",
          highlight: "rgba(49, 130, 206, 0.15)",
          textHighlight: "#ed893688",
        },
        darkMode: {
          light: "#1a202c",
          lightgray: "#2d3748",
          gray: "#4a5568",
          darkgray: "#a0aec0",
          dark: "#f7fafc",
          secondary: "#63b3ed",
          tertiary: "#fbb161",
          highlight: "rgba(99, 179, 237, 0.15)",
          textHighlight: "#fbb16188",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
