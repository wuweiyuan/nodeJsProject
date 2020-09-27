#!/bin/sh
cd /Users/wuweiyuan/学习/nodeProject/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log