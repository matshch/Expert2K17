using Microsoft.EntityFrameworkCore;

namespace Expert2K17.Data
{
    public class Db : DbContext
    {
        public Db(DbContextOptions<Db> options) : base(options) { }
    }
}
