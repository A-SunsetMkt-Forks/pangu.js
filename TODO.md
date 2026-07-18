# Development Progress

## In Progress

No task in progress

## Upcoming Tasks

### High Priority

- [ ] New feature: 為什麼你們就是不能拼對大小寫呢？

### Medium Priority

- [ ] Architecture deepening candidates (extension settings module, spacing eligibility policy, BrowserPangu interface) - see docs/architecture-review-2026-07-17.md
- [ ] Change icon or badge to reflect the current `spacing_mode`
- [ ] Fix issue #155 - DO NOT spacing URL
  - `https://xxxxx/不要加空格.html`
  - `https://%E5%A6%82`
- [ ] Fix issue #201 - Spaces between image-separated text
- [ ] Fix issue #173 - Full-width quotes spacing, `「」` and `『』`
- [ ] Fix issue #169 - YouTube title persistence
- [ ] Fix issue #207 - Bilibili upload page layout breaking
- [ ] Re-visit issue #291 (explicit sync/async methods, remove `taskScheduler.config.enabled`) when all major browsers support `requestIdleCallback()` by default

### Low Priority

- [ ] Add CSS `text-autospace` instructions in options page (Reason: Native browser feature is faster)
- [ ] Handle HTML comment spacing: `<!-- content -->`
- [ ] Fix issue #161 #216 - Comprehensive Markdown support
