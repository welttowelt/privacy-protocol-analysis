# Contributing

This is a community-maintained resource. The goal is an honest, well-sourced overview that helps everyone understand what each privacy protocol does and where things are headed.

## Principles

1. **Cite your sources.** Every tick, partial tick, or dash should be traceable to official documentation, a protocol spec, or a verifiable onchain fact. Link to the source in your PR description.

2. **Be accurate.** If a protocol doesn't have a capability yet, that's a dash — and that's fine. Partial ticks exist for real caveats, not for spin. The grid is more useful when it reflects reality.

3. **Scope changes clearly.** One PR should do one thing: update an entry, add a protocol, improve a definition. Don't bundle unrelated changes.

## How to make changes

All grid data lives in `docs/data.js`. The website renders the rows, footnotes, and definitions from that file, so don't edit the table rows in `docs/index.html` by hand.

### Update an entry

1. Find the protocol in `fullProjects` (Full Grid) or `glanceProjects` (At a Glance)
2. Change `true`, `"partial"`, or `false` for the relevant property
3. If adding a partial tick, add a footnote to `fullFootnotes` or `glanceFootnotes` and map it in the protocol's `fnMap`
4. Update the `definitions` list if the rationale text needs to reflect the change
5. If your change affects visible counts or summary copy, update the matching text in `docs/index.html` and `README.md`
6. Preview locally from `docs/` with `python3 -m http.server 8080`

### Add a protocol

1. Add a new object to `fullProjects` following the existing format
2. Document all 17 properties with sources for each
3. Add corresponding footnotes for any partial ticks
4. Add the protocol to `glanceProjects` (At a Glance tab) with the 6 condensed entries
5. Update any visible count/copy references in `docs/index.html` and `README.md`
6. Preview locally

### Add a property

Open an issue first. New properties affect every protocol row, so discuss whether the property is meaningful and how each protocol should be documented before writing code.

### Improve a definition

Update the relevant entry in the `definitions` list. Keep the tone factual and concise.

## Code style

Keep `docs/data.js` readable and explicit. This project favors straightforward data structures over clever abstractions.

## Review process

PRs will be reviewed for:
- Accuracy of claims (sources required)
- Consistency with the existing format
- Whether the site data and visible copy stay in sync
