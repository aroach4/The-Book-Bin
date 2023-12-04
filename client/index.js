const booksUrl = "http://localhost:5275/api/books"

const ordersUrl = "http://localhost:5275/api/orders"

const adminsUrl = "http://localhost:5275/api/admins"

let myAdmins;

// async function test(){
//     let response = await fetch(adminsUrl);
//     let data = await response.json();
//     myAdmins = data;
//     console.log(myAdmins);  
// }

let myBooks;
let cart;
//roach test


//johnson edit move the heading to index.html
function handleOnLoad() {
   // test();
    console.log('handle on load called')
    let html=`


        <div class="p-2 mb-3 bg-body-tertiary rounded-3">
        <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">Tuscaloosa Book Bin</h1>
        <p class="col-md-8 fs-4">Tuscaloosa's first choice in book purchasing!</p>
        <button onclick="loadMainPage()">Home</button>
        <button onclick="loadTradeForm()">Trade a Book</button>
        <button onclick="loadCart()">Cart</button>
        <button onclick="loadAdminPortal()">Admin Login</button>
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
// Builds the book table header, calls another method to build the rows. Will need to be adjusted for the cards.
// Below is an example, it makes a two column table with as many rows as there is relevant data.
// Likely just pull the header building out and change the row building to fill in cards.
// Shaliyah should have more information on making cards.

//just displays the book
function displayBookTable(myBooks) {
    let html =`
    <table class="table table-striped">
        <tr>
            <th>Book</th>
            <th>Price</th>
            <th></th>
            <th></th>
        </tr>`
        let empty = true;
        myBooks.forEach(function(book){
        
        
            console.log(book.title + book.deleted);
            if(book.deleted == false){
                empty = false;
               html += `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.price}</td>
                    <td><button onclick="displayBookInfo('${book.id}')">More Info on ${book.title}</button></td>
                    <td><button onclick="loadBuyPage(${book.id})" >Buy this book</button></td>               
                </tr>` 
            }        
        })
        if(empty == true){
            html += `
                <tr>
                    <td>Sold Out!</td>
                </tr>
            `
        }
        html +=`</table>`
        document.getElementById('tablebody').innerHTML = html
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
    let customerEmail = document.getElementById('cartEmail').value;
    let shippingAddress = document.getElementById('cartShippingAddress').value;

    try {
        let response = await fetch(ordersUrl);
        let data = await response.json();
        let myOrders = data.filter(order => !order.completed && order.custEmail.trim() === customerEmail.trim() && order.shippingAddress.trim() === shippingAddress.trim());
        let total = calculateTotalPrice(myOrders);

        let html = `
            <button onclick="buyAll('${customerEmail}', '${shippingAddress}')">Checkout entire cart</button>
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

async function buyAll(customerEmail, shippingAddress) {
    try {
        let response = await fetch(ordersUrl);
        let data = await response.json();
        let myOrders = data.filter(order => !order.completed && order.custEmail.trim() === customerEmail.trim() && order.shippingAddress.trim() === shippingAddress.trim());

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
            html += `<div class="alert alert-success"><strong>${order.bookTitle} successfully purchased and shipped to ${order.shippingAddress}!</strong></div>`;
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

function calculateTotalPrice(orders) {
    return orders.reduce((sum, order) => sum + order.bookPrice, 0);
}


//! LOGIN SECURITY
// function loadAdminLogin() {
//     let html =
//     `  <form action="/action_page.php">
//         <div class="form-group">
//             <label for="email">Email address:</label>
//             <input type="email" class="form-control" id="email">
//         </div>

//         <div class="form-group">
//             <label for="pwd">Password:</label>
//             <input type="password" class="form-control" id="pwd">
//         </div>

//         <div class="checkbox">
//           <label><input type="checkbox"> Remember me</label>
//         </div>
//         <button type="submit" class="btn btn-default">Submit</button>
//     </form>`
//     html +=`</table>`
//     document.getElementById('tablebody').innerHTML = html
//     // Checking for correct credentials, probably a better/correct way to do this though.
//     if (email=="CorrectName" && pword=="CorrectPassword") {
//         loadAdminPortal()
//     }
// }

// //! test: Original email
// {/* <div class="form-group">
// <label for="email">Email address:</label>
// <input type="email" class="form-control" id="email">
// </div> */}

//! AIDAN EDITS: TRANSACTION TABLE``````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````


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

//displays the final table table for inventory display
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

  <div >
  <button type="button"  onclick="sortTable('odasc')">Sort by Order Date (Asc)</button>
  <button type="button" onclick="sortTable('oddesc')">Sort by Order Date (Desc)</button>
  <button type="button"  onclick="sortTable('cdasc')">Sort by Completion Date (Asc)</button>
  <button type="button" onclick="sortTable('cddesc')">Sort by Completion Date (Desc)</button>
  <button type="button"  onclick="sortTable('priceasc')">Sort by Revenue (Asc)</button>
  <button type="button" onclick="sortTable('pricedesc')">Sort by Revenue (Desc)</button>
</div>
`
//      html = `
//     <div
//     <button type="button"  class="btn btn-primary btn-lg" onclick="sortTable('pageCount', 'asc')">Sort by Page Count (Low to High)</button>
//             <button type="button"  class="btn btn-primary btn-lg" onclick="sortTable('pageCount', 'desc')">Sort by Page Count (High to Low)</button>
//    </div>
//         `

    document.getElementById('tablebody').innerHTML = html
}

//!END AIDAN EDITS ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//todo moved this info up--------------------------------------------------------------------------------------------------------------------------------------------------




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








//TODO ------------------ADMIN PORTAL FUNCTIONS-------------------------//
function loadAdminPortal() {
    console.log('In loadAdminPortal()');

    let html =`
    <div class="alert alert-info" role="alert">
      1. Shaliyah is working on Inventory page
    </div>

     <div class="alert alert-info" role="alert">
          2. Still needed: a) Reports page which contains Sales Revenue Report graph b) Transaction History page which shows all completed orders
      </div>

    <button onclick="loadTransactions()">Transaction History</button>
    <button onclick="loadReportsPage()">Reports</button>
    <button onclick="loadBookInventory()">Inventory</button>
    <button onclick="loadMainPage()">Home</button>`    
   
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

//fetchs the book data
function createInvTable()
 {
  
    console.log('IN createInvTable');
    
    const url =  booksUrl  //! BOOKS API

    fetch(url).then(function(response){
        console.log(response)
        return response.json()
    })
    .then(function(json){
        console.log(json)
        // display the table
        displayInvTable(json)
    })
    .catch(function(error) {
        console.error('Error fetching data:', error)
    })
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
        <th scope="col">Edit</th>
        <th scope="col">Delete</th>
      
    </tr>       
    </div> `
    var count = 0
    bookData.forEach(function(book){
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
            <td><button onclick="handleEditBook(${book.id})">Edit</button></td>
            <td><button class = "btn btn-danger" onclick="">Delete</button></td>
        </tr>`
    })
    html +=`
    
  <div class="alert alert-secondary" role="alert">
     Total Number of Books in Inventory: ${count}
  </div>
   
  <div class="alert alert-secondary" role="alert">
    Avg book price: $$
  </div>

  <div class="alert alert-danger" role="alert">
    ATTENTION: To do on this page: 
        1) Add functionality to CRUD buttons: ('ADD', Edit Delete)
        2) Sort functions: by page count, Sort alphabetcally by..title,author,genre,etc 
        3) Remove second header
</div>`

    document.getElementById('tablebody').innerHTML = html
}



