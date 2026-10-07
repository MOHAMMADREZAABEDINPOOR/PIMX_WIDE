<div align="center">

<img src="assets/readme/hero.gif" width="1200" alt="PIMX WIDE — rotating 3D geometry" />

**[English](README.md) · [فارسی](README.fa.md)**

<img src="assets/readme/identity.svg" width="1200" alt="security / English and Persian documentation" />

</div>

# PIMX WIDE

A multilingual text/file encryption interface using browser Web Crypto, AES-256-GCM and password-derived keys, with local records and optional visitor telemetry.

[GitHub](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE) · [PIMX / Profile](https://github.com/MOHAMMADREZAABEDINPOOR) · [Static artwork](assets/readme/hero.png)

## Features

- Authenticated AES-256-GCM encryption and decryption
- PBKDF2-SHA-256 password derivation with 100,000 iterations
- Localized navigation, privacy pages and RTL support
- Local storage helpers and Cloudflare visit endpoints

## Stack

| Tool | Version / source |
|---|---|
| React | `18.2.0` |
| Vite | `^6.2.0` |
| TypeScript | `~5.8.2` |

## Getting started

Node.js 22.12+ and the package manager declared in package.json. Install dependencies from the checked-in lockfile where available.

```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WIDE.git
cd PIMX_WIDE

npm ci
npm run dev
```

## Configuration

These names are found in the example configuration or source; not all are required. Check their defaults/usage in those files and supply secrets only in your local or hosting environment.

| Name | Role |
|---|---|
| `API_KEY` | Credential/connection setting; keep private |
| `GEMINI_API_KEY` | Credential/connection setting; keep private |

Hosting bindings: `PIMX_VISITS`.

## Usage

Select Encrypt, supply your input and password, then retain the encrypted output. Select Decrypt and use the same password to recover it.

## Project structure

| Path | Role |
|---|---|
| [`assets/`](assets/) | Brand/media/README assets |
| [`components/`](components/) | Reusable interface components |
| [`functions/`](functions/) | Hosting API functions |
| [`public/`](public/) | Public web assets |
| [`services/`](services/) | Services and integration helpers |
| [`index.html`](index.html) | Project entry/configuration file |
| [`metadata.json`](metadata.json) | Project entry/configuration file |
| [`package.json`](package.json) | Project entry/configuration file |
| [`tsconfig.json`](tsconfig.json) | Project entry/configuration file |
| [`wrangler.toml`](wrangler.toml) | Project entry/configuration file |

## Commands and checks

```bash
npm run dev
npm run build
npm run preview
```

These commands are declared in package.json; the list is not a test execution report. Test commands may need a browser, service or prepared database.

## Deployment

Deploy the build according to its architecture: server-backed projects need a Node process; static Vite frontends can host dist. Pages functions, KV or D1 require separate configuration.

## Limitations

A lost password cannot be recovered by the application. Keep backups, use strong passwords and test a round trip before deleting originals. Browser processing and analytics are separate behaviors; this project has not been independently audited.

## Troubleshooting

- Missing packages: install dependencies using the project’s package manager.
- API/network failure: check the configured origin, provider and hosting bindings.
- Old assets: rebuild when a build script exists, then clear the browser cache.

## Contributing

Create a focused branch, verify the affected behavior and explain the change clearly. Keep private data, build outputs and local databases out of commits.

## License

No repository-level license file is included in this snapshot. Public visibility alone does not grant reuse rights; contact the repository owner for terms.

---

Part of **PIMX** · Documentation in English and Persian.
