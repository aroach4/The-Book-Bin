const booksUrl = "http://localhost:5275/api/books"

const ordersUrl = "http://localhost:5275/api/orders"

const adminsUrl = "http://localhost:5275/api/admins"


let myAdmins;

async function test(){
    let response = await fetch(adminsUrl);
    let data = await response.json();
    myAdmins = data;
    console.log(myAdmins);  
}

let myBooks;
let cart;
//roach test

//johnson edit move the heading to index.html
function handleOnLoad() {
   // test();
    console.log('handle on load called')
    let html=`

    <div class="p-2 mb-3 custom-banner rounded-3">
    <div class="container-fluid py-5 text-center">
        <h1 class="display-5 fw-bold">Tuscaloosa Book Bin</h1>
    
        <button onclick="loadMainPage()">Home</button>
        <button onclick="loadCart()">Cart</button>
        <button onclick="inputAdminCredentials()">Admin Login</button>
       
    </div>
</div>
<div id="tablebody"></div>
 `

    document.getElementById('app').innerHTML=html
    loadMainPage()
}



function loadMainPage() {
    console.log("In loadMainPage()")
     let html = `</table>`
    document.getElementById('tablebody').innerHTML = html
    createBookTable();
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



// just displays the book V3 Satisfied
function displayBookTable(myBooks)
 {
        // <div class="row row-cols-1 row-cols-md-3 g-4">`;
    let html = `
    <div class="sorting-buttons">
        <button onclick="sortHomePage('author', 'asc')">Sort by Author (Asc)</button>
        <button onclick="sortHomePage('author', 'desc')">Sort by Author (Desc)</button>
    
        <button onclick="sortHomePage('price', 'asc')">Sort by Price (Asc)</button>
        <button onclick="sortHomePage('price', 'desc')">Sort by Price (Desc)</button>
    
        <button onclick="sortHomePage('title', 'asc')">Sort by Title (Asc)</button>
        <button onclick="sortHomePage('title', 'desc')">Sort by Title (Desc)</button>
    
     </div>

    <div class="row row-cols-1 row-cols-md-4 g-4 bookshelf">`;

    let empty = true;


    myBooks.forEach(function (book) {
        console.log(book.title + book.deleted);
        if (book.deleted == false) {
            empty = false;
            html += `
            <div class="col">
                <div class="card my-card">
                 
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.author}</p>
                      
                        <p class="card-text">Price: $${book.price}</p>
                        <button onclick="displayBookInfo('${book.id}')" class="btn btn-primary">View Book</button>
                        <button onclick="loadBuyPage(${book.id})" class="btn btn-success">Buy</button>
                    </div>
                </div>
            </div>`;
        }
    });

    if (empty == true) {
        html += `
            <div class="col">
                <div class="card my-card">
                    <div class="card-body">
                        <p class="card-text">Sold Out!</p>
                    </div>
                </div>
            </div>`;
    }

    html += `</div>`;
    document.getElementById('tablebody').innerHTML = html;
}


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
    let order = {custEmail: customerEmail, shippingAddress: shippingAddress, orderDate: currentDate.toLocaleDateString(undefined, options), bookID: bookid, bookPrice: data.price, bookTitle: data.title, completionDate: "Not completed", completed: false}

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

       
        <button onclick="displayOrdersTable()" >View account cart</button>
        <button onclick="handleOnLoad()">Back to Home Page</button>
        </form>`

        document.getElementById('tablebody').innerHTML = html

}


async function displayOrdersTable() {
    let customerEmail = document.getElementById('cartEmail').value;
    
    try {
        let response = await fetch(ordersUrl);
        let data = await response.json();
        let myOrders = data.filter(order => !order.completed && order.custEmail.trim() === customerEmail.trim());
        console.log(myOrders);
        let total = calculateTotalPrice(myOrders);
        let html = `
            <button onclick="buyAll('${customerEmail}')">Checkout entire cart</button>
            <table class="table table-striped">
                <tr>
                    <th>Account: ${customerEmail}</th>
                </tr>
                <tr>
                    <th>Book</th>
                    <th>Price</th>
                    <th>Order Date</th>
                    <th>Shipping Address</th>
                    <th></th>
                </tr>`;

        myOrders.forEach(order => {
            html += `
                <tr>
                    <td>${order.bookTitle}</td>
                    <td>${order.bookPrice}</td>
                    <td>${order.orderDate}</td>
                    <td>${order.shippingAddress}</td>
                    <td><button onclick="buyBook(${order.id})">Checkout</button></td>
                </tr>`;
        });

        html += `</table>
            <div>Total Price: ${total}</div>
            <form onsubmit="return false" class="mt-4">
                <div class="mb-3">
                    <label for="paymentInfo" class="form-label">Please enter payment information:</label>
                    <input type="text" id="paymentInfo" name="paymentInfo" class="form-control">
                </div>
                <button onclick="BookPurchases(${JSON.stringify(myOrders)})">Continue</button>
            </form>`;

        document.getElementById('tablebody').innerHTML = html;
    } catch (error) {
        console.error('Error fetching cart details:', error);
    }
}


async function buyAll(customerEmail) {
    try {
        let response = await fetch(ordersUrl);
        let data = await response.json();
        let myOrders = data.filter(order => !order.completed && order.custEmail.trim() === customerEmail.trim());

        for (const order of myOrders) {
            await handleOrderCompletion(order.id);
        }

        let total = calculateTotalPrice(myOrders);

        let currentDate = new Date();
        let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

        let html = '';
        myOrders.forEach(order => {
            order.completionDate = currentDate.toLocaleDateString(undefined, options);
            order.completed = true;
            if(order.shippingAddress != "In-Store"){
                html += `<div class="alert alert-success"><strong>${order.bookTitle} successfully purchased and shipped to ${order.shippingAddress}!</strong></div>`;
            }
            else{
                html += `<div class="alert alert-success"><strong>${order.bookTitle} successfully purchased in store by ${order.custEmail}!</strong></div>`;

            }
        });

        html += `<div>Total Price: ${total}</div>
            <button onclick="handleOnLoad()">Back to Home Page</button>`;

        document.getElementById('tablebody').innerHTML = html;
    } catch (error) {
        console.error('Error in buyAll:', error);
    }
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
        let html = ' ';
        if(data.shippingAddress != "In-Store"){
             html += `<div class="alert alert-success"><strong>${data.bookTitle} successfully purchased and shipped to ${data.shippingAddress}!</strong></div>`;
        }
        else{
             html += `<div class="alert alert-success"><strong>${data.bookTitle} successfully purchased in store by ${data.custEmail}!</strong></div>`;

        }
    html+=`
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

function calculateTotalPrice(orders) {
    return orders.reduce((sum, order) => sum + order.bookPrice, 0);
}


//! ADMIN SECURITY
function inputAdminCredentials() {
    let html = `<form onsubmit="return false" class="mt-4">
        <div class="mb-3">
            <label for="adminId" class="form-label">Please enter admin id:</label>
            <input type="text" id="adminId" name="adminId" class="form-control">

            <label for="adminUserName" class="form-label">Please enter admin username:</label>
            <input type="text" id="adminUserName" name="adminUserName" class="form-control">

            <label for="adminPassword" class="form-label">Please enter password:</label>
            <input type="text" id="adminPassword" name="adminPassword" class="form-control">
        </div>

        <button onclick="checkAdminCredentials()">Enter admin portal</button>
    </form>`;

    document.getElementById('tablebody').innerHTML = html;
}

async function checkAdminCredentials() {
    let adminUserName = document.getElementById('adminUserName').value;
    let adminPassword = document.getElementById('adminPassword').value;
    let adminId = document.getElementById('adminId').value;

    let response = await fetch(adminsUrl);
    let data = await response.json();
    let myAdmins = data.filter(admin => admin.username.trim() === adminUserName.trim() && admin.password.trim() === adminPassword.trim());

    if (myAdmins.length === 0) {
        console.log("Admin username does not exist");
    } else {
        loadAdminPortal();
    }
}



function loadTransactions() {
    console.log('In loadTransactions()');
    //!ADD A LIST OF ALL INVENTORY ON HAND IN THE BOOKS TABLE
    //routes back to homepage
    let html =`<button onclick="loadAdminPortal()">Return to Admin Portal</button>`
    // html +=`</table>`
    document.getElementById('tablebody').innerHTML = html;
   createTransactionTable();
}

//fetchs the book data
function createTransactionTable() {
    console.log('createTransactionTable');

    fetch(ordersUrl)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (json) {
            console.log(json);

            // Sort the array by order date YOU COULD ADD BUTTONS HERE!
            json.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));


            // Display the table
            displayTransactionHistory(json);
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}

