# Do not forget to add the post-commit hook to .git/hooks/post-commit file containing :
```
#!/bin/sh
echo "POST-COMMIT started"
ver=$(git describe --abbrev=0)
complete=$(git describe)
branch=$(git rev-parse --abbrev-ref HEAD)
commit=$(git rev-parse HEAD)
timestamp=$(git log -1 --date=short --pretty=format:%cD)
cat > /media/francois/29986127-6346-4d3d-9897-ed4e3eb2ba8f/meteor/meteor-gen/private/version.json << EOF
{
    "basic": "$ver",
    "complete": "$complete",
    "branch": "$branch",
    "commit": "$commit",
    "timestamp": "$timestamp"
}
EOF

``
