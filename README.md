# ChatRoomApp Design

**Description**
An app where users can message eachother via chat rooms.

## App Requirements

**Functional Requirements**
- Create a new chat room and recieve the link to it to share with their friends.
- Join an existing chat room using a room id with a non-empty display name.
- When in a chat room, they should see all messages and members in the chat room.
- Send a message to all users in the chat room.
- Recieve new messages to the connected chat room.
- Leave a chat room.
- be notified when a user enters or leaves a chat room.

**Non-functional Requirements**
- Users should message and member events in real time.
- Chat rooms should be highly available.

## Web pages

**Home Page**
- Users can choose between creating a room or joining a room with a non-empty display name.


**Chat Room Page**
- Displays all messages and members in the room. 
- Allows users to send messages in the room.
- Provides users an option to leave the room (the user will be redirected to the homepage).

## Services

**Application Service**
- Contains the UI.
- Query database through here.

**Key Generation Service**
- Returns a unique id.
- unique ids will be used by the websocket service to distinguish users connected to it.

**Websocket Service**
- keeps track of users in each room.
- connects new users to a room and notifies other users in the room.
- Recieves new messages from connected users. 
- Adds new messages into the message database.
- Sends the new messages in realtime to connected users in the new message's room.
- notifies others in the room when a user leaves.

## Database Structure

**Message Database** contains all messages
- room_id : string
    - id of the room the message belongs to.
- member_id : string
    - id of the message's creator.
- content : string
    - message content.
- time : Date
    - date message was created

**Room Name Database** contains the name of each room
- room_id : string
    - id of the room the name belongs to.
- name : string
    - name of the room.

**Room Members Database** contains members of each room
- room_id : string
    - id of the room the the members are connected to
- member_id : string
    - id of a member of the room.
- name : string
    - display name of the member with ${member_id}.

## API Design

### Home Page API

room_name : string
- name of the room the user wishes to create.

update_room_name(new_name)
- Description:
    - updates the room name the user wishes to create
- Parameters:
    - new_name : name of the room the user wishes to create.

creating_room : boolean
- True if a room is currently being created.

create_room(room_name)
- Description:
    - called when the user attempts to create a room.
- Parameters:
    - room_name : Name of the room the user wishes to create.
- Exceptions:
    - EMPTY_ROOM_NAME : user attempts to create a room with an empty room name.
    - ID_GENERATION_FAIL : could not create a room id.
    - DATABASE_WRITE_FAIL : room not created because could not write to database.

created_room_id : string
- Description:
    - the latest id of a room the user created with create_room(room_name).
    - Variable is empty if the user has not created a room yet.

room_id : string
- Description:
    - Id of the room the user wishes to join.

update_room_id(new_id)
- Description:
    - updates the id of the room the user wishes to join.
- Parameters:
    - new_id : id of the room the user wishes to join.

display_name : string
- Description:
    - name the user wishes to be reffered by in the room they wish to join.

update_display_name(new_name)
- Description:
    - updates the name the user wishes to use when they join a room.
- Parameters:
    - new_name : name that the user wishes to use in the room they want to join.

joining_room : boolean
- true if the user is in the process of joining a room.

join_room(room_id, display_name)
- Description:
    - attempts to join room room_id if successful navigates to room_id's page with display_name as the user's name.
- Exceptions:
    - EMPTY_ROOM_ID : attempted to join a room with no room id.
    - ROOM_ID_DNE : attempted to join a room that does not exist.
    - EMPTY_DISPLAY_NAME : attempted to join a room with no display name.

error_flag : object
- Description:
    - contains all exceptions as booleans.

Exceptions (values can be accessed):
- EMPTY_ROOM_NAME : user attempts to create a room with an empty room name.
- ID_GENERATION_FAIL : could not create a room id.
- DATABASE_WRITE_FAIL : room not created because could not write to database.
- EMPTY_DISPLAY_NAME : attempted to join a room with no display name.
- EMPTY_ROOM_ID : attempted to join a room with no room id.
- ROOM_ID_DNE : attempted to join a room that does not exist.

### Chat Room Page API

leave()
- navigates user back to the home page.

connecting : boolean
- True if the user is connecting to the chat room.

connected : boolean
- True if the user is connected to the chat room, false if not.

room_name : string
- name of the room

username : string
- name of the user

user_id : string
- unique id of the user to differentiate from other similar named users

messages : array
- array of all messages in chat room with format [ object{user_id, content, name, timeStamp}, ..]

members : array
- array of all members in the room with format [ object{user_id, name}, ...]

message : string
- message the user wishes to send to other users in the chat room.

update_message(new_message)
- Description:
    - updates the message the user wishes to send to the other users in the chat room.
- Parameters:
    - new_message : message the user wishes to send.

send_message(message)
- Description:
    - sends a message to the other users in the chat room
- Parameters:
    - message : message the user wishes to send
- Exceptions:
    - EMPTY_MESSAGE : user attempted to send an empty message

Exceptions (values can be accessed):
- NO_ROOM_ID_ERROR : room id not included in url parameter.
- NO_NAME_ERROR : display name not included in url parameter.
- USER_SIGN_OUT_ERROR : true when user logs out of their anonymous account. This should never happen. 
- NO_ROOM_NAME_ERROR : room's name is not in database.
- ROOM_NAME_DB_ERROR : cannot access room's names database.
- MESSAGE_LISTENER_ERROR : cannot recieve NEW_MESSAGE events.
- MEMBERS_LISTEN_ERROR : cannot recieve USER_LEFT and NEW_USER events.

### Global API
room_exists(room_id) : boolean
- Description:
    - Checks if room with room_id exists.
- Returns:
    - True if the room exists false otherwise.


## Tech Stack

**React**
- UI.

**React Router**
- to serve single page apps.

**Firebase Authentication** (Acts as a key generation service)
- Users will be logged in anonymously and automatically to get a unique id to act as a member id.

**Firebase firestore database/room_members/room_id/members/** (Also acts as a websocket service)
- Contains members currently in each room.
- Query Database to get a list of members in the room that the user is in.
- Connect a listener to this database to listen for USER_LEFT and NEW_USER Events (websocket service ability).
- When a user connects to this database a NEW_USER event should be emitted (websocket service ability).
- When a user disconnects from this database a USER_LEFT event should be emitted (websocket service ability).

**Firebase firestore database/messages/room_id/messages/** (Also acts as a websocket service)
- Contains all messages of each room.
- Query database to get old messages of the room the user is in.
    - can cache old messages to save on bandwidth if the user enters the room a subsequent time.
- Connect a listener to this database to listen for NEW_MESSAGE events (websocket service ability).

**Firebase firestore database/room_names/room_id**
- Query database to get the name of the room that the user is currently in.