function sortTable(order) {
    fetch(ordersUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            // Sort the array based on the specified column and order
            if (order === 'odasc') {
                json.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
            } else if (order == 'oddesc'){
                json.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            } else if (order == 'cdasc'){
                json.sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate));
            } else if (order == 'cddesc'){
                json.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
            } else if (order === 'priceasc') {
                json.sort((a, b) => a.bookPrice - b.bookPrice);
            } else if (order === 'pricedesc') {
                json.sort((a, b) => b.bookPrice - a.bookPrice);
            }
            // Display the table
            displayTransactionHistory(json);
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}


function sortTable(column, order) {
    console.log("sortTable(column, order)")
   
    fetch(booksUrl)
        .then(response => response.json())
        .then(json => {
            const sortedBooks = json.sort((a, b) => {
                if (order === 'asc') {
                    return a[column] - b[column];
                } else {
                    return b[column] - a[column];
                }
            });

            displayInvTable(sortedBooks);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


function sortTable(order) {
    fetch(ordersUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            // Sort the array based on the specified column and order
            if (order === 'odasc') {
                json.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
            } else if (order == 'oddesc'){
                json.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            } else if (order == 'cdasc'){
                json.sort((a, b) => new Date(a.completionDate) - new Date(b.completionDate));
            } else if (order == 'cddesc'){
                json.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate));
            } else if (order === 'priceasc') {
                json.sort((a, b) => a.bookPrice - b.bookPrice);
            } else if (order === 'pricedesc') {
                json.sort((a, b) => b.bookPrice - a.bookPrice);
            }
            // Display the table
            displayTransactionHistory(json);
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}
function displayTransactionHistory(orderData) {

    console.log('In displayTransactionHistory'); //!error checking

    if (!orderData || !Array.isArray(orderData)) {
       
        console.error('Invalid or missing data for transaction history');
        return;
    }


    let html =`
    <table class="table table-striped">
    <div 
   
    <tr>
        <th>ID</th>
        <th>Customer email</th>
        <th>Book ID</th>
        <th>Revenue</th>
        <th>Book Title</th>
        <th>Order Date</th>
        <th>Completed</th>
        <th>Completion Date</th>
    </tr>       
    </div> `
    var countOfUncompleted = 0
    var countOfCompleted = 0
    var count = 0;
    var priceSum = 0;
    
    orderData.forEach(function(order){
        if(order.completed == false){
            countOfUncompleted++;
        }
        if(order.completed == true){
            countOfCompleted++;
            priceSum += order.bookPrice
        }
        count++
        
        html += `
        <tr>
            <td>${order.id}</td>
            <td>${order.custEmail}</td>
            <td>${order.bookID}</td>
            <td>${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(order.bookPrice)}</td>
            <td>${order.bookTitle}</td>
            <td>${order.orderDate}</td>
            <td>${order.completed}</td>
            <td>${order.completionDate}</td>
            
            
        </tr>`
    })
    var avg = priceSum/countOfCompleted
  
    html +=`
    


  <div class="alert alert-secondary" role="alert">
     Total Number of Orders: ${count}
  </div>
  <div class="alert alert-secondary" role="alert">
     Total Number of Pending Orders: ${countOfUncompleted}
    </div>
   

    <div class="alert alert-secondary" role="alert">
    Average order revenue: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(avg)}
  </div>
  <div class="alert alert-secondary" role="alert">
    Total revenue: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(priceSum)}
  </div>

  <div class="alert alert-secondary" role="alert">
  <button type="button"  onclick="inStoreTransaction()">Record in-store transaction</button>
    </div>

   
  <div class="alert alert-secondary" role="alert">
  <button onclick="loadAdminPortal()">Return to Admin Portal</button>
    </div>

  <div >
  <button type="button"  onclick="sortTable('odasc')">Sort by Order Date (Asc)</button>
  <button type="button" onclick="sortTable('oddesc')">Sort by Order Date (Desc)</button>
  <button type="button"  onclick="sortTable('cdasc')">Sort by Completion Date (Asc)</button>
  <button type="button" onclick="sortTable('cddesc')">Sort by Completion Date (Desc)</button>
  <button type="button"  onclick="sortTable('priceasc')">Sort by Revenue (Asc)</button>
  <button type="button" onclick="sortTable('pricedesc')">Sort by Revenue (Desc)</button>
  
</div>
`

    document.getElementById('tablebody').innerHTML = html
}


async function createInStoreOrder(bookid){
    let response = await fetch(booksUrl+"/"+bookid);
    let data = await response.json();
    console.log(data);
    let currentDate = new Date();

    let html = `
        <form onsubmit="return false" class="mt-4">
            <div class="mb-3">
            <label for="customerEmail" class="form-label">Please enter customer email below:</label>
            <input type="text" id="customerEmail" name="customerEmail" class="form-control">
            </div>
            
            
            <button onclick="buyInStore(${data.id})" >Buy now</button>
            </form>
    
    `

    document.getElementById('tablebody').innerHTML = html


}

async function buyInStore(bookid){
    console.log(bookid)
    let customerEmail = document.getElementById('customerEmail').value;
    
    let response = await fetch(booksUrl+"/"+bookid);
    let data = await response.json();
    console.log(data + "is being bought in store");
    let currentDate = new Date();
    
    let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    let newOrder = {custEmail: customerEmail, shippingAddress: 'In-Store', orderDate: currentDate.toLocaleDateString(undefined, options), bookID: bookid, bookPrice: data.price, bookTitle: data.title, completionDate: currentDate.toLocaleDateString(undefined, options), completed: true}

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
        
    
})}

