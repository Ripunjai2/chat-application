const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id == id;
    })
    if(!user){
        return 'No user with such id exists';
    }
    return user;
}

const getUsersInRoom=(room)=>{
    const usersInRoom=users.filter((user)=>{
        return user.room==room;
    })
    return usersInRoom;
}



// addUser({
//     id: 22,
//     username: 'Ripunjai  ',
//     room: 'xxx'
// })

// addUser({
//     id: 23,
//     username: 'Aman ',
//     room: 'xxx'
// })

// addUser({
//     id: 27,
//     username: 'Divya ',
//     room: 'xxx'
// })


// addUser({
//     id: 22,
//     username: 'Ankita ',
//     room: 'aaa'
// })

// const res=getUser(27)
// console.log(res)

//const removedUser = removeUser(22)

//console.log(removedUser)

// const res=getUsersInRoom('xxx');
// console.log(res);

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}