using Expert2K17.Data;
using Expert2K17.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]")]
    public class TestsController : Controller
    {
        private readonly Db _db;
        private readonly UserManager<User> _userManager;

        public TestsController(Db db, UserManager<User> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        // GET: api/tests
        [HttpGet]
        public IEnumerable<Test> Get()
        {
            return from s in _db.Tests.Include(e => e.User)
                   where s.Published == true
                   orderby s.PublishedAt
                   select new Test
                   {
                       Id = s.Id,
                       Name = s.Name,
                       Description = s.Description,
                       Picture = s.Picture,
                       User = new UserJSON
                       {
                           Id = s.User.Id,
                           Username = s.User.UserName,
                           Surname = s.User.Surname,
                           Name = s.User.Name,
                           Patronymic = s.User.Patronymic
                       }
                   };
        }

        // GET api/tests/guid
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(Guid id)
        {
            var test = await _db.Tests.FindAsync(id);
            if (test == null)
            {
                return NotFound();
            }
            if (test.Published != true)
            {
                var loader = _db.Entry(test).Reference(e => e.User).LoadAsync();
                var userId = _userManager.GetUserId(User);
                await loader;
                if (test.User.Id != userId)
                {
                    return BadRequest("Wrong user");
                }
            }
            return new ContentResult { Content = test.PublishedJson, ContentType = "application/json" };
        }

        public class UserJSON
        {
            public string Id;
            public string Username;
            public string Surname;
            public string Name;
            public string Patronymic;
        }

        public class Test
        {
            public Guid Id;
            public string Name;
            public string Description;
            public string Picture;
            public UserJSON User;
        }
    }
}
