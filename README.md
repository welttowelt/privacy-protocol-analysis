# Privacy Protocol Grid

An open, community-maintained overview of privacy protocols in crypto — who is building what, and how each approach works.

This grid exists so that builders, researchers, and users can see where things stand across the ecosystem — honestly, with sources — and figure out what still needs to be built.

## What's in the grid

**10 protocols** across **17 properties** in 4 categories:

| Category | Properties |
|---|---|
| **Privacy Model** | Multi-asset privacy pool, Formally ZK proofs, Secretless (no per-note keys), Efficient note discovery, Selective disclosure |
| **Cryptographic Foundation** | No trusted setup, Post-quantum proof system, Succinct verifiability |
| **Performance & UX** | Fast shield/unshield, End-to-end transaction time, Scalable private transactions, Programmable privacy |
| **Ecosystem & Access** | DeFi composability, Existing ecosystem, EVM compatible, Account abstraction, Hardware wallet support |

### Protocols covered

STRK20s (Starknet) · Zcash · Monero · Aztec · Aleo · Railgun · Solana Confidential · Canton · Tornado Cash · Zama (FHE)

**Missing a protocol?** Open a PR to add it.

## How to read the grid

Every cell is one of three values:

- **✓** — has this capability
- **(✓)** — partially, with a footnote explaining the caveat
- **–** — not present

All entries are backed by footnotes citing official documentation. If something is wrong, open an issue or PR with a source.

## Website

**Live:** [welttowelt.github.io/privacy-protocol-analysis](https://welttowelt.github.io/privacy-protocol-analysis/)

The interactive website is in the `docs/` directory. To run it locally:

```bash
cd docs
python3 -m http.server 8080
```

## Generate the xlsx

```bash
pip install openpyxl
python privacy_grid_final.py
```

Generates `privacy_feature_grid.xlsx` with 4 tabs:

| Tab | What it contains |
|---|---|
| **Property Grid** | Full technical overview with footnotes |
| **Definitions & rationale** | What each property means and how each protocol was evaluated |
| **At a glance** | 6 condensed properties for a non-technical audience |
| **Definitions & rationale 2** | How the 6 summary properties map to the full 17 |

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
