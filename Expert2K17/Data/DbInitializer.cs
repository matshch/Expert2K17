using Microsoft.EntityFrameworkCore;

namespace Expert2K17.Data
{
    public static class DbInitializer
    {
        public static void Initialize(Db context)
        {
            context.Database.Migrate();
        }
    }
}
