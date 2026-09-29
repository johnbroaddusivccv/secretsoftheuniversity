#!/bin/bash
# resumable: skips finished files; safe to re-run after a workspace restart
cd /tmp/claude-0/-home-claude/e1448475-78f4-52d5-8aad-fcf35a9cd3a2/scratchpad/r3d
pgrep -f "blender_render.py specs.json" >/dev/null && exit 0
nohup python3 blender_render.py specs.json bout 48 >> blender3.log 2>&1 &
