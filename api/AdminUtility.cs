using api.Database;
using api.Models;
using MySql.Data.MySqlClient;
using System.Collections.Generic;


namespace api
{
    public class AdminUtility
    {
        public List<Admin> GetAllAdmins(){
            ConnectionString db = new ConnectionString();
            using var con = new MySqlConnection(db.cs);
            List<Admin> myAdmins = new List<Admin>();
            con.Open();
            string stm = "select * from admins;";
            using var cmd = new MySqlCommand(stm, con);
            using MySqlDataReader rdr = cmd.ExecuteReader();
            while(rdr.Read())
            {
                // Admin newAdmin = new Admin();
                System.Console.WriteLine($"{rdr.GetString(0)} {rdr.GetString(1)}");
                // newAdmin.id = rdr.GetInt32(0);
                // newAdmin.activityType = rdr.GetString(1);
                myAdmins.Add(new Admin(){id = rdr.GetInt32(0), username = rdr.GetString(1), password = rdr.GetString(2)});
            }
            con.Close();
            return myAdmins;
        }
    }
}