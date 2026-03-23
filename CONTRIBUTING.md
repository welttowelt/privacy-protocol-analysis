# Contributing

This is a community-maintained resource. The goal is an honest, well-sourced overview that helps everyone understand what each privacy protocol does and where things are headed.

## Principles

1. **Cite your sources.** Every tick, partial tick, or dash should be traceable to official documentation, a protocol spec, or a verifiable onchain fact. Link to the source in your PR description.

2. **Be accurate.** If a protocol doesn't have a capability yet, that's a dash — and that's fine. Partial ticks exist for real caveats, not for spin. The grid is more useful when it reflects reality.

3. **Scope changes clearly.** One PR should do one thing: update an entry, add a protocol, improve a definition. Don't bundle unrelated changes.

## How to make changes

All changes go through `privacy_grid_final.py`. The xlsx is a generated output — don't edit it directly.

### Update an entry

1. Find the protocol's row in the `projects` list (for Property Grid) or `mkt_projects` (for At a Glance)
2. Change `True`, `"partial"`, or `False` for the relevant property
3. If adding a partial tick, add a footnote to the `footnotes` dict and map it in the protocol's `fn_map`
4. Update the definitions in the `definitions` list if the rationale text needs to reflect the change
5. Regenerate the xlsx: `python privacy_grid_final.py`
6. Commit both the `.py` and `.xlsx` files

### Add a protocol

1. Add a new tuple to the `projects` list following the existing format
2. Document all 17 properties with sources for each
3. Add corresponding footnotes for any partial ticks
4. Add the protocol to `mkt_projects` (At a Glance tab) with the 6 condensed entries
5. Regenerate and commit both files

### Add a property

Open an issue first. New properties affect every protocol row, so discuss whether the property is meaningful and how each protocol should be documented before writing code.

### Improve a definition

Update the relevant entry in the `definitions` or `mkt_definitions` list. Keep the tone factual and concise.

## Code style

The script is a single file with no abstractions. Keep it that way — anyone should be able to read it top to bottom and understand exactly what the xlsx contains.

## Review process

PRs will be reviewed for:
- Accuracy of claims (sources required)
- Consistency with the existing format
- Whether the xlsx regenerates cleanly
