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
    public class OrdersController : ControllerBase
    {
        // GET: api/Orders
        [HttpGet]
        public List<Order> Get()
        {
            OrderUtility utility = new OrderUtility();
            return utility.GetAllOrders();
        }

        // GET: api/Orders/5
        [HttpGet("{id}", Name = "GetOrder")]
        public Order Get(int id)
        {
            OrderUtility utility = new OrderUtility();
            List<Order> myOrders = utility.GetAllOrders();
            foreach(Order order in myOrders){
                if(order.id == id){
                    return order;
                }
            } 
            return new Order();
        }
        // POST: api/Orders
        [HttpPost]
        public void Post([FromBody] Order myOrder)
        {
            
            OrderUtility utility = new OrderUtility();
            utility.AddOrder(myOrder);
            System.Console.WriteLine(myOrder);
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
       public void Put(int id, [FromBody] string completionDate)
        {
            OrderUtility utility = new OrderUtility();
            utility.updateOrder(id, completionDate);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
      public void Delete(int id)
        {
            System.Console.WriteLine(id + " Order Delete");
            OrderUtility utility = new OrderUtility();
            utility.DeleteOrder(id);
        }
    }
}
