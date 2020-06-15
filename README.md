# Lets get started 🥳🥳

  - Base url = https://udeshya-task-manager-app.herokuapp.com
  
# These are the routes you can use 🥰

  - Create a New User = POST /users
  
  - Create a new task for authenticated user = `POST /tasks`
  
  - Get details of the authenticated user = GET `/users/me`
  
  - Get all tasks of authenticated user = `GET /tasks`
  
  - Get single task of user using ID = `GET /tasks/:id`
  
  - Update a user info = `PATCH /users/:id`
  
  - Update a taks using ID = `PATCH /tasks/:id`
  
  - Delete a User account = `DELETE /users/me`
  
  - Delete a task using ID = `DELETE /tasks/:id`
  
  - Login a user = `POST /users/login`
  
  - Logout a user from current device = `POST /users/logout`
  
  - Logout a user from all devices = `POST /users/logoutall`
  
  - Upload profile picture = `POST /users/me/avatar`
  
  - Delete a user's profile picture = `DELETE /users/me/avatar`
  
  - Fetch profile picture of User using ID = `GET /users/:id/avatar`
