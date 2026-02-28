import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# cavegeek.ai

知識探索與技術分享 — AI、程式開發、專案管理、商業思維、工具推薦

## Navigation

- [About](/about.md)
- [Recent Posts](/posts.md)
- [RSS Feed](/rss.xml)

## Links

- GitHub: [cavegeek-ai](https://github.com/cavegeek-ai)
- Email: droids@cavegeek.ai

---

*This is the markdown-only version of cavegeek.ai. Visit [cavegeek.ai](https://cavegeek.ai) for the full experience.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
