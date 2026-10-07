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

- Keep the public landing page at `/` and the existing swipe experience at `/discover`; this lets visitors explore before onboarding.
- Gate first-time onboarding only on experience pages, not on the public landing page; the homepage must remain unobstructed.
- Define landing-page styling and semantic colors in the global stylesheet and use the shared Button for new controls; this keeps the public page and app consistent.
