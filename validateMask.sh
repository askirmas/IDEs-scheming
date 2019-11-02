#/bin/sh
MASK=$1;
SCHEMA=$2;
#PGID=$(ps -o pgid) #ps -o pid,ppid,pgid,gid,sess,cmd
# set -e
# --process-slot-var=R -E EOF

find -type f -wholename "$MASK" \
| xargs sh -c 'ajv -d "$1" -s "'$SCHEMA'" || pkill -9 -P '$PPID' ' sh