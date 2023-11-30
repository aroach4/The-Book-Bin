const booksUrl = "http://localhost:5275/api/books"

let myBooks;

function handleOnLoad() {
    console.log('handle on load called')
    let html=`
    <h2>Tuscaloosa Book Bin</h2>
    <div id="tablebody"></div>
    <button onclick="loadTradeForm()">Trade a Book</button>
    <button onclick="loadAdminLogin()">Admin Login</button>
    `
    
    document.getElementById('app').innerHTML=html
    loadMainPage()
}

function loadMainPage() {
    let html = `</table>`
    document.getElementById('tablebody').innerHTML = html
    createBookTable()
}

async function createBookTable() {
    // API link will have to be updated to our actual API link
    let response = await fetch(booksUrl);
    let data = await response.json();
    myBooks = data;
    console.log(data);
    displayBookTable(myBooks);
}

// Builds the book table header, calls another method to build the rows. Will need to be adjusted for the cards.
// Below is an example, it makes a two column table with as many rows as there is relevant data.
// Likely just pull the header building out and change the row building to fill in cards.
// Shaliyah should have more information on making cards.
function displayBookTable(myBooks) {
    let html =`
    <table class="table table-striped">
        <tr>
            <th>Book</th>
            <th>Price</th>
        </tr>`
    myBooks.forEach(function(book){
        html += `
        <tr>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td><button onclick="displayBookInfo('${book.id}')">More Info on ${book.title}</button></td>
        </tr>`
    })
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

// passes in the book's url as "bookInfo" to draw from in the following page building.


//Builds a page based off of the information given to it about the specific book that was selected.
async function displayBookInfo(bookid) {
    console.log(bookid);
    let response = await fetch(booksUrl+"/"+bookid);
    let data = await response.json();
    console.log(data);
    let html =`
    <table class="table table-striped">

        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Page Count</th>
            <th>Genre</th>
            <th>Book Type</th>
            <th>Condition</th>
            <th>Price</th>
        </tr>
        <tr>

            <td>${data.title}</td>
            <td>${data.author}</td>
            <td>${data.pageCount}</td>
            <td>${data.genre}</td>
            <td>${data.bookType}</td>
            <td>${data.condition}</td>
            <td>${data.price}</td>
        </tr>
        <button onclick="loadBuyPage(${data.id})">Buy This Book</button>
        <button onclick="handleOnLoad()">Back to Home Page</button>
        `
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

async function loadBuyPage(bookid) {
    console.log(bookid + " is bought");
    let response = await fetch(booksUrl+"/"+bookid);
    let data = await response.json();
    console.log(data);
  
    let html =`
    <table class="table table-striped">
        <tr>
            <th>Cart</th>
        </tr>
        <tr>
            <td>${data.title}</td>
            <td>${data.author}</td>
            <td>${data.pageCount}</td>
            <td>${data.price}</td>
        </tr>
   
    <button onclick="loadMainPage()">Home</button>`
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

function loadAdminLogin() {
    let html =`
    <form></form>
    <form>
        <label for="aname">Admin Username:</label><br>
        <input type="text" id="aname" name="aname"><br>
        <label for="pword">Password:</label><br>
        <input type="text" id="pword" name="pword">
    </form>
    <button onclick="loadAdminPortal()">Log in as an Admin</button>
    <button onclick="loadMainPage()">Home</button>`
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
    // Checking for correct credentials, probably a better/correct way to do this though.
    if (aname=="CorrectName" && pword=="CorrectPassword") {
        loadAdminPortal()
    }
}

function loadAdminPortal() {
    let html =`
    <button onclick="loadTransactionHistory()">Transaction History</button>
    <button onclick="loadReportsPage()">Reports</button>
    <button onclick="loadBookInventory()">Inventory</button>
    <button onclick="loadMainPage()">Home</button>`
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

function loadTransactionHistory() {
    createTransactionTable()
    let html =`
    <button onclick="loadAdminPortal()">Return to Admin Portal</button>`
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

function createTransactionTable() {
    // API link will have to be updated to our actual API link
    const url = 'API link placeholder'
    fetch(url).then(function(response){
        console.log(response)
        return response.json()
    }).then(function(json){
        console.log(json)
        // display the table
        displayTransactionTable(json.results)
    })
    .catch(function(error) {
        console.error('Error fetching data:', error)
    })
}

function displayTransactionTable(transactionData) {
    let html =`
    <table class="table table-striped">
        <tr>
            <th>Book Purchased or Traded</th>
            <th>Amount Paid</th>
            <th>Date of Transaction</th>
            <th>In-Store or Online</th>
        </tr>`
    transactionData.forEach(function(transaction){
        html += `
        <tr>
            <td>${transaction.book}</td>
            <td>${transaction.paid}</td>
            <td>${transaction.date}</td>
            <td>${transaction.type}</td>
        </tr>`
    })
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

function loadReportsPage() {
    let html =`
    <button onclick="loadAdminPortal()">Return to Admin Portal</button>`
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

function loadBookInventory() {
    let html =`
    <button onclick="loadAdminPortal()">Return to Admin Portal</button>`
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
    createInvTable()
}

function createInvTable() {
    // API link will have to be updated to our actual API link
    const url = 'API link placeholder'
    fetch(url).then(function(response){
        console.log(response)
        return response.json()
    }).then(function(json){
        console.log(json)
        // display the table
        displayInvTable(json.results)
    })
    .catch(function(error) {
        console.error('Error fetching data:', error)
    })
}

function displayInvTable(bookData) {
    let html =`
    <table class="table table-striped">
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Page Count</th>
            <th>Price</th>
        </tr>`
    var count = 0
    bookData.forEach(function(book){
        count++
        html += `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pageCount}</td>
            <td>${book.price}</td>
        </tr>`
    })
    html +=`</table>
    'Total Number of Books in Inventory: ${count}'`
    document.getElementById('tablebody').innerHTML = html
}



function boughtBook() {
    //function for unlisting book
    //returning to home page
    handleOnLoad()
}

function loadTradeForm() {
    let html =`
    <button onclick="loadMainPage()">Home</button>`
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
    createBookTradeTable()
}

function createBookTradeTable() {
    // API link will have to be updated to our actual API link
    const url = 'API link placeholder'
    fetch(url).then(function(response){
        console.log(response)
        return response.json()
    }).then(function(json){
        console.log(json)
        // display the table
        displayBookTradeTable(json.results)
    })
    .catch(function(error) {
        console.error('Error fetching data:', error)
    })
}

function displayBookTradeTable(bookData) {
    // Form for inputing information relevant to the beek being traded.
    let html =`
    <label for="tradetitle">Title of Book You are Trading:</label><br>
    <input type="text" id="tradetitle" name="tradetitle"><br>
    <label for="pagecount">Page count of your Book:</label><br>
    <input type="text" id="pagecount" name="pagecount">
    <input type="checkbox" id="book" name="book" value="Hardcover">
    <label for="book"> My Book is Hard Cover</label><br>
    <table class="table table-striped">
        <tr>
            <th>Book</th>
            <th>Page Count</th>
        </tr>`
    bookData.forEach(function(book){
        html += `
        <tr>
            <td>${book.title}</td>
            <td><button onclick="handleLoadBook('${book.url}')">More Info on ${book.pageCount}</button></td>
        </tr>`
    })
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}