//todo Shaliyah new changes/ Added edit button
async function handleEditBook(bookId) {
    try {
        // Fetch the details of the selected book using its ID
        let response = await fetch(booksUrl + "/" + bookId);
        console.log(response);
        let data = await response.json();

        // Display a form for editing the book details
        let html = `
        <h3>Edit Book</h3>
        <form id="editBookForm" onsubmit="saveEditedBook(${data.id}); return false;">
            <div class="mb-3">
                <label for="editTitle" class="form-label">Title:</label>
                <input type="text" class="form-control" id="editTitle" value="${data.title}" placeholder="Enter Title" required>
            </div>
            <div class="mb-3">
                <label for="editAuthor" class="form-label">Author:</label>
                <input type="text" class="form-control" id="editAuthor" value="${data.author}" placeholder="Enter Author" required>
            </div>
            <div class="mb-3">
                <label for="editPageCount" class="form-label">Page Count:</label>
                <input type="number" class="form-control" id="editPageCount" value="${data.pageCount}" placeholder="Enter Page Count" required>
            </div>
            <div class="mb-3">
                <label for="editBookType" class="form-label">Book Type:</label>
                <input type="text" class="form-control" id="editBookType" value="${data.bookType}" placeholder="Audio/Paperback/Hardcover" required>
            </div>

            <div class="mb-3">
                <label for="editGenre" class="form-label">Genre:</label>
                <input type="text" class="form-control" id="editGenre" value="${data.genre}" placeholder="Enter Genre" required>
            </div>      

            <div class="mb-3">
                <label for="editPrice" class="form-label">Price:</label>
                <input type="number" class="form-control" id="editPrice" value="${data.price}" step="0.01" min="0" max="9999999.99" placeholder="Enter price" required>
            </div>

            <div class="mb-3">
                <label for="editCondition" class="form-label">Condition:</label>
                <input type="text" class="form-control" id="editCondition" value="${data.condition}" placeholder="Enter Condition" required>
            </div>

            <button type="submit" onsubmit ="saveEditedBook(${data.id})"class="btn btn-primary">Save Changes</button>
        </form>
        `;
console.log(data + "form");

        document.getElementById('tablebody').innerHTML = html;
    } catch (error) {
        console.error('Error fetching book details for editing:', error);
    }


}



// delete book entry


async function saveEditedBook(bookId) {
    try {
        console.log(data + "form");
        // Gets the edited values from the form
        let editedTitle = document.getElementById('editTitle').value;
        let editedAuthor = document.getElementById('editAuthor').value;
        let editedPagecount = document.getElementById('editPageCount').value;
        let editedBookType= document.getElementById('editBookType').value;
        let editedGenre = document.getElementById('editGenre').value;
        let editedPrice = document.getElementById('editPrice').value;
        let editedCondition= document.getElementById('editCondition').value;

        // Creates an object with the edited data
        let editedBook = {
            title: editedTitle,
            author: editedAuthor,
            pageCount:  editedPagecount,
            bookType: editedBookType,
            genre: editedGenre,
            price :editedPrice,
            condition: editedCondition,
        };

        // Updates the book in the database
       await  fetch(booksUrl + "/" + bookId, {
            method: "PUT",
            body: JSON.stringify(editedBook),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });

        // Display a success message or redirect to the book inventory page
        loadBookInventory();
    } catch (error) {
        console.error('Error saving edited book:', error);
    }
}