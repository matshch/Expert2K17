using Expert2K17.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Expert2K17.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(Db context)
        {
            await context.Database.MigrateAsync();

            if (!context.Years.Any())
            {
                var year = new YearModel { Year = "2017" };
                context.Years.Add(year);
                context.Groups.Add(new GroupModel { Group = "ÈÓ5-71", Year = year });
                context.Groups.Add(new GroupModel { Group = "ÈÓ5-72", Year = year });
                context.Groups.Add(new GroupModel { Group = "ÈÓ5-73", Year = year });
                context.Groups.Add(new GroupModel { Group = "ÈÓ5-74", Year = year });
                context.Groups.Add(new GroupModel { Group = "ÐÒ5-71", Year = year });
                await context.SaveChangesAsync();
            }
        }
    }
}
