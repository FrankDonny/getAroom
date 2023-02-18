function func1(event) {
    let searchInput = document.querySelector('#search-field-resp').value;
    if (searchInput.trim() === "") {
        event.preventDefault();
        alert("Input required")
        return
    }
    event.preventDefault();

    const csrfToken = document.querySelector('#csrf').value;
    $.ajax({
        type: "POST",
        url: "/search",
        data: { 'search': searchInput },
        headers: { "X-CSRFToken": csrfToken },
        success: function (response) {
            const results = document.querySelector("#results");
            function create() {
                for (let item of response) {
                    const itemUserImg = document.createElement('div');
                    itemUserImg.setAttribute("class", "searchitemUserImg");
                    itemUserImg.innerHTML = `<img src="/static/images/${item['profileImg']}" alt="Profile_Img" class="searchusrImg">`;

                    const userName = document.createElement('div');
                    userName.setAttribute("class", "searchuserName");
                    userName.innerHTML = `&#64;${item['userName']}`;

                    const userImage = document.createElement('div');
                    userImage.setAttribute("class", "searchuserImage");
                    userImage.append(itemUserImg, userName);

                    const roomName = document.createElement('div');
                    roomName.setAttribute("class", "searchroomName");
                    roomName.innerHTML = `<p>&ldquo;${item['roomName']}&rdquo;</p>`;

                    const roomNameDate = document.createElement('div');
                    roomNameDate.setAttribute("class", "searchroomNameDate");
                    roomNameDate.appendChild(roomName);

                    const group = document.createElement('div');
                    group.setAttribute("class", "searchgroup");
                    group.append(userImage, roomNameDate);

                    const roomDescription = document.createElement('div');
                    roomDescription.setAttribute("class", "searchroomDescription");
                    roomDescription.innerHTML = `${item['roomDescription']}`;

                    let contain = []

                    if (item['creator_id'] == item['me']) {
                        const btnBox = document.createElement('div');
                        btnBox.setAttribute("class", "searchbtnBox");
                        btnBox.innerHTML = `<a href="/chatroom/${item['me'].slice(0, 13)}/${item['roomID']}"><button class="searchBtn">Join</button></a>`;

                        const deleteBtn = document.createElement('div');
                        deleteBtn.setAttribute("class", "searchdeleteBtn");
                        deleteBtn.innerHTML = `<form method="POST" action="">
                    <input type="hidden" name="csrf_token" value="${csrfToken}">
                    <input type="hidden" name="roomID" value="${item.roomID}">
                    <a href=""><button class="searchBtn">Delete</button></a></form>`;

                        contain.push(btnBox);
                        contain.push(deleteBtn);
                    } else {
                        const btnBox = document.createElement('div');
                        btnBox.setAttribute("class", "searchbtnBox");
                        btnBox.innerHTML = `<a href="/chatroom/${item['me'].slice(0, 13)}/${item['roomID']}"><button class="searchBtn">Join</button></a>`;
                        contain.push(btnBox);
                    }

                    const itemBottom = document.createElement('div');
                    itemBottom.setAttribute("class", "searchitemBottom");
                    itemBottom.append(roomDescription, ...contain);

                    const itemEle = document.createElement('div');
                    itemEle.setAttribute("class", "searchitem");
                    itemEle.append(group, itemBottom);

                    results.appendChild(itemEle);
                }
            }
            if (results.innerHTML !== "") {
                results.innerHTML = "";
                create();
            } else {
                create();
            }
        }
    });
    const search = document.querySelector('#searchSidebar');
    search.style.transform = "translateX(0)";
}

function func(event) {
    let searchInput = document.querySelector('#search-field').value;
    if (searchInput.trim() === "") {
        event.preventDefault();
        alert("Input required")
        return
    }
    event.preventDefault();

    const csrfToken = document.querySelector('#csrf').value;
    $.ajax({
        type: "POST",
        url: "/search",
        data: { 'search': searchInput },
        headers: { "X-CSRFToken": csrfToken },
        success: function (response) {
            const results = document.querySelector("#results");
            function create() {
                for (let item of response) {
                    const itemUserImg = document.createElement('div');
                    itemUserImg.setAttribute("class", "searchitemUserImg");
                    itemUserImg.innerHTML = `<img src="/static/images/${item['profileImg']}" alt="Profile_Img" class="searchusrImg">`;

                    const userName = document.createElement('div');
                    userName.setAttribute("class", "searchuserName");
                    userName.innerHTML = `&#64;${item['userName']}`;

                    const userImage = document.createElement('div');
                    userImage.setAttribute("class", "searchuserImage");
                    userImage.append(itemUserImg, userName);

                    const roomName = document.createElement('div');
                    roomName.setAttribute("class", "searchroomName");
                    roomName.innerHTML = `<p>&ldquo;${item['roomName']}&rdquo;</p>`;

                    const roomNameDate = document.createElement('div');
                    roomNameDate.setAttribute("class", "searchroomNameDate");
                    roomNameDate.appendChild(roomName);

                    const group = document.createElement('div');
                    group.setAttribute("class", "searchgroup");
                    group.append(userImage, roomNameDate);

                    const roomDescription = document.createElement('div');
                    roomDescription.setAttribute("class", "searchroomDescription");
                    roomDescription.innerHTML = `${item['roomDescription']}`;

                    let contain = []

                    if (item['creator_id'] == item['me']) {
                        const btnBox = document.createElement('div');
                        btnBox.setAttribute("class", "searchbtnBox");
                        btnBox.innerHTML = `<a href="/chatroom/${item['me'].slice(0, 13)}/${item['roomID']}"><button class="searchBtn">Join</button></a>`;

                        const deleteBtn = document.createElement('div');
                        deleteBtn.setAttribute("class", "searchdeleteBtn");
                        deleteBtn.innerHTML = `<form method="POST" action="">
                    <input type="hidden" name="csrf_token" value="${csrfToken}">
                    <input type="hidden" name="roomID" value="${item.roomID}">
                    <a href=""><button class="searchBtn">Delete</button></a></form>`;

                        contain.push(btnBox);
                        contain.push(deleteBtn);
                    } else {
                        const btnBox = document.createElement('div');
                        btnBox.setAttribute("class", "searchbtnBox");
                        btnBox.innerHTML = `<a href="/chatroom/${item['me'].slice(0, 13)}/${item['roomID']}"><button class="searchBtn">Join</button></a>`;
                        contain.push(btnBox);
                    }

                    const itemBottom = document.createElement('div');
                    itemBottom.setAttribute("class", "searchitemBottom");
                    itemBottom.append(roomDescription, ...contain);

                    const itemEle = document.createElement('div');
                    itemEle.setAttribute("class", "searchitem");
                    itemEle.append(group, itemBottom);

                    results.appendChild(itemEle);
                }
            }
            if (results.innerHTML !== "") {
                results.innerHTML = "";
                create();
            } else {
                create();
            }
        }
    });
    const search = document.querySelector('#searchSidebar');
    search.style.transform = "translateX(0)";
}

