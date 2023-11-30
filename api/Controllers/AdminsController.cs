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
    public class AdminsController : ControllerBase
    {
         // GET: api/Admins
        [HttpGet]
        public List<Admin> Get()
        {
            AdminUtility utility = new AdminUtility();
            return utility.GetAllAdmins();
        }

        // GET: api/Admins/5
        [HttpGet("{id}", Name = "GetAdmin")]
        public Admin Get(int id)
        {
            AdminUtility utility = new AdminUtility();
            List<Admin> myAdmins = utility.GetAllAdmins();
            foreach(Admin admin in myAdmins){
                if(admin.id == id){
                    return admin;
                }
            } 
            return new Admin();
        }

        // POST: api/Admins
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Admins/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Admins/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
