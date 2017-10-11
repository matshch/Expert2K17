using Expert2K17.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = Role.Admin)]
    public class AdminController : Controller
    {
        private readonly Db _db;

        public AdminController(Db db)
        {
            _db = db;
        }

        // GET: api/admin/getTests
        [HttpGet]
        public IEnumerable<Test> GetTests()
        {
            return from s in _db.Tests.Include(e => e.User)
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

        // GET: api/admin/getUsers
        [HttpGet]
        public IEnumerable<UserData> GetUsers()
        {
            return (from u in _db.Users.Include(e => e.Group.Year)
                   orderby u.NormalizedUserName
                   select new UserData
                   {
                       Id = u.Id,
                       UserName = u.UserName,

                       Surname = u.Surname,
                       Name = u.Name,
                       Patronymic = u.Patronymic,

                       Group = u.Group != null ? u.Group.Group : null,
                       Year = u.Group != null ? u.Group.Year.Year : null,

                       Userpic = u.Userpic,
                       Cover = u.Cover
                   }).ToList();
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

        public class UserData
        {
            public string Id { get; set; }
            public string UserName { get; set; }

            public string Surname { get; set; }
            public string Name { get; set; }
            public string Patronymic { get; set; }

            public string Group { get; set; }
            public string Year { get; set; }

            public string Userpic { get; set; }
            public string Cover { get; set; }
        }
    }
}
