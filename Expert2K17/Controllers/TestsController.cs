using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Expert2K17.Data;
using Microsoft.EntityFrameworkCore;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]")]
    public class TestsController : Controller
    {
        private readonly Db _db;

        public TestsController(Db db)
        {
            _db = db;
        }

        // GET: api/tests
        [HttpGet]
        public IEnumerable<Test> Get()
        {
            return from s in _db.Tests.Include(e => e.User)
                   //TODO: where s.Published == true
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

        // GET api/tests/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            throw new NotImplementedException();
        }
    }
}
