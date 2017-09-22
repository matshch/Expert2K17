using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Expert2K17.Data
{
    public static class RolesCreator
    {
        public static async Task CreateAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roleNames = { "Admin" };
            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }
        }
    }
}
