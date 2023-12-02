using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Database;
using api;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        // GET: api/Books
        // "Hey, give me the list of all books you know about!"
        [HttpGet]
        public List<Book> Get()
        {
            BookUtility utility = new BookUtility();
            return utility.GetAllBooks();
        }

        // GET: api/Books/5
        //  "Tell me about the book with ID 5!"
        [HttpGet("{id}", Name = "GetBook")]
        public Book Get(int id)
        {
            BookUtility utility = new BookUtility();
            List<Book> myBooks = utility.GetAllBooks();
            foreach(Book book in myBooks){
                if(book.id == id){
                    return book;
                }
            } 
            return new Book();
        }

        // POST: api/Books
        //  "Hey, I've got a new book! Can you add it to your list?"
        /*You provide all the details about the new book (title, author, etc.).
The system uses its helper to add this new book to its storage (like putting a new book on a shelf).*/
        [HttpPost]
        public void Post([FromBody] Book myBook)
        {
            
            BookUtility utility = new BookUtility();
            utility.AddBook(myBook);
            System.Console.WriteLine(myBook);
        }

        // PUT: api/Books/5
       // "I want to change something about the book with ID 5!"
       /*The system (your API) has a helper (the BookUtility class) that knows how to get all the books from the storage (like a database).
It sends back a list of all the books it has.*/
        [HttpPut("{id}")]
         public void Put(int id, [FromBody] Book myBook)
        {
            BookUtility utility = new BookUtility();
            utility.EditBook(id, myBook);
        }

        // DELETE: api/Books/5
        //"Remove the book with ID 5 from your list."
        /*
        */
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            BookUtility utility = new BookUtility();
            utility.DeleteBook(id);
        }
    }
}
