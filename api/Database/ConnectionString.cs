namespace api.Database
{
    public class ConnectionString
    {
        public string cs {get; set;}

        public ConnectionString(){
            string server = "eyw6324oty5fsovx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
            string database = "bcq9h7n2ihzi09ts";
            string port = "3306";
            string userName = "dg06jmuwnmqecr1f";
            string password = "mm28rwr2a5re5ob5";

            cs = $@"server = {server}; user ={userName}; database = {database}; port = {port}; password = {password};";
        }
    }
}