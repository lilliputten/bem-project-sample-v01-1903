#!/bin/sh
# @since 2018.09.30, 04:36
# @version 2018.09.30, 04:36
# @description List all bundled bem modules from file
# Usage: $0 <file name>

for NAME in "$@"; do

  grep_ "\(:begin \*/$\|^/\* begin: \)" "$NAME" | \
    sed "\
      s/\\\\/\//g; \
      s/:begin \*\/$//; \
      s/^\/\* begin: \(\.\.\/\)*//; \
      s/^\/\* \(\.\.\/\)*//g; \
      s/ \*\/$//g; \
    " > "$NAME.list_"
  cat "$NAME.list_" | sort > "$NAME.list.sorted_"
  # cat "$NAME.list_" | sort -u > "$NAME.list.sorted.unique_"

done
