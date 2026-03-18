# Privacy Protocol Comparison Grid

An open, community-maintained comparison of privacy protocols in crypto.

Privacy isn't a competitive feature between protocols — it's a shared goal. The real benchmark isn't each other. It's whether on-chain finance can offer the same confidentiality that traditional finance takes for granted, without sacrificing the transparency and verifiability that make crypto worth building.

This grid exists so that builders, researchers, and users can see where the ecosystem stands — honestly, with sources — and figure out what still needs to be built.

## What's in the grid

**10 protocols** compared across **17 properties** in 4 categories:

| Category | Properties |
|---|---|
| **Privacy Model** | Multi-asset privacy pool, Formally ZK proofs, Secretless (no per-note keys), Efficient note discovery, Compliance (viewing keys) |
| **Cryptographic Foundation** | No trusted setup, Post-quantum proof system, Succinct verifiability |
| **Performance & UX** | Fast shield/unshield, Fast proof generation, Scalable private transactions, Rich client-side proving |
| **Ecosystem & Access** | DeFi composability, Existing ecosystem, EVM compatible, Account abstraction, Hardware wallet support |

### Protocols covered

STRK20s (Starknet) · Zcash · Monero · Aztec · Aleo · Railgun · Solana Confidential · Canton · Tornado Cash · Zama (FHE)

**Missing a protocol?** Open a PR to add it.

## Scoring

Every cell is one of three values:

- **✓** — full capability (1 point)
- **(✓)** — partial, with a footnote explaining the caveat (0.5 points)
- **–** — absent (0 points)

All scores are backed by footnotes citing official documentation. If a score is wrong, open an issue or PR with a source.

## How to run

```bash
pip install openpyxl
python privacy_grid_final.py
```

Generates `privacy_feature_grid.xlsx` with 4 tabs:

| Tab | What it contains |
|---|---|
| **Property Grid** | Full technical comparison with scores and footnotes |
| **Definitions & rationale** | What each property means and how each protocol was scored |
| **At a glance** | 6 condensed properties for a non-technical audience |
| **Definitions & rationale 2** | How the 6 summary properties map to the full 17 |

## Contributing

This grid is only as good as the community reviewing it. Contributions are welcome from anyone — protocol teams, researchers, users.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick ways to help

- **Fix a score** — If something is wrong, open a PR with sources
- **Add a protocol** — Add a new row to the grid with all 17 properties scored and sourced
- **Add a property** — Propose a new column via an issue first to discuss whether it belongs
- **Improve definitions** — Make the rationale clearer or more precise
- **Challenge a caveat** — If a partial tick should be full (or vice versa), make the case with evidence

## License

MIT
