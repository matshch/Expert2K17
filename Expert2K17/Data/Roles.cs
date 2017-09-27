using System;

namespace Expert2K17.Data
{
    public enum Roles
    {
        Admin
    }

    public static class Role
    {
        public static readonly string Admin = Enum.GetName(typeof(Roles), Roles.Admin);
    }
}
