# Do not forget to add the post-commit hook to .git/hooks/post-commit file containing :
```
#!/bin/sh
echo "POST-COMMIT started"
ver=$(git describe --abbrev=0)
complete=$(git describe)
branch=$(git rev-parse --abbrev-ref HEAD)
commit=$(git rev-parse HEAD)
timestamp=$(git log -1 --date=short --pretty=format:%cD)
cat > private/version.json << EOF
{
    "basic": "$ver",
    "complete": "$complete",
    "branch": "$branch",
    "commit": "$commit",
    "timestamp": "$timestamp"
}
EOF
```
# To be done :
- post-commit git hook do not work on linux
- database backup to implement (and from application UI)
