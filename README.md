# appsheet-people-app

## Pre-requisites:
1/ You will need to install node 10.16.x or above. Run the following command to verify what version you have:

```
$ node -v
v10.16.2
```
I'm using 10.16.2 for my development.

2/ Run ```npm install``` in the project root folder to download all depedent node modules.

3/ Run the functional tests to make sure your setup is in a good state:

```
npm test
```

## Running the app
To run the app, inside the root repo folder, execute the followign command:
```
$ npm start --youngest=5
```

This will find the youngest 5 persons with a valid US number sorted by name. The results will be printed in the console in JSON format under the line "Youngest 5 people with a valid US number".

## Application design

The application is composed of 2 layers:
* Data layer - in the folder / namespace dataLayer. Contains the PeopleClient class encapsulating the API calls to the People API's list and details endpoint. The PeopleClient returns instances of the PeopleListResult and PersonDetailResult for the parsed responses from the list and detail endpoints respectively.

* Business Layer - it uses the data layer to fetch data and apply business rules on top of the data. FetchAllPeopleWithDetails knows how to fetch the people with details in a cursor using JavaScript's asynchronous iterators (the fetchAllPeopleIter method). FindYoungestWithUSPhoneIterator class on the other hand uses the async generator from FetchAllPeopleWithDetails and applies filters on top - isUsPhoneNumber() and further only keeps the youngest X people at any time.

Below are some additional folders and their purpose:

* config - the config folder contains the app configuration data such as the base url to the People API

* common - contains the common modules for the app. One such is the logging module (winston) that is used throughout the app.

## How the design of the end-to-end service + app should change if the dataset were three orders of magnitude larger

The current People API is pretty chatty with passing in the token for every page to read. If the dataset is three orders of magnitude larger (that is 1,000 larger), obviously that will mean 100 calls to /list endpoint and then assuming the page size remains 10 ids, that will result in 30,000 API calls for the details endpoint. In such cases, I'd suggest to modify the service to apply this filtering (youngest X and having valid us phone) as close to the data as possible. One concrete solution will be to implement the People API as GraphQL API which is allows for such filtering and response schema selection as close to the data as possible. 
