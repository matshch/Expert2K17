dotnet publish -c Release -r ubuntu-x64
cd bin\Release\netcoreapp2.0\ubuntu-x64\publish
bash -c "rsync -avz --progress --exclude connections.json --delete * maxavatar.no-ip.org:/opt/Expert2k17/"
bash -c "ssh maxavatar.no-ip.org sudo expert2k17-restart.sh"
cd ..\..\..\..\..