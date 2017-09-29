using Expert2K17.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]")]
    public class GroupsController : Controller
    {
        public readonly Db _db;

        public GroupsController(Db db)
        {
            _db = db;
        }

        // GET: api/groups
        [HttpGet]
        public IEnumerable<object> Get()
        {
            var years = from y in _db.Years
                        select new
                        {
                            y.Year,
                            Groups = y.Groups.Select(e => e.Group)
                        };
            return years.ToList();
        }
    }
}
