- Install express
- Create a server
- Listen to port 3000
- Write request handlers for /test, /
- Install nodemon and update scripts inside package.json
- What are dependacies?
- What is use of "-g" while npm install?
- Difference between caret and tilde(^ vs ~)

- Write login to handle GET,POST,PATCH,DELETE API call and test them on Postman
- Explore routing and use of ?,+,(),* in the routes
- Use of regex in routes /a/     /.*fly$/
- Reading query and params in routes
- Reading dynamic routes
- Multiple route Handlers
- next()
- next function and errors along with res.send()
- What is Middleware? Why do we need it?
- How express js basically handles req behind the scenes
- Differnce between app.use() vs app.all()
- Write dummy auth middle for all routes except /user/login
- Error handling with middleware

- Create cluster on mongoDB
- Connect application to database using <connection URL/devTinder>
- Connect DB before starting server
- Create a userSchema & userModel
- Add express.json middleware to your app
- Make signup API dynamic to recieve data from end user
- User.findOne with duplicate emailId
- API - get user by email
- API - get user by id
- create delete user API
- Update the user API- patch

- Explore Schema type option from documentation (required,unique,minLength,trim,validate,timeStamps)
- API level data sanitization
- Install validation library and explore its function for password,email,photoUrl etc validation

- Validate data in Signup API
- Install bcrypt package
- Create passwordHash using bcrypt.hash & save user encrypted password to DB
- Create Login API & compare password with the DB and then allow user to login, else throw error

- Install cookie-parser & jsonwebtokenIn
- Create a JWT token in login API and then read from profile APi(GET)
- userAuth Middlewarein profile API and new sendconnectionrequest API
- Set expiry of JWT token and cookies
- Write all the methods which are close to user in userschema methods for the sake of optimization

- Group multiple api under respective routers
- Create route folders for managing auth, profile, request headers
- Create logout, PATCH /profile/edit API, PATCH /profile/password API

- Created a connectionReq schema
- enum properties in schema objects
- Validation is required:- 
  - User should only be able to like the connection or dislike it,not accept or reject it from API
  - Once user1 sent request to user2, then user2 shouldnt send connection back to user1
  - user1 should not be able to send connection req to user1 more than 1
  - we can use  $or: [{}] given by mongoDB to check whether user1->user2 connection already exists
  - Check for user existence in DB,then only request can be made to user
  - user1 should not be able to send connection to himself
- Pre hook middleware with next()
  - it will be called everytime connection is being saved
  - thats the reason it named as pre
  - Its not mandatory to write this at the schema level
- Compound Indexes
- Unique:true create automatically indexed in DB
- unique: true or index: true, both we can do
- we can do it in schema as, schema.index({fromuserid: 1})
- 1 means increasing order and -1 is decreasing order, it will create index for all fromUserId

- Read more info about Compound Indexing from documentation
- Why should we not create unneccessarily indexes in DB?
