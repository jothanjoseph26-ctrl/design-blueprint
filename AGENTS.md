<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Lesson video sources resolve in src/lib/lessons.ts (Cloudflare Stream id via VITE_CF_STREAM_CUSTOMER_CODE, or direct URL); hls.js is dynamically imported in the player so it never runs during SSR.
