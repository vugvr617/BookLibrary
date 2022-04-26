const addBookBut = document.querySelector('#addBookBut');
const choiceDiv = document.querySelector('#choiceDiv');
const hr = document.querySelector('#hr');
const manualForm = document.querySelector('#manualForm');
const manualAddDiv = document.querySelector('#manualAddDiv');
const bookNameManual = document.querySelector('#bookName');
const bookAuthorManual = document.querySelector('#bookAuthor');
const bookPagesManual = document.querySelector('#bookPages');
const bookCompManual = document.querySelector('#bookCompleted');
const addedBooksDiv = document.querySelector('#addedBooks-div');
const headerDiv = document.querySelector('#header');
const cancelBut = document.querySelector('#cancelBut');
const errorDiv = document.querySelector('#errorDiv');
const searchForm = document.querySelector('#searchForm');
const searchDiv = document.querySelector('#searchDiv');

function Book(title, author, pages, isRead) {
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
}

const createNewBook = (givenBook) => {
    let htmlOfDiv = '';
    let newBookDiv = document.createElement('div');
    let newFieldset = document.createElement('fieldset');

    newBookDiv.className = 'newBookDiv';
    htmlOfDiv = `
        <legend><span>${givenBook.title}</span></legend>
        <p>Author: ${givenBook.author} </p>
        <p>Pages: ${givenBook.pages} </p>
        `;

    newBookDiv.innerHTML = htmlOfDiv;
    newFieldset.append(newBookDiv);
    let buttonBookDiv = document.createElement('div');
    buttonBookDiv.className = 'button-book-div';
    if (givenBook.isRead == false) {
        var isReadBut = document.createElement('button');
        isReadBut.className = 'isRead';
        isReadBut.innerText = 'Not completed';
        buttonBookDiv.append(isReadBut);
    } else {
        var isReadBut = document.createElement('button');
        isReadBut.className = 'isRead';
        isReadBut.innerText = 'Completed';
        buttonBookDiv.append(isReadBut);
    }
    const deleteBut = document.createElement('button');

    deleteBut.className = 'delete-but';
    deleteBut.innerText = 'Delete';
    newBookDiv.append(buttonBookDiv);
    newBookDiv.append(deleteBut);
    addedBooksDiv.append(newFieldset);

    function deleteFunction(e) {
        let deleting = e.target.parentElement.parentElement;
        let bookTitle = e.target.parentElement.children[0].children[0].textContent;
        let bookArray = JSON.parse(localStorage.getItem('bookArray'));
        for (let i = 0; i < bookArray.length; i++) {
            if (bookArray[i].title == bookTitle) {
                bookArray.splice(i, 1);
            }
        }
        deleting.remove();
        addToLocalStorage(bookArray);
    }
    const allDeleteBut = document.querySelectorAll('.delete-but');
    allDeleteBut.forEach(btn => btn.addEventListener('click', deleteFunction));
    const allIsReadBut = document.querySelectorAll('.isRead');
    const changeRead = (e) => {
        let bookArray = JSON.parse(localStorage.getItem('bookArray'))
        let changing = e.target.parentElement.parentElement.parentElement;
        let bookTitle = e.target.parentElement.parentElement.children[0].children[0].textContent;
        if (e.target.innerText == 'Not completed') {
            e.target.innerText = 'Completed';
            for (let i = 0; i < bookArray.length; i++) {
                if (bookArray[i].title == bookTitle) {
                    bookArray[i].isRead = true;
                    addToLocalStorage(bookArray);
                }
            }
        } else {
            e.target.innerText = 'Not completed';
            for (let i = 0; i < bookArray.length; i++) {
                if (bookArray[i].title == bookTitle) {
                    bookArray[i].isRead = false;
                    addToLocalStorage(bookArray);
                }
            }
        }
    }
    allIsReadBut.forEach(btn => btn.addEventListener('click', changeRead))
};

let bookArray = [];

const pageStart = () => {
    bookArray = JSON.parse(localStorage.getItem('bookArray'));
    if (bookArray != null) {
        bookArray.forEach(book => {
            createNewBook(book);
        })
    } else {
        bookArray = [];
    }
}

pageStart();

const userShowChoice = () => {
    manualForm.style.display = 'flex';
}

const addBookEvents = () => {
    manualAddDiv.style.display = 'block';
    addedBooksDiv.style.filter = 'blur(7px)';
    header.style.filter = 'blur(7px)';
    hr.style.filter = 'blur(7px)';
}

const cancelFunc = () => {
    manualAddDiv.style.display = 'none';
    addedBooksDiv.style.filter = 'blur(0px)';
    header.style.filter = 'blur(0px)';
    hr.style.filter = 'blur(0px)';
}

const addToLocalStorage = (param) => {
    localStorage.setItem('bookArray', JSON.stringify(param));
}

const manualBookSubmited = (e) => {
    e.preventDefault();
    if (bookNameManual.value && bookAuthorManual.value && bookPagesManual.value) {
        const newBook = new Book(bookNameManual.value, bookAuthorManual.value, bookPagesManual.value, false);
        bookArray.push(newBook);
        createNewBook(newBook);
        addToLocalStorage(bookArray);
        e.target.reset();
        errorDiv.style.display = 'none'
        manualAddDiv.style.display = 'none';
        addedBooksDiv.style.filter = 'blur(0px)';
        header.style.filter = 'blur(0px)';
        hr.style.filter = 'blur(0px)';
    } else {
        errorDiv.style.display = 'block';
    }
}

const searchText = document.querySelector('#searchText');
let isSearched = false;

const insertData = (datas) => {
    if (isSearched == false) {
        isSearched = true;
        datas.forEach(data => {
            let inText = '';
            inText = `<fieldset><legend><span>${data.volumeInfo.title}</span></legend>
        <p>Author: ${data.volumeInfo.authors} </p>
        <p>Pages: ${data.volumeInfo.pageCount} </p>
        <a href="${data.volumeInfo.previewLink}" target="_blank">PDF Preview</a></fieldset>`;
            const searchBookDiv = document.createElement('div');
            searchBookDiv.innerHTML = inText;
            searchBookDiv.className = 'searchBookDiv';
            searchDiv.append(searchBookDiv);
        })
    } else {
        const allSearchBookDiv = document.querySelectorAll('.searchBookDiv');
        allSearchBookDiv.forEach(div => {
            div.remove();
        })
        isSearched = false;
        insertData(datas);
    }
}

const searchForBook = async (e) => {
    addedBooksDiv.style.display = 'none';
    e.preventDefault();
    searchValue = searchText.value;
    let response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchValue}`);
    // console.log(response.data.items[0].volumeInfo.title);
    insertData(response.data.items);
}

searchForm.addEventListener('submit', searchForBook);
manualForm.addEventListener('submit', manualBookSubmited);
addBookBut.addEventListener('click', addBookEvents);
addBookBut.addEventListener('click', userShowChoice);
cancelBut.addEventListener('click', cancelFunc);