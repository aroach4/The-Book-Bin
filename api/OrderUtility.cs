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
                // Book newBook = new Book();
                System.Console.WriteLine($"{rdr.GetInt32(0)} {rdr.GetInt32(1)}");
                // newBook.id = rdr.GetInt32(0);
                // newBook.activityType = rdr.GetString(1);
                myOrders.Add(new Order(){id = rdr.GetInt32(0), quantity = rdr.GetInt32(1)});
            }
            con.Close();
            return myOrders;
        }
    }
}