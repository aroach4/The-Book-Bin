using api.Database;
using api.Models;
using MySql.Data.MySqlClient;
using System.Collections.Generic;


namespace api
{
    public class AdminUtility
    {
        public List<Admin> GetAllAdmins()
        {
            ConnectionString db = new ConnectionString();
            using var con = new MySqlConnection(db.cs);

            List<Admin> myAdmins = new List<Admin>();
            con.Open();
            string stm = "select * from admins;"; //SQL Query
            using var cmd = new MySqlCommand(stm, con);

// Loop through the result set and populate the list of Admin objects.
            using MySqlDataReader rdr = cmd.ExecuteReader();
            while(rdr.Read())
            {
               
                 // Output the values of the first and second columns to the console.
                System.Console.WriteLine($"{rdr.GetString(0)} {rdr.GetString(1)}");
             
                myAdmins.Add(new Admin(){id = rdr.GetInt32(0), username = rdr.GetString(1), password = rdr.GetString(2)});
            }
            con.Close();
            return myAdmins;
        }
     public void AddAdmin(Admin myAdmin){
            
             ConnectionString db = new ConnectionString();
            using var con = new MySqlConnection(db.cs);
             con.Open();
            string stm = "INSERT INTO admins (username, password) VALUES (@username, @password)";
             using var cmd = new MySqlCommand(stm, con);
            
            cmd.Parameters.AddWithValue("@username", myAdmin.username);
             cmd.Parameters.AddWithValue("@password", myAdmin.password);
         
           
            cmd.Prepare();
          cmd.ExecuteNonQuery();
           con.Close();
         }


    }
}