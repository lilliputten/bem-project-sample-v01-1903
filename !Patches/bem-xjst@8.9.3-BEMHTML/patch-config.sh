#!/sbin/sh
# @overview Patch tool (patch-tool) config file
# @description Make `BEMHTML` ym module from scratch
# @since 2018.10.01, 02:46
# @version 2019.01.11, 02:23

PRECMD="rm -f .editorconfig && echo \"\" | node ../../../node_modules/bem-xjst/bin/bem-xjst -o BEMHTML.js"

# POSTCMD="cat BEMHTML.begin base.bemhtml.js BEMHTML.end > BEMHTML.js"

# Root folder
ROOTCD="blocks/base"

# Target path relative to root
PATCHCD="BEMHTML"
