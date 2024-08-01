# Front End

Install the dependencies and run the front end

```cmd
cd front-end
yarn
```

Create the env file by renaming the .env.temp into .env
This .env contains all the URL we need to connect to the backend server

Now run the front end

```cmd
yarn start
```

## FrontEnd Folder Structure

```bash
├───public
└───src
    ├───assets
    ├───components ---> Common components
    ├───hooks ---> Custom hooks for the project
    ├───layout ---> Layout of the page
    ├───models ---> Interface of data getting from the backend
    ├───pages ---> Main page of the project
    ├───routes ---> Define all routes of the project
    ├───section ---> Define children of each page
    │   ├───auth
    │   │   └───login
    │   ├───employee
    │   ├───message
    │   └───tasks
    ├───services ---> API method for connecting to the backend
    ├───store ---> Contain reduxJS store
    │   └───reducer
    ├───style ---> CSS, SCSS styling
    │   └───layout
    └───utils ---> Common function using in the project
```
