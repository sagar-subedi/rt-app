const socket = io()

const {username, room} = Qs.parse(location.search,
    {ignoreQueryPrefix: true}
    );

console.log(username, room);

const chatBox = document.querySelector(".chat-messages")
const form = document.querySelector("#chat-form");
const roomName = document.getElementById("room-name")
const roomUsers = document.getElementById("users")

socket.emit('joinRoom', {username, room});

socket.on('message', message => {
   displayMessage(message)

   chatBox.scrollTop = chatBox.scrollHeight; 

})

socket.on('roomUsers', ({room, users}) =>{
    console.log(users);
    console.log(room);
     displayRoomName(room);
     displayRoomUsers(users);
} )



form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    console.dir(e.target.elements.msg.value);
    
    socket.emit("chat-message", msg);
    
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function displayMessage(message){
    //add the message as an element in DOM
    //first let's create a div and set it's class as message
    //add it as a child to the .chat-message wala div

    let msg = document.createElement("div");
    msg.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>`;
    msg.classList.add("message");
    chatBox.appendChild(msg);

}


function displayRoomName(room){
    roomName.innerText = room;
}

function displayRoomUsers(users){
    roomUsers.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join(" ")}
    `;
}