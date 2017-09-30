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

        public DbSet<Test> Tests { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<YearModel>().HasIndex(e => e.Year).IsUnique();
        }
    }
}
