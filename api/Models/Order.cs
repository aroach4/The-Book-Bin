namespace api.Models
{
    public class Order
    {
        public int id {get; set;}

        public string custEmail {get; set;}

        public string shippingAddress {get; set;}

        public int bookID {get; set;}

        public double bookPrice {get; set;}

        public string bookTitle {get; set;}

        public string orderDate {get; set;}

        public string completionDate {get; set;}

        public bool completed {get; set;}
    }
}