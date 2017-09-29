using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Expert2K17.Models
{
    public class User : IdentityUser
    {
        public virtual GroupModel Group { get; set; }

        [NotMapped]
        public YearModel Year
        {
            get => Group?.Year;
        }
    }
}
