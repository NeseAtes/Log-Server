# node-log-server

##Install mongodb 

-install mongodb: `https://www.mongodb.com/download-center/community`

##Install elasticsearch

-install elasticsearch: `https://www.elastic.co/downloads/elasticsearch`

## Install Project

- Firstly, install this project: `https://github.com/NeseAtes/Log-Server.git`

1. Install packages : `npm install`
2. Change directory : `cd public`
3. Install packages : `npm install`
4. Change directory : `cd..`
5. Change directory : `cd config`
6. Edit port : `config/ app.js`
7. Edit database : `config/ database.js`
8. Change directory : `cd public`
9. Change directory : `cd config`
10. Edit service url : `config/ index.js`

## Port and Database Configuration

- You can change the port that the server will listen to. *app.js*
- You can change your hostname,port password according to the database you are using. *database.js*


##Run elasticsearch

1. change directory cd ../elasticsearch/bin on the command line
2. run elasticsearch `elasticsearch.bat` on the command line
-

## Run Project
- *node app.js or npm start* on the command line.

## Create database
1. change directory: ` cd  scripts `
2. create database: `node create_logdb.js`	(for first usage please create a user (role:admin) on mongodb)


##Screens
-firstly, if you don't sign in you will see this screen
![image](https://user-images.githubusercontent.com/26343034/55616622-e8926880-579a-11e9-822c-ef1d89ab1121.png)
- If you click the sign in button in the top right corner, you will see this screen. To log in, enter the user name and password and click the Sign In button. Click on the Register to register link and fill out the required fields to submit a registration request.
![image](https://user-images.githubusercontent.com/26343034/55616906-91d95e80-579b-11e9-964b-966af7e0c099.png)
-When the user logs in, the charts screen appears.
![image](https://user-images.githubusercontent.com/26343034/55617225-4b383400-579c-11e9-857b-ac0ae8b0654f.png)
-With the Broadcast tab, you can instantly view the data added to the log table.
![image](https://user-images.githubusercontent.com/26343034/55617434-b8e46000-579c-11e9-92f3-336f31da60a6.png)
-Logs can access log records with data. You can filter data by simply listing data with specific features or you can search through data with Elasticsearch.
![image](https://user-images.githubusercontent.com/26343034/55617532-fe089200-579c-11e9-9d83-068cb15f2def.png)
- With Apps tab, you can access app records.You can search through data.
![image](https://user-images.githubusercontent.com/26343034/55617665-4e7fef80-579d-11e9-82db-a304609e0956.png)
-Requests tab can only be displayed for users with admin role. User requests are listed on this page. Clicking the Confirm button saves the user. With the Red button the user request is deleted from the list.
![image](https://user-images.githubusercontent.com/26343034/55621615-b0912280-57a6-11e9-8729-a58e7c780bc5.png)