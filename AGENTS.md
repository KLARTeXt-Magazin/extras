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

- Shared header, issue menu and footer live in src/components/site-chrome.tsx; every issue page uses AudioCard — avoids duplicated markup per issue.
- Fonts are self-hosted via @fontsource imported in styles.css; never load Google Fonts remotely (GDPR).
