# Installation
```sh
pnpm add -g https://github.com/jerryc05/hi-tools.git
```

# Help
```
hi/0.0.2-beta.13

Usage:
  $ hi

Commands:
  upgrade              Upgrade to latest version (default using pnpm)
  mm                   [M]erge [M]aster: Update local master to remote's, then merge into current branch
  mmm                  [M]erge [M]aster (don't [M]odify local master): Merge remote's master into current branch, without updating local master
  tschk                My ts-check rules
  wup                  [W]ait for pkg publish, [U]pdate target repo, and [P]ush
  ips                  Show current machine's IP addrs
  mdns                 Show mdns hostname.local
  bm <target>          [B]ranch [M]erge: merge current HEAD into target branch without switching
  tt-npm-pub <repoID>  [PUB]lish current hash of current repo to Luban
  tt-bam               Update BAM code-gen
  tt-gecko             Show gecko info by bits URL
  tt-i18n              I18n scan and sort
                       Print help message

For more info, run any command with the `--help` flag:
  $ hi upgrade --help
  $ hi mm --help
  $ hi mmm --help
  $ hi tschk --help
  $ hi wup --help
  $ hi ips --help
  $ hi mdns --help
  $ hi bm --help
  $ hi tt-npm-pub --help
  $ hi tt-bam --help
  $ hi tt-gecko --help
  $ hi tt-i18n --help
  $ hi --help

Options:
  --quiet        Silently quit
  -v, --version  Display version number
  -h, --help     Display this message
```
