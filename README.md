# You can:

- Run code of the provided languages by uploading a file containing the code.
- There are 3 modes:
  1: Run your code and get output instantly
  2: Run your code after a certain delay (in ms)
  3: Run your code by scheduling it with custom instants that you select
  eg: seconds, minutes, hours, weekdays, months

This is an app made using SvelteKit (its sooo good)

# To run this locally,

- Make sure to have NodeJS and MongoDB installed on your machine.
- (you can alternatively use your MongoAtlas URI instead of installing MongoDB locally)
- Clone this repo and inside the root, change the name of sample.env to .env
- (Init you can modify the MONGO_URI and/or JWT_SECRET if you like)
- Open a terminal (root directory as this project) and run "npm i" to install all the required dependencies and then run "npm run dev".
- It shall suggest a URL like "localhost:5173" or similar in the terminal itself. Go there in your browser and enjoy!!!😘

Also, make sure you have the language installed on your local machine of which you'd like the code to run: 
- java: jdk
- python: python
- javascript: nodeJs
- c++: (installed via mingw64)
