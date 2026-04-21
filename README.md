# Installation
```sh
pnpm add -g https://github.com/jerryc05/hi-tools.git
```

# Help
```
hi/0.0.1-beta.21

Usage:
  $ hi

Commands:
  mm           [M]erge [M]aster: Update master branch to remote's, then merge into current branch
  mmm          [M]erge [M]aster (don't [M]odify local master): Merge remote's master into current branch, without updating local master branch
  tt i18n      I18n scan and sort
  tt bam       Update BAM code-gen
  tschk        My ts-check rules
  wup          [W]ait for pkg publish, [U]pdate target repo, and [P]ush
  bm <target>  [B]ranch [M]erge: merge current HEAD into target branch without switching
  ips          Show network interface IP addrs
  mdns         Show mdns hostname
               Readme

For more info, run any command with the `--help` flag:
  $ hi mm --help
  $ hi mmm --help
  $ hi tt i18n --help
  $ hi tt bam --help
  $ hi tschk --help
  $ hi wup --help
  $ hi bm --help
  $ hi ips --help
  $ hi mdns --help
  $ hi --help

Options:
  -v, --version  Display version number
  -h, --help     Display this message
```
