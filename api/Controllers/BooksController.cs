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
        [HttpGet]
        public List<Book> Get()
        {
            BookUtility utility = new BookUtility();
            return utility.GetAllBooks();
        }

        // GET: api/Books/5
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
        [HttpPost]
        public void Post([FromBody] Book myBook)
        {
            
            BookUtility utility = new BookUtility();
            utility.AddBook(myBook);
            System.Console.WriteLine(myBook);
        }

        // PUT: api/Books/5
        [HttpPut("{id}")]
         public void Put(int id, [FromBody] Book myBook)
        {
            BookUtility utility = new BookUtility();
            utility.EditBook(id, myBook);
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            BookUtility utility = new BookUtility();
            utility.DeleteBook(id);
        }
    }
}
