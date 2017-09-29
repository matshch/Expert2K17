using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Expert2K17.Models
{
    public class User : IdentityUser
    {
        public string Surname { get; set; }
        public string Name { get; set; }
        public string Patronymic { get; set; }

        public virtual GroupModel Group { get; set; }

        [NotMapped]
        public YearModel Year
        {
            get => Group?.Year;
        }
    }
}
