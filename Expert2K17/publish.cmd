dotnet publish -c Release -r ubuntu-x64
cd bin\Release\netcoreapp2.0\ubuntu-x64\publish
bash -c "rsync -avz --progress --exclude connections.json --exclude wwwroot/covers --exclude wwwroot/systems --exclude wwwroot/userpics --delete * maxis.pw:/opt/Expert2k17/"
bash -c "ssh maxis.pw mkdir -p /opt/Expert2k17/wwwroot/covers"
bash -c "ssh maxis.pw mkdir -p /opt/Expert2k17/wwwroot/systems"
bash -c "ssh maxis.pw mkdir -p /opt/Expert2k17/wwwroot/userpics"
bash -c "ssh maxis.pw sudo expert2k17-restart.sh"
cd ..\..\..\..\..
