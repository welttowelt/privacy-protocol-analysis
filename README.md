# Privacy Protocol Grid

**https://privacygrid.dev**

An open overview of privacy protocols in crypto. Who is building what, and how each approach works.

This grid exists so that builders, researchers, and users can see where things stand across the ecosystem — honestly, with sources — and figure out what still needs to be built.

## What's in the grid

**13 protocols** across **17 properties** in 4 categories:

| Category | Properties |
|---|---|
| **Privacy Model** | Multi-asset privacy pool, Formally ZK proofs, Secretless (no per-note keys), Efficient note discovery, Selective disclosure |
| **Cryptographic Foundation** | No trusted setup, Post-quantum proof system, Succinct verifiability |
| **Performance & UX** | Fast shield/unshield, End-to-end transaction time, Scalable private transactions, Programmable privacy |
| **Ecosystem & Access** | DeFi composability, Existing ecosystem, EVM compatible, Account abstraction, Hardware wallet support |

### Protocols covered

STRK20s (Starknet) · Zcash · Monero · Aztec · Aleo · Railgun · Solana Confidential · Canton · Tornado Cash · Zama (FHE) · Tempo · Midnight · USX Private Transfer

**Missing a protocol?** Open a PR to add it.

## How to read the grid

Every cell is one of three values:

- **✓** — has this capability
- **(✓)** — partially, with a footnote explaining the caveat
- **–** — not present

All entries are backed by footnotes citing official documentation. If something is wrong, open an issue or PR with a source.

## Website

**Live:** [privacygrid.dev](https://privacygrid.dev/)

The interactive website lives in the `docs/` directory.

`docs/data.js` is the source of truth for the grid data, footnotes, and definitions.

To run it locally:

```bash
cd docs
python3 -m http.server 8080
```

## Maintainers

This grid is currently maintained by StarkWare employees. Contributions are open — anyone can submit issues and pull requests, and we review them on merit regardless of affiliation.

## Contributing

This grid is only as good as the community keeping it accurate. Contributions are welcome from anyone — protocol teams, researchers, users.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick ways to help

- **Fix an entry** — If something is wrong, open a PR with sources
- **Add a protocol** — Add a new row with all 17 properties documented and sourced
- **Add a property** — Propose a new column via an issue first to discuss whether it belongs
- **Improve definitions** — Make the rationale clearer or more precise
- **Update a caveat** — If a partial tick should be full (or vice versa), make the case with evidence

## License

MIT