async function loadTradeForm() {
    try {
        let response = await fetch(booksUrl);
        let data = await response.json();
        myBooks = data;
        console.log(data);
        checkBookInfo(myBooks);
    } catch (error) {
        console.error('Error fetching cart details:', error);
    }
}
async function checkBookInfo(myBooks){
    console.log(myBooks)
    let html = `<form onsubmit="return false" class="mt-4">
        <div class="mb-3">
        <label for="pageCount" class="form-label">Please enter page count:</label>
        <input type="text" id="pageCount" name="pageCount" class="form-control">

        <label for="bookType" class="form-label">Please enter book type (Hardcover, Paperback, Audio):</label>
        <input type="text" id="bookType" name="bookType" class="form-control">

        <label for="bookCondition" class="form-label">Please enter book condition (New or Used):</label>
        <input type="text" id="bookCondition" name="bookCondition" class="form-control">
        </div>

       
        <button onclick="checkTradeMatches()" >View available trades</button>
        <button onclick="handleOnLoad()">Back to Home Page</button>
        </form>`

        document.getElementById('tablebody').innerHTML = html

}
let tradePageCount;
let tradeBookType;
let tradeBookCondition;

async function checkTradeMatches(){
     tradePageCount = document.getElementById('pageCount').value;
     tradeBookType = document.getElementById('bookType').value;
     tradeBookCondition = document.getElementById('bookCondition').value;

    let response = await fetch(booksUrl);
    let data = await response.json();
    let matchedBooks = data.filter(book =>  book.deleted == false &&
                                            book.pageCount >= tradePageCount - 50 &&
                                            book.pageCount <= tradePageCount + 50 &&
                                            book.bookType.trim().toLowerCase() === tradeBookType.trim().toLowerCase() &&
                                            book.condition.trim().toLowerCase() === tradeBookCondition.trim().toLowerCase());

    if (matchedBooks.length === 0) {
        console.log("No eligible trades");
    } else {
        displayEligibleTradeIns(matchedBooks);
    }
}