document.querySelector('#search-field').addEventListener('keypress', (event) => {
    if (event.which === 13) {
        func(event);
    }
})

function returnBtn(arg) {
    const box = document.querySelector(arg);
    box.style.transform = "translateX(-130%)";

    if (arg === "#searchSidebar") {
        const searchInput = document.querySelector('#search-field');
        const results = document.querySelector("#results");
        results.innerHTML = "";
        searchInput.value = "";
    }
    box.style.boxShadow = "none";
}

const btn = document.getElementById('create');
btn.addEventListener('click', () => {
    const formDiv = document.getElementById('createRoomForm');
    const formDiv1 = document.getElementById('updateRoomForm');
    if (formDiv.style.display === 'block') {
        formDiv.style.display = 'none';
    } else {
        formDiv.style.display = 'block';
        if (formDiv1.style.display === 'block') {
            formDiv1.style.display = 'none'
        }
    }
})

const btn1 = document.getElementById('update');
btn1.addEventListener('click', () => {
    const formDiv = document.getElementById('updateRoomForm');
    const formDiv1 = document.getElementById('createRoomForm');
    if (formDiv.style.display === 'block') {
        formDiv.style.display = 'none';
    } else {
        formDiv.style.display = 'block';
        if (formDiv1.style.display === 'block') {
            formDiv1.style.display = 'none'
        }
    }
})

function clicked() {
    const nav = document.querySelector('.nav-list-resp');
    if (nav.style.display === 'flex') {
        document.querySelector('header').style.borderBottom = '#001532 solid 1px';
        nav.style.display = 'none';
    } else {
        document.querySelector('header').style.border = 'none';
        nav.style.display = 'flex';
    }
}

function click1(args) {
    const box = document.querySelector(args);
    box.style.transform = "translateX(0)";
}

function click3() {
    const hideSearch = document.querySelector('#search-box-resp');
    if (hideSearch.style.display === 'grid') {
        hideSearch.style.display = 'none';
    } else {
        hideSearch.style.display = 'grid';
    }
}

const show = document.querySelector('#inner');
textBody = document.querySelector('#review div');
show.addEventListener('click', () => {
    console.log('clicked...')
    if (textBody.style.display === 'block') {
        textBody.style.display = 'none';
    } else {
        textBody.style.display = 'block';
    }
    const sideSect = document.querySelector('#sideSection')
    sideSect.scrollTop = sideSect.scrollHeight;
})

const buttonSend = document.querySelector("#reviewInput");
buttonSend.addEventListener('keypress', (event) => {
    if (event.which === 13 && buttonSend.value.trim("") === "") {
        event.preventDefault();
        alert("No input was given");
        return;
    }
    if (event.which === 13) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: `/rooms/${current_userID.slice(0, 13)}`,
            data: { 'reviewText': buttonSend.value },
            headers: { 'X-CSRFToken': csrf_token },
            success: (response) => {
                buttonSend.style.border = "1px solid #8dca24";
                newDiv = document.createElement("div");
                newDiv.style.height = "auto";
                newDiv.style.width = "100%"
                newDiv.style.backgroundColor = "#dff0d8";
                newDiv.style.color = "#3c763d"
                newDiv.style.border = "2px solid #d6e9c6";
                newDiv.style.borderRadius = "5px";
                newDiv.style.textAlign = "center";
                newDiv.innerText = response;
                theDiv = document.querySelector("#review");
                theDiv.append(newDiv)
                const sideSect = document.querySelector('#sideSection')
                sideSect.scrollTop = sideSect.scrollHeight;
            }
        })
    }
})


// const options = {
//     method: 'GET',
//     headers: {
//         'X-RapidAPI-Key': '60c140c743msh2b6d5a90b4bf32ap1f4f00jsn1fdb2eb0dbde',
//         'X-RapidAPI-Host': 'ajith-holy-bible.p.rapidapi.com'
//     }
// };

// fetch('https://ajith-holy-bible.p.rapidapi.com/GetBooks', options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));
