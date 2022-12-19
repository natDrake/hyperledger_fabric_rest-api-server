# Rest_api_server

Rest api server for hyperledger fabric user enrollment via ca and create and get requests for asset creation.

For network setup->
1.Use test-network with network.sh script with -ca so as to have crypto material generated via ca. The same ca will be used later for admin and user enrollments.
./network.sh up -ca

2.Copy the connection.json from your organizations folder and paste it in config folder.

3.Create channel.
./network.sh createChannel -c mychannel

4.Deploy chaincode on the channel.
./network.sh deployCC -ccn basic -ccp <chaincode-folder-path> -ccl go -ccv 1.1

5.Add port, channel name,chaincode name and wallet path inside config.json in config folder.

6.Clone the repo, npm install and run the server.
