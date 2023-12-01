const booksUrl = "http://localhost:5275/api/books"

const ordersUrl = "http://localhost:5275/api/orders"

let myBooks;

let cart;
//roach test

function handleOnLoad() {
    console.log('handle on load called')
    let html=`
        <div class="p-2 mb-3 bg-body-tertiary rounded-3">
        <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Tuscaloosa Book Bin</h1>
        <p class="col-md-8 fs-4">Tuscaloosa's first choice in book purchasing!</p>
        <button onclick="loadMainPage()">Home</button>
        <button onclick="loadTradeForm()">Trade a Book</button>
        <button onclick="loadCart()">Cart</button>
        <button onclick="loadAdminLogin()">Admin Login</button>
        </div>
        </div>
        <div id="tablebody"></div>
    
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
    try {
        let response = await fetch(booksUrl);
        let data = await response.json();
        myBooks = data;
        console.log(data);
        displayBookTable(myBooks);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
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
            <th></th>
            <th></th>
        </tr>`
    myBooks.forEach(function(book){
        
            console.log(book.title + book.deleted);
            if(book.deleted == false){
               html += `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.price}</td>
                    <td><button onclick="displayBookInfo('${book.id}')">More Info on ${book.title}</button></td>
                    <td><button onclick="loadBuyPage(${book.id})" >Buy this book</button></td>               
                </tr>` 
            }
            
        
    })
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

// passes in the book's url as "bookInfo" to draw from in the following page building.


//Builds a page based off of the information given to it about the specific book that was selected.
// async function displayBookInfo(bookid) {
//     console.log(bookid);
//     let response = await fetch(booksUrl+"/"+bookid);
//     let data = await response.json();
//     console.log(data);
//     let html =`
//     <table class="table table-striped">

//         <tr>
//             <th>Title</th>
//             <th>Author</th>
//             <th>Page Count</th>
//             <th>Genre</th>
//             <th>Book Type</th>
//             <th>Condition</th>
//             <th>Price</th>
//         </tr>
//         <tr>

//             <td>${data.title}</td>
//             <td>${data.author}</td>
//             <td>${data.pageCount}</td>
//             <td>${data.genre}</td>
//             <td>${data.bookType}</td>
//             <td>${data.condition}</td>
//             <td>${data.price}</td>
//         </tr>
//         <button onclick="loadBuyPage(${data.id})">Buy This Book</button>
//         <button onclick="handleOnLoad()">Back to Home Page</button>
//         `
//     html +=`</table>`
//     document.getElementById('tablebody').innerHTML = html
// }

async function displayBookInfo(bookid) {
    try {
        console.log(bookid);
        let response = await fetch(booksUrl + "/" + bookid);
        let data = await response.json();
        console.log(data);
        let html = `
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
            </table>
            <button onclick="loadBuyPage(${data.id})">Buy This Book</button>
            <button onclick="handleOnLoad()">Back to Home Page</button>
        `;
        document.getElementById('tablebody').innerHTML = html;
    } catch (error) {
        console.error('Error fetching book details:', error);
    }
}

async function loadBuyPage(bookid) {
    console.log(bookid + " is bought");
    let response = await fetch(booksUrl+"/"+bookid);
    let data = await response.json();
    console.log(data);
  


    let html =`
    <table class="table table-striped">
    <tr>
    <th>Pending Purchase</th>
    </tr>
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
    </table>
     <form onsubmit="return false" class="mt-4">
        <div class="mb-3">
        <label for="customerEmail" class="form-label">Please enter your email below:</label>
        <input type="text" id="customerEmail" name="customerEmail" class="form-control">
        </div>

        <div class="mb-3">
        <label for="shippingAddress" class="form-label">Please enter your shipping address below:</label>
        <input type="text" id="shippingAddress" name="shippingAddress" class="form-control">
        </div>
        
        <button onclick="handleOrderAdd(${data.id})" >Add to cart</button>
        <button onclick="buyNow(${data.id})" >Buy now</button>
        </form>
    
    
    `
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

async function handleOrderAdd(bookid){
    console.log(bookid)
    let customerEmail = document.getElementById('customerEmail').value;
    let shippingAddress = document.getElementById('shippingAddress').value;
    let response = await fetch(booksUrl+"/"+bookid);
    let data = await response.json();
    console.log(data + "is being ordered");
    let currentDate = new Date();
    
    let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    let order = {custEmail: customerEmail, shippingAddress: shippingAddress, orderDate: currentDate.toLocaleDateString(undefined, options), bookID: bookid, bookPrice: data.price, bookTitle: data.title, completionDate: "No", completed: false}

    console.log(order)
    await fetch(ordersUrl, {
        method:"POST",
        body: JSON.stringify(order),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    addToCart(order);
}

async function buyNow(bookid){
    console.log(bookid)
    let customerEmail = document.getElementById('customerEmail').value;
    let shippingAddress = document.getElementById('shippingAddress').value;
    let response = await fetch(booksUrl+"/"+bookid);
    let data = await response.json();
    console.log(data + "is being ordered");
    let currentDate = new Date();
    
    let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    let newOrder = {custEmail: customerEmail, shippingAddress: shippingAddress, orderDate: currentDate.toLocaleDateString(undefined, options), bookID: bookid, bookPrice: data.price, bookTitle: data.title, completionDate: currentDate.toLocaleDateString(undefined, options), completed: true}

    console.log(newOrder)
    await fetch(ordersUrl, {
        method:"POST",
        body: JSON.stringify(newOrder),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    let response2 = await fetch(ordersUrl);
    let data2 = await response2.json();
    console.log(data2)
    data2.forEach(function(order){
        
        console.log(order.id + order.completed);
        if(newOrder.bookID == order.bookID){
           finishBuyNow(order.id);
        }
        
    
})
    
}

function addToCart(order){
    handleBookSell(order.bookID);
    let html = `
    <div class="alert alert-success">
    <strong>${order.bookTitle} successfully added to the account with email ${order.custEmail}!</strong> 
    </div>
    <button onclick="handleOnLoad()">Back to Home Page</button>
    `
    document.getElementById('tablebody').innerHTML = html
}

async function finishBuyNow(orderid) {
    try {
        let response = await fetch(ordersUrl + "/" + orderid);
        let data = await response.json();

        if (!data) {
            console.error('Error fetching order details:', data);
            return;
        }

        handleBookSell(data.bookID);
        buyBook(orderid);
    } catch (error) {
        console.error('Error in finishBuyNow:', error);
    }
}
async function handleBookSell(index)
{
    
    console.log(index)
        await fetch(booksUrl + "/"+index, {
            method:"DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    
}


async function loadCart() {
    try {
        let response = await fetch(ordersUrl);
        let data = await response.json();
        myOrders = data;
        console.log(data);
        checkCartOwner(myOrders);
    } catch (error) {
        console.error('Error fetching cart details:', error);
    }
}
async function checkCartOwner(myOrders){
    console.log(myOrders)
    let html = `<form onsubmit="return false" class="mt-4">
        <div class="mb-3">
        <label for="cartEmail" class="form-label">Please enter account email associated with cart below:</label>
        <input type="text" id="cartEmail" name="cartEmail" class="form-control">
        </div>

        <div class="mb-3">
        <label for="cartShippingAddress" class="form-label">Please enter shipping address of order(s) below:</label>
        <input type="text" id="cartShippingAddress" name="cartShippingAddress" class="form-control">
        </div>
        
        <button onclick="displayOrdersTable()" >View account cart</button>
        <button onclick="handleOnLoad()">Back to Home Page</button>
        </form>`

        document.getElementById('tablebody').innerHTML = html

}

async function displayOrdersTable() {
    let response = await fetch(ordersUrl);
        let data = await response.json();
        let myOrders = data;
        console.log(data);
    let customerEmail = document.getElementById('cartEmail').value;
    let shippingAddress = document.getElementById('cartShippingAddress').value;
    let html =`
    <button onclick="buyAll('${customerEmail}', '${shippingAddress}')">Checkout entire cart</button>
    <table class="table table-striped">
        <tr>
            <th>Account: ${customerEmail}<th>
        </tr>
        <tr>
            <th>Book</th>
            <th>Price</th>
            <th>Order Date</th>
            <th>Shipping Address</th>
            <th></th>

        </tr>`
    myOrders.forEach(function(order){
        
            console.log(order.custEmail + order.shippingAddress + order.bookTitle);
            console.log('Order:', order);
            console.log('Conditions:', order.completed, order.custEmail, customerEmail, order.shippingAddress, shippingAddress);
            if (!order.completed && order.custEmail.trim() === customerEmail.trim() && order.shippingAddress.trim() === shippingAddress.trim()) {
               html += `
                <tr>
                    <td>${order.bookTitle}</td>
                    <td>${order.bookPrice}</td>
                    <td>${order.orderDate}</td>
                    <td>${order.shippingAddress}</td>
                    <td><button onclick="buyBook(${order.id})" >Checkout</button></td>

                </tr>` 
            }
            
        
    })
    html +=`</table>`
    document.getElementById('tablebody').innerHTML = html
}

async function buyAll(customerEmail, shippingAddress){
    let sum = 0;
    let boughtOrders = [];
    let response = await fetch(ordersUrl);
        let data = await response.json();
        let myOrders = data;
        console.log(data);
        let html = `
        <table class="table table-striped">
        <tr>
            <th>Account: ${customerEmail}<th>
        </tr>
        
        `
        myOrders.forEach(function(order){
        
            
            if (!order.completed && order.custEmail.trim() === customerEmail.trim() && order.shippingAddress.trim() === shippingAddress.trim()) {
              
                console.log(order.bookTitle +customerEmail + shippingAddress);
                html += `
                <tr>
                    <td>${order.bookTitle}</td>
                    <td>${order.bookPrice}</td>
                </tr>` 
                let currentDate = new Date();
    
                let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

                order.completionDate = currentDate.toLocaleDateString(undefined, options)
                order.completed = true;
                boughtOrders.push(order);
                sum += order.bookPrice;
            }
            
        })
        console.log(boughtOrders);
        html+= `
        <tr>
            <th>Sum of book prices: ${sum}<th>
        </tr>
        <form onsubmit="return false" class="mt-4">
        <div class="mb-3">
        <label for="paymentInfo" class="form-label">Please enter payment information:</label>
        <input type="text" id="paymentInfo" name="paymentInfo" class="form-control">
        </div>
        <button onclick="BookPurchases(${JSON.stringify(boughtOrders)})">Continue</button>
        </form>
        `;
        document.getElementById('tablebody').innerHTML = html;
}

async function BookPurchases(orderstring) {
     
    let orders = JSON.parse(orderstring);
    console.log(orders);
    let html = '';

    try {
        for (const order of orders) {
            await handleOrderCompletion(order.id);

            let response = await fetch(ordersUrl + "/" + order.id);
            let data = await response.json();
            console.log(data);

            console.log("Completion Status: " + data.completed);

            html += `
                <div class="alert alert-success">
                    <strong>${data.bookTitle} successfully purchased and shipped to ${data.shippingAddress}!</strong>
                </div>`;
        }

        html += `
            <button onclick="handleOnLoad()">Back to Home Page</button>`;
    } catch (error) {
        console.error("Error in BookPurchases:", error);
        html = `<div class="alert alert-danger">An error occurred during the purchase process.</div>`;
    }

    document.getElementById('tablebody').innerHTML = html;
}

async function buyBook(orderid){
    console.log(orderid)
    let response = await fetch(ordersUrl + "/" + orderid);
        let data = await response.json();
        console.log(data);
    console.log(data)
    let html = `
        <div class="mb-3">
            <h2>Book Title: ${data.bookTitle}</h2>
            <h2>Book Price: ${data.bookPrice}</h2>
        </div>
        <form onsubmit="return false" class="mt-4">
        <div class="mb-3">
        <label for="paymentInfo" class="form-label">Please enter payment information:</label>
        <input type="text" id="paymentInfo" name="paymentInfo" class="form-control">
        </div>
        <button onclick="BookPurchase(${data.id})" >Continue</button>
        </form>`

        document.getElementById('tablebody').innerHTML = html
}

async function BookPurchase(orderid){
    console.log(orderid)
    await handleOrderCompletion(orderid);
    let response = await fetch(ordersUrl + "/" + orderid);
        let data = await response.json();
        console.log(data);
        
        console.log("Completion Status: " + data.completed)
    
    let html = `
    <div class="alert alert-success">
    <strong>${data.bookTitle} successfully purchased and shipped to ${data.shippingAddress}!</strong> 
    </div>
    <button onclick="handleOnLoad()">Back to Home Page</button>
    `
    document.getElementById('tablebody').innerHTML = html
    
}

async function handleOrderCompletion(index)
{
        let response = await fetch(ordersUrl + "/" + index);
        let data = await response.json();
        console.log(data);

        let currentDate = new Date();
    
        let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

        data.completionDate = currentDate.toLocaleDateString(undefined, options)
        console.log(data.completionDate);
        console.log(index)

        await fetch(ordersUrl + "/"+index, {
            method:"PUT",
            body: JSON.stringify(data.completionDate),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        await fetch(ordersUrl + "/"+index, {
            method:"DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    
}

function loadAdminLogin() {
    let html =`
        <form action="/action_page.php">
        <div class="form-group">
        <label for="email">Email address:</label>
        <input type="email" class="form-control" id="email">
        </div>
        <div class="form-group">
        <label for="pwd">Password:</label>
        <input type="password" class="form-control" id="pwd">
        </div>
        <div class="checkbox">
        <label><input type="checkbox"> Remember me</label>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
    </form>`
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