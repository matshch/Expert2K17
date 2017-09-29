using Expert2K17.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Expert2K17.Data
{
    public class Db : IdentityDbContext<User>
    {
        public Db(DbContextOptions<Db> options) : base(options) { }

        public DbSet<YearModel> Years { get; set; }
        public DbSet<GroupModel> Groups { get; set; }
    }
}
