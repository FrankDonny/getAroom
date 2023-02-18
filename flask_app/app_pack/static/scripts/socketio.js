let socket = io();

function joinRoom() {
    // socket.emit('join', {'name': current_userName, 'room_id': `${theRoom[5].slice(0, 37)}`});
}

function exitRoom() {
    // console.log('exiting the room...')
    const theRoom = location.href.split('/');
    $.ajax({
        type: 'POST',
        url: `/chatroom/${current_userID.slice(0, 13)}/${theRoom[5].slice(0, 37)}`,
        data: { 'user_id': current_userID, 'room_id': theRoom[5].slice(0, 37), 'one': 'one' },
        headers: { 'X-CSRFToken': csrf_token },
        success: () => {
            // socket.emit('leave', {'name': current_userName, 'room_id': `${theRoom[5].slice(0, 37)}`});
            window.location.href = `/rooms/${current_userID.slice(0, 13)}`;
        },
        error: (error) => {
            console.log(error);
        }
    })
}

socket.on('message', function (data) {
    if (location.href.includes(data['room_id'])) {
        const messageUser = document.createElement('div');
        if (location.href.includes(data['user_id'].slice(0, 13))) {
            messageUser.setAttribute("class", "messageUser");
            messageUser.innerText = 'You';
        } else {
            messageUser.setAttribute("class", "otherUser");
            messageUser.innerText = data['userName'];
        }

        const messageCreated = document.createElement('div');
        const date = new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
        messageCreated.setAttribute("class", "messageCreated");
        messageCreated.innerHTML = `<small>&#8226; ${date}</small>`

        const deleteDiv = document.createElement('div');
        if (location.href.includes(data['user_id'].slice(0, 13))) {
            deleteDiv.style.display = "inline-block";
            deleteDiv.innerHTML = `<input type="hidden" name="roomID" value="${data['room_id']}">
                                <a href="/delete-message/${data['messageID']}">
                                    &#124; <i class="fa-solid fa-trash-arrow-up" id="delete"></i>
                                </a>`
        }

        const userStyle = document.createElement('div');
        userStyle.setAttribute('class', 'userStyle');
        const messageStyle = document.createElement('div');
        messageStyle.setAttribute('class', 'messageStyle');
        if (location.href.includes(data['user_id'].slice(0, 13))) {
            userStyle.append(messageUser, messageCreated, deleteDiv)
        } else {
            messageStyle.append(messageUser, messageCreated)
        }

        const textBody = document.createElement('div');
        textBody.style.display = "table-cell";
        textBody.style.verticalAlign = "middle";
        textBody.style.paddingLeft = "10px";
        textBody.style.paddingRight = "10px";
        textBody.style.height = "auto";
        textBody.style.color = "white";
        textBody.innerText = `${data['text']}`;

        if (location.href.includes(data['user_id'].slice(0, 13))) {
            const userMessage = document.createElement('div');
            userMessage.setAttribute('class', 'userMessage');
            userMessage.append(userStyle, textBody);

            const messages = document.querySelector("#messages");
            messages.append(userMessage);
        } else {
            const message = document.createElement('div');
            message.setAttribute('class', 'message');
            message.append(messageStyle, textBody);

            const messages = document.querySelector("#messages");
            messages.append(message);
        }

        const chatBox = document.getElementById("messages");
        chatBox.scrollTop = chatBox.scrollHeight;
    }
})

const button = document.querySelector("#textBoxID");
button.addEventListener('keypress', (event) => {
    if (event.which === 13) {
        event.preventDefault();
        sendMsg();
    }
})

const sendit = document.querySelector("#sendMsg");
sendit.onclick = function (event) {
    event.preventDefault();
    sendMsg();
}

function sendMsg() {
    const check = document.querySelector("#textBoxID").value;
    if (check.trim() === "") {
        alert("Input is required");
        return;
    }
    const urlSplit = location.href.split('/');
    const userData = document.getElementById("user-data");
    const userId = userData.dataset.userId;
    const userName = document.querySelector('#sendUser');
    data = {
        'text': document.querySelector("#textBoxID").value,
        'user_id': userId, 'room_id': urlSplit[5].split('?')[0],
        'created_at': Date(), 'userName': userName.value
    }
    socket.send(data);
    button.value = "".trim();
}