function displayEligibleTradeIns(bookData) {

    console.log('In displayInvTable'); //!error checking

    if (!bookData || !Array.isArray(bookData)) {
        // Handle the case where bookData is undefined or not an array
        console.error('Invalid or missing data for book inventory');
        return;
    }


    let html =`
    <table class="table table-striped">
    <div 
   
    <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Author</th>
        <th>Page Count</th>
        <th>Type</th>
        <th>Genre</th>
        <th>Price</th>
        <th>Condition</th>
        <th scope="col">Trade-In</th>
        
    </tr>       
    </div> `
    var count = 0
    bookData.forEach(function(book){
        if(book.deleted == false){
          count++
        html += `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pageCount}</td>
            <td>${book.bookType}</td>
            <td>${book.genre}</td>
            <td>${book.price}</td>
            <td>${book.condition}</td>
            `
        if (book.deleted == false){
            html+=  `
            <td><button type="button" class="btn active" data-bs-toggle="button" onclick="createTradeIn(${book.id})">Trade for Book #${book.id}</button></td>
            `
        }}
        
            
          
    })   

    document.getElementById('tablebody').innerHTML = html
}
let tradeTitle;
let tradeAuthor;
let tradeGenre;
async function createTradeIn(bookid){
    console.log(bookid)
    
    
    
    console.log(tradePageCount)
    console.log(tradeBookCondition)
    console.log(tradeBookType)

    let html = `<form onsubmit="return false" class="mt-4">
        <div class="mb-3">
        <label for="tradeTitle" class="form-label">Please enter trade-in title:</label>
        <input type="text" id="tradeTitle" name="tradeTitle" class="form-control">

        <label for="tradeAuthor" class="form-label">Please enter trade-in author:</label>
        <input type="text" id="tradeAuthor" name="tradeAuthor" class="form-control">

        <label for="tradeGenre" class="form-label">Please enter trade-in genre:</label>
        <input type="text" id="tradeGenre" name="tradeGenre" class="form-control">
        </div>

       
        <button onclick="switchBooks(${bookid})" >Continue with trade-in</button>
        <button onclick="handleOnLoad()">Back to Home Page</button>
        </form>`

        document.getElementById('tablebody').innerHTML = html


    // await fetch(booksUrl, {
    //     method:"POST",
    //     body: JSON.stringify(newOrder),
    //     headers: {
    //         "Content-type": "application/json; charset=UTF-8"
    //     }
    // })
    // let response2 = await fetch(ordersUrl);
    // let data2 = await response2.json();
    // console.log(data2)
    // data2.forEach(function(order){
        
    //     console.log(order.id + order.completed);
    //     if(newOrder.bookID == order.bookID){
    //        finishBuyNow(order.id);
    //     }
        
    
}

    
async function switchBooks(bookid){
    let response = await fetch(booksUrl+"/"+bookid);
            let data = await response.json();
            console.log(data);
    
            tradeTitle = document.getElementById('tradeTitle').value;
            tradeAuthor = document.getElementById('tradeAuthor').value;
            tradeGenre = document.getElementById('tradeGenre').value;

            console.log(tradeTitle)
            let html =`
            <table class="table table-striped">
            <div 
            <tr>
                <th>Your Book</th>  
            </tr>     
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Page Count</th>
                <th>Type</th>
                <th>Genre</th>
                <th>Condition</th>   
            </tr>
            <tr>
            <td>${tradeTitle}</td>
            <td>${tradeAuthor}</td>
            <td>${tradePageCount}</td>
            <td>${tradeBookType}</td>
            <td>${tradeGenre}</td>
            <td>${tradeBookCondition}</td>
            </tr>
           
            <tr>
                <th>Book your trading for</th>  
            </tr>     
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Page Count</th>
                <th>Type</th>
                <th>Genre</th>
                <th>Condition</th>   
            </tr> 
            <tr>
            <td>${data.title}</td>
            <td>${data.author}</td>
            <td>${data.pageCount}</td>
            <td>${data.bookType}</td>
            <td>${data.genre}</td>
            <td>${data.condition}</td>
            </tr>

            </div> `
            

            let tradeBook = {title: tradeTitle, author: tradeAuthor, pageCount: tradePageCount, genre: tradeGenre, bookType: tradeBookType, price: data.price, condition: tradeBookCondition, deleted: false}
            console.log(tradeBook);
            console.log(bookid)
            console.log(tradeBook)
            handleBookSell(data.id)
                console.log(tradeBook)
                await fetch(booksUrl, {
                    method:"POST",
                    body: JSON.stringify(tradeBook),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
            html+=`
            <tr>
            <button onclick="handleOnLoad()">Back to Home Page</button>
            </tr>
            `
            
            document.getElementById('tablebody').innerHTML = html
            
}

async function inStoreTransaction(){
    console.log("Start instore transaction")
    createInvTable();
    
}

//TODO ------------------ADMIN PORTAL FUNCTIONS-------------------------//

function loadAdminPortal() 
{
    console.log('In loadAdminPortal()');

    
    let html =`
    
    <button onclick="loadTransactions()">Transaction History</button>
    
    <button onclick="loadBookInventory()">Inventory</button>
` 
    document.getElementById('tablebody').innerHTML = html;
}


function loadBookInventory() {
    console.log('In loadBookInventory()');
    //!ADD A LIST OF ALL INVENTORY ON HAND IN THE BOOKS TABLE
    //routes back to homepage
    let html =`<button onclick="loadAdminPortal()">Return to Admin Portal</button>`
    // html +=`</table>`
    document.getElementById('tablebody').innerHTML = html;
   createInvTable();
}



async function createInvTable() {
    try {
        const response = await fetch(booksUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        
        // Call the display function with the fetched data
        displayInvTable(json);
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}












//displays the final tabl table for inventory display
function displayInvTable(bookData) {

    console.log('In displayInvTable'); //!error checking

    if (!bookData || !Array.isArray(bookData)) {
        // Handle the case where bookData is undefined or not an array
        console.error('Invalid or missing data for book inventory');
        return;
    }


    let html =`
    <table class="table table-striped">
    <div 
   
    <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Author</th>
        <th>Page Count</th>
        <th>Type</th>
        <th>Genre</th>
        <th>Price</th>
        <th>Condition</th>
        <th scope="col">In-store purchase</th>
        
    </tr>       
    </div> `
    var count = 0
    bookData.forEach(function(book){
        if(book.deleted == false){
          count++
        html += `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pageCount}</td>
            <td>${book.bookType}</td>
            <td>${book.genre}</td>
            <td>${book.price}</td>
            <td>${book.condition}</td>
            `
        if (book.deleted == false){
            html+=  `
            <td><button type="button" class="btn active" data-bs-toggle="button" onclick="createInStoreOrder(${book.id})">In-store purchase</button></td>
            `
        }  
        }
        
            
          
    })
    const averagePrice = calculateAveragePrice(bookData);
    html +=`
    <div class="alert alert-secondary" role="alert">
     Total Number of Books in Inventory: ${count}
  </div>
   
  <div class="alert alert-secondary" role="alert">
    Avg book price: $${averagePrice}
  </div>
  <div class="alert alert-secondary" role="alert">
  <button onclick="loadAdminPortal()">Return to Admin Portal</button>
    </div>
    <!-- Sort by Title -->
    <button onclick="sortInventoryTable('title', 'asc')">Sort by Title (Asc)</button>
    <button onclick="sortInventoryTable('title', 'desc')">Sort by Title (Desc)</button>
    <!-- Sort by Price -->

     
    <!-- Sort by Author -->
    <button onclick="sortInventoryTable('author', 'asc')">Sort by Author (Asc)</button>
    <button onclick="sortInventoryTable('author', 'desc')">Sort by Author (Desc)</button>

        
   <!-- Sort by Page Count -->
   <button onclick="sortInventoryTable('pageCount', 'asc')">Sort by Page Count (Asc)</button>
   <button onclick="sortInventoryTable('pageCount', 'desc')">Sort by Page Count (Desc)</button>

   <!-- Sort by Genre -->
   <button onclick="sortInventoryTable('genre', 'asc')">Sort by Genre (Asc)</button>
   <button onclick="sortInventoryTable('genre', 'desc')">Sort by Genre (Desc)</button>

    <!-- price -->
    <button onclick="sortInventoryTable('price', 'asc')">Sort by Price (Asc)</button>
    <button onclick="sortInventoryTable('price', 'desc')">Sort by Price (Desc)</button>

    <!-- Sort by Condition -->
    <button onclick="sortInventoryTable('condition', 'asc')">Sort by Condition (Asc)</button>
    <button onclick="sortInventoryTable('condition', 'desc')">Sort by Condition (Desc)</button>

    <button onclick="loadAdminPortal()">Return to Admin Portal</button>
    


 `;
     

    document.getElementById('tablebody').innerHTML = html
}




//nEW Inventory SORTING FUCNTIONS

function sortInventoryTable(column, order) {
    console.log("In sortInventoryTable(column, order)");

    fetch(booksUrl)
        .then(response => response.json())
        .then(json => {
            const sortedBooks = json.sort((a, b) => {
                let comparison = 0;

                // Compare based on the specified column
                switch (column) {
                    case 'price':
                        comparison = a.price - b.price;
                        break;
                    case 'pageCount':
                        comparison = a.pageCount - b.pageCount;
                        break;
                    case 'title':
                        comparison = a.title.localeCompare(b.title);
                        break;
                    case 'author':
                        comparison = a.author.localeCompare(b.author);
                        break;
                    case 'genre':
                        comparison = a.genre.localeCompare(b.genre);
                        break;
                    case 'condition':
                        comparison = a.condition.localeCompare(b.condition);
                        break;
                    default:
                        // Handle other cases or set a default comparison
                        break;
                }

                // Apply the order
                return order === 'asc' ? comparison : -comparison;
            });

            displayInvTable(sortedBooks);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// more functions
function calculateAveragePrice(bookData) {
    if (!bookData || !Array.isArray(bookData) || bookData.length === 0) {
        // Handle the case where bookData is undefined, not an array, or an empty array
        console.error('Invalid or missing data for book inventory');
        return 0;
    }

    const totalPrices = bookData.reduce((sum, book) => sum + book.price, 0);
    const averagePrice = totalPrices / bookData.length;

    // Round to two decimal places
    return Math.round(averagePrice * 100) / 100;
}



function sortHomePage(column, order) {
    console.log("In sortInventoryTable(column, order)");

    fetch(booksUrl)
        .then(response => response.json())
        .then(json => {
            const sortedBooks = json.sort((a, b) => {
                let comparison = 0;

                // Compare based on the specified column
                switch (column) {
                    case 'price':
                        comparison = a.price - b.price;
                        break;
                    case 'pageCount':
                        comparison = a.pageCount - b.pageCount;
                        break;
                    case 'title':
                        comparison = a.title.localeCompare(b.title);
                        break;
                    case 'author':
                        comparison = a.author.localeCompare(b.author);
                        break;
                    case 'genre':
                        comparison = a.genre.localeCompare(b.genre);
                        break;
                    case 'condition':
                        comparison = a.condition.localeCompare(b.condition);
                        break;
                    default:
                        // Handle other cases or set a default comparison
                        break;
                }

                // Apply the order
                return order === 'asc' ? comparison : -comparison;
            });

            displayBookTable(sortedBooks);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
