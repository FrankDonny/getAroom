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


const show1 = document.querySelector('#innerr')
const theBdy = document.querySelector('#revDiv')
show1.addEventListener('click', () => {
    if (theBdy.style.display === 'flex') {
        theBdy.style.display = 'none';
    } else {
        theBdy.style.display = 'flex';
    }
})

const sendBtn = document.querySelector('#sendReview');
const reviewTextField = document.querySelector('#reviewTextField');
sendBtn.addEventListener('click', (event) => {
    if (reviewTextField.value.trim("") === "") {
        event.preventDefault();
        alert("No input was given");
        return;
    }
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: `/rooms/${current_userID.slice(0, 13)}`,
        data: { 'reviewText': reviewTextField.value },
        headers: { 'X-CSRFToken': csrf_token },
        success: (response) => {
            buttonSend.style.border = "1px solid #8dca24";
            newDiv = document.createElement("div");
            newDiv.style.height = "auto";
            newDiv.style.width = "100%";
            newDiv.style.backgroundColor = "#dff0d8";
            newDiv.style.color = "#3c763d";
            newDiv.style.border = "2px solid #d6e9c6";
            newDiv.style.textAlign = "center";
            newDiv.style.marginBottom = "10px";
            newDiv.innerText = response;
            theDiv = document.querySelector("#reviewSidebar");
            theDiv.append(newDiv);
        }
    })
})

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

const bibleArray = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel",
    "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms",
    "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea",
    "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
    "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"]

const bibleObject = {
    "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34, "Joshua": 24, "Judges": 21, "Ruth": 4, "1 Samuel": 31,
    "2 Samuel": 24, "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, "Ezra": 10, "Nehemiah": 13, "Esther": 10, "Job": 42, "Psalms": 150,
    "Proverbs": 31, "Ecclesiastes": 12, "Song of Solomon": 8, "Isaiah": 66, "Jeremiah": 52, "Lamentations": 5, "Ezekiel": 48, "Daniel": 12, "Hosea": 14,
    "Joel": 3, "Amos": 9, "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3, "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4,
    "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16, "1 Corinthians": 16, "2 Corinthians": 13, "Galatians": 6, "Ephesians": 6,
    "Philippians": 4, "Colossians": 4, "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, "Titus": 3, "Philemon": 1,
    "Hebrews": 13, "James": 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, "Jude": 1, "Revelation": 22
}

function fetchData() {
    const rand = Math.floor(Math.random() * bibleArray.length);
    const randChap = Math.floor(Math.random() * bibleObject[bibleArray[rand]]) + 1;
    let randVerse = 0;
    if (bibleArray[rand] === "Psalm" && randChap === 119) {
        randVerse = Math.floor(Math.random() * 176) + 1;
    } else {
        randVerse = Math.floor(Math.random() * 72) + 1;
    }

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '60c140c743msh2b6d5a90b4bf32ap1f4f00jsn1fdb2eb0dbde',
            'X-RapidAPI-Host': 'ajith-holy-bible.p.rapidapi.com'
        }
    };

    fetch(`https://ajith-holy-bible.p.rapidapi.com/GetVerseOfaChapter?Book=${bibleArray[rand]}&chapter=${randChap}&Verse=${randVerse}`, options)
        .then(response => response.json())
        .then(response => {
            if (response.Output === "Wrong slection!!! Please try again.") {
                fetchData();
            } else {
                const bcv = document.querySelector('#bcv');
                bcv.innerText = `${response.Book} ${response.Chapter} : ${response.Verse}`;
                const output = document.querySelector('#output');
                output.innerText = "";
                output.innerText = response.Output;
            }
        })
        .catch(err => {
            console.error(`Could not get the required data. Retrying...: ${err}`);
        });
}

fetchData();


