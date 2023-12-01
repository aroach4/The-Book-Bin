using api.Database;
using api.Models;
using MySql.Data.MySqlClient;
using System.Collections.Generic;


namespace api
{
    public class OrderUtility
    {
        public List<Order> GetAllOrders(){
            ConnectionString db = new ConnectionString();
            using var con = new MySqlConnection(db.cs);
            List<Order> myOrders = new List<Order>();
            con.Open();
            string stm = "select * from orders;";
            using var cmd = new MySqlCommand(stm, con);
            using MySqlDataReader rdr = cmd.ExecuteReader();
            while(rdr.Read())
            {
                // Order newOrder = new Order();
                
                // newOrder.id = rdr.GetInt32(0);
                // newOrder.activityType = rdr.GetString(1);
                myOrders.Add(new Order(){id = rdr.GetInt32(0), custEmail = rdr.GetString(1), shippingAddress = rdr.GetString(2), bookID = rdr.GetInt32(3), bookPrice = rdr.GetDouble(4), bookTitle = rdr.GetString(5), orderDate = rdr.GetString(6), completionDate = rdr.GetString(7), completed = rdr.GetBoolean(8)});
            }
            con.Close();
            return myOrders;
        }

        public void AddOrder(Order myOrder)
        {
            ConnectionString db = new ConnectionString();
            using var con = new MySqlConnection(db.cs);
            con.Open();

            string stm = "INSERT INTO orders (custEmail, shippingAddress, bookID, bookPrice, bookTitle, orderDate, completionDate, completed)" +
                        "VALUES (@custEmail, @shippingAddress, @bookID, @bookPrice, @bookTitle, @orderDate, @completionDate, @completed)";

            using var cmd = new MySqlCommand(stm, con);

            cmd.Parameters.AddWithValue("@orderDate", myOrder.orderDate);
            cmd.Parameters.AddWithValue("@custEmail", myOrder.custEmail);
            cmd.Parameters.AddWithValue("@shippingAddress", myOrder.shippingAddress);
            cmd.Parameters.AddWithValue("@bookID", myOrder.bookID);
            cmd.Parameters.AddWithValue("@bookPrice", myOrder.bookPrice);
            cmd.Parameters.AddWithValue("@bookTitle", myOrder.bookTitle);
            cmd.Parameters.AddWithValue("@completionDate", myOrder.completionDate);
            cmd.Parameters.AddWithValue("@completed", myOrder.completed);

            // Remove the Prepare() call, as it's not necessary in this case.

            cmd.ExecuteNonQuery();

            con.Close();
        }

        public void updateOrder(int id, string completionDate){
                int activityId = id; // Replace with the ID of the book to update.
                
                
                // Create the UPDATE SQL statement.
                ConnectionString db = new ConnectionString();
                using var con = new MySqlConnection(db.cs);
                con.Open();
                string stm = "UPDATE orders SET completionDate = @completionDate WHERE id = @id";
                using var cmd = new MySqlCommand(stm, con);

                // Set parameters for the SQL statement.
                cmd.Parameters.AddWithValue("@completionDate", completionDate);
                cmd.Parameters.AddWithValue("@id", activityId);

                // Execute the SQL statement to update the book.
                int rowsAffected = cmd.ExecuteNonQuery();
                con.Close();
        }

           public void DeleteOrder(int id){
               int activityId = id;
                bool complete = true; // This variable should represent the 'completed' status

                ConnectionString db = new ConnectionString();
                using var con = new MySqlConnection(db.cs);
                con.Open();
                string stm = "UPDATE orders SET completed = @complete WHERE id = @id";
                using var cmd = new MySqlCommand(stm, con);

                // Set parameters for the SQL statement.
                cmd.Parameters.AddWithValue("@complete", complete);
                cmd.Parameters.AddWithValue("@id", activityId);

                // Execute the SQL statement to update the order.
                int rowsAffected = cmd.ExecuteNonQuery();
                con.Close();
        }
    }
}