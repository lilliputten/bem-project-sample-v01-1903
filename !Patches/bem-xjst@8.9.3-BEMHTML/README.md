# BEMHTML

Creating ym-module in bem-level `base.blocks`.

Extract BEMHTML engine from `bem-xjst`, patch for export global object and wrap into ym-module.

Command for extract BEMHTML code:
```shell
$ echo "" | node node_modules\bem-xjst\bin\bem-xjst -o BEMHTML.js
```
Or (global):
```shell
$ echo "" | bem-xjst -o BEMHTML.js
```
