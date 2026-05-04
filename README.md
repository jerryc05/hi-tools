# Installation
```sh
pnpm add -g @jerryc05/hi-tools
```

# Help
```
hi [command]

Commands:
  hi mm     [M]erge [M]aster: Update local master to remote's, then merge into
            current branch
  hi mmm    [M]erge [M]aster (don't [M]odify local master): Merge remote's
            master into current branch, without updating local master
  hi tschk  My ts-check rules
  hi wup    [W]ait for pkg publish, [U]pdate target repo, and [P]ush
  hi ips    Show current machine's IP addrs
  hi mdns   Show mdns [hostname].local
  hi tt     TT/BD internal toolset

Options:
  --version  Show version number                                       [boolean]
  --verbose  Run with verbose logging                                  [boolean]
  --help     Show help                                                 [boolean]
```

```
hi tt

TT/BD internal toolset

Commands:
  hi tt bam             Update BAM code-gen
  hi tt tt-gecko        Show gecko info by bits URL
  hi tt i18n            I18n scan and sort
  hi tt luban <repoId>  Publish current repo pkg to Luban

Options:
  --version  Show version number                                       [boolean]
  --verbose  Run with verbose logging                                  [boolean]
  --help     Show help                                                 [boolean]
```
