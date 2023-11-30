namespace api.Models
{
    public class Book
    {
        public int id {get; set;}

        public string title {get; set;}

        public string author {get; set;}

        public int pageCount {get; set;}

        public string bookType {get; set;}

        public string genre {get; set;}

        public double price {get; set;}

        public string condition {get; set;}

        public bool deleted {get; set;}
    }
}