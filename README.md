# ChatRoomApp Design

**Description**
An app where users can message eachother via chat rooms.

## App Requirements

**Functional Requirements**
- Create a new chat room and recieve the link to it to share with their friends.
- Join an existing chat room by a room link with a non-empty display name.
- Leave a chat room.
- When a user joins a chat room they should see all past messages of a chat room.
- Send a message to all users in a chat room.
- Recieve new messages to the connected chat room.
- Recieve a list of all members in the chat room.
- Recieve an updated list when a user leaves or a new user enters the chat room.

**Non-functional Requirements**
- Users should recieve new message events in real time.
- Chat rooms should be highly available.

## Web pages

**Home Page**
- Users can choose between creating a room or joining a room.
- If the user attempts to create a room:
    - If the room is created a room link, linking to the newly created room, will be displayed to the user.
    - If the room fails to be created an appropriate error message will be displayed.
- If the user attempts to join a room:
    - If the user can join the room, the user is navigated to the chat room page with their handle name and room link as parameters.
    - If the user cannot join the room an appropriate error message will be displayed.

**Chat Room Page**
- Displays all messages and members in the room. 
- Provides users an option to leave the room (the user will be redirected to the homepage).
- If the user could not connect to the room the user is redirected to the home page.

## Services

**Application Service**
- Contains the UI.

**Key Generation Service**
- Returns a unique id.
- unique ids will be used by the websocket service to distinguish users connected to it.

**Websocket Service**
- connects users to a room.
- Recieves new messages from connected users. 
- Adds new messages into the message database.
- Sends the new messages in realtime to connected users in the new message's room.
- When a user connects or disconnects with a room, the service notifies the other members.

## Database Structure

**Message Database**
    rooms : {
        room1 : {
            messages : {
                message1: {
                    username: name,
                    content: message,
                    timestamp: time,
                },
                message2: {
                    ..
                },
                ...
            }
        },
        room2 : {
            ...
        },
        ...
    }

**Room Members Database**
    rooms : {
        room3 : {
            members : {
                member1Id : displayName,
                member2Id : displayName,
                member3Id : displayName,
                ....
            }
        },
        room4 : {
            ...
        },
        ...
    }


## Tech Stack

**React**
- react-router will be used to serve single-page apps.

**Firebase Authentication** (Acts as a key generation service)
- User will be logged in anonymously and automatically to get a unique id to act as a key in the room members database.

**Firebase realtime database** (Also acts as a websocket service)
- Contains members currently in each room.
- Connect a listener to this database to listen for USER_LEFT and NEW_USER Events.
- When the listener connects it will return a list of all the users in the room.
- When a new user enters or a user leaves the room, the database will be updated sending the new list to user's listening (equivalent to a NEW_USER or USER_LEFT event).
- An onDisconnect() routine will remove the user from the room when he or she leaves (equivalent to emitting a USER_LEFT event to the other users).

**Firebase firestore** (Also acts as a websocket service)
- Contains all messages of each room.
- Connect a listener to listen for NEW_MESSAGE events.
- First call to the listener returns all the old messages in the room (equivalent to querying for past messages), subsequent calls will return a new message.
    - Can cache old messages to save on bandwidth when entering the room a subsequent time.

# Additional

## Stateless Components

### Home (Ui for Home Page)
**Props**

create_room(roomName)
    - called when the user attempts to create a room.

room_link: String
    - non-empty when create_room() succeeded previously. 

roomError: String
    - non-empty when create_room() fails.

set_name(name)
    - updates user's room name.

name : String
    - contains user's current room choice name.

-nameError:
    - non-empty when set_name() fails.


### Chat Room (Ui for chat room page)
**Props**

room_name : String
    - room the user is connected to.

name : String
    - name the user chose to be reffered to.

members : List of strings
    - array of all members in the room including the user with format [name1, name2, name3].

messages : List of objects
    - array of all messages in the room with format [{username, content, timestamp}, ...].

leave_room():
    - called when user wishes to leave the room.

## Stateful Components

### Global Context
**state**

room_exists(room)
- Returns true if the room exists.
- for the home page, it determines if a user can join a room.
- for the chat room page, it determines if the room is valid.

name : String
- The name the user chooses in the home page to be displayed in the chat room page.

### Home Controller

create_room(roomName)
- Returns an object containing the room link or an appropriate error message.
- Format: {room, isSuccess, error}
- if isSuccess is true the roomLink will contain the newly created room else the error variable will contain the error message.

### Chat Room Controller

connect_to_room(roomName, username)
- Requires room_exists to return true and username to be non-empty.
- Gets past messages, and members in a room.
- Connects with websocket server to listen for NEW_USER, USER_LEFT, NEW_MESSAGE events and updates members and messages variables appropriately.
- Installs an onDisconnect listener with the websocket server to emit a USER_LEFT event when the user disconnects.

members : List of strings
- Array of members in the room, kept up to date by the listener that listens for NEW_USER and USER_LEFT events.

messages : List of objects
- Array of messages in the room, kept up to date with the listener that listens for NEW_MESSAGE events.

send_message(roomName, username, message)
- Requires the user to be a member in the room with their chosen room name equal to the username.
- Send a new message to a room.

leave_room()
- Returns user to home page.




