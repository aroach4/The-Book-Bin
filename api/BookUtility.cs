using api.Database;
using api.Models;
using MySql.Data.MySqlClient;
using System.Collections.Generic;


namespace api
{
    public class BookUtility
    {
        public List<Book> GetAllBooks(){
            ConnectionString db = new ConnectionString();
            using var con = new MySqlConnection(db.cs);
            List<Book> myBooks = new List<Book>();
            con.Open();
            string stm = "select * from books;";
            using var cmd = new MySqlCommand(stm, con);
            using MySqlDataReader rdr = cmd.ExecuteReader();
            while(rdr.Read())
            {
                // Book newBook = new Book();
                System.Console.WriteLine($"{rdr.GetInt32(0)} {rdr.GetString(1)}");
                // newBook.id = rdr.GetInt32(0);
                // newBook.activityType = rdr.GetString(1);
                myBooks.Add(new Book(){id = rdr.GetInt32(0), title = rdr.GetString(1), author = rdr.GetString(2), pageCount = rdr.GetInt32(3), bookType = rdr.GetString(4), genre = rdr.GetString(5), condition = rdr.GetString(7), price = rdr.GetDouble(6), deleted = rdr.GetBoolean(8)});
            }
            con.Close();
            return myBooks;
        }

        public void AddBook(Book myBook){
            
            ConnectionString db = new ConnectionString();
            using var con = new MySqlConnection(db.cs);
            con.Open();
            string stm = "INSERT INTO books (title, author, pageCount, bookType, genre, price, condition, deleted) VALUES (@title, @author, @pageCount, @bookType, @genre, @price, @condition, @deleted)";
            using var cmd = new MySqlCommand(stm, con);

            
            cmd.Parameters.AddWithValue("@title", myBook.title);
            cmd.Parameters.AddWithValue("@author", myBook.author);
            cmd.Parameters.AddWithValue("@pageCount", myBook.pageCount);
            cmd.Parameters.AddWithValue("@bookType", myBook.bookType);
            cmd.Parameters.AddWithValue("@genre", myBook.genre);
            cmd.Parameters.AddWithValue("@price", myBook.price);
            cmd.Parameters.AddWithValue("@condition", myBook.condition);
            cmd.Parameters.AddWithValue("@deleted", myBook.deleted);



            cmd.Prepare();
            cmd.ExecuteNonQuery();
            con.Close();
        }

        public void EditBook(int id, Book myBook){
                int activityId = id; // Replace with the ID of the book to update.
                
               
                // // Create the UPDATE SQL statement.
                // ConnectionString db = new ConnectionString();
                // using var con = new MySqlConnection(db.cs);
                // con.Open();
                // string stm = "UPDATE books SET pinned = @pin WHERE id = @id";
                // using var cmd = new MySqlCommand(stm, con);

                // // Set parameters for the SQL statement.
                // cmd.Parameters.AddWithValue("@pin", pinned);
                // cmd.Parameters.AddWithValue("@id", activityId);

                // // Execute the SQL statement to update the book.
                // int rowsAffected = cmd.ExecuteNonQuery();
                // con.Close();
        }

        public void DeleteBook(int id){
                int activityId = id; 
                
                bool delete = true;
                
                ConnectionString db = new ConnectionString();
                using var con = new MySqlConnection(db.cs);
                con.Open();
                string stm = "UPDATE books SET deleted = @delete WHERE id = @id";
                using var cmd = new MySqlCommand(stm, con);

                // Set parameters for the SQL statement.
                cmd.Parameters.AddWithValue("@delete", delete);
                cmd.Parameters.AddWithValue("@id", activityId);

                // Execute the SQL statement to update the book.
                int rowsAffected = cmd.ExecuteNonQuery();
                con.Close();
        }


    }
}