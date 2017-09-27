using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Expert2K17.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(Db context)
        {
            await context.Database.MigrateAsync();
        }
    }
}
