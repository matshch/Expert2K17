using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Expert2K17.Models
{
    public class User : IdentityUser
    {
        public string Surname { get; set; }
        public string Name { get; set; }
        public string Patronymic { get; set; }

        public virtual GroupModel Group { get; set; }
        public virtual IEnumerable<Test> Tests { get; set; }

        [NotMapped]
        public YearModel Year
        {
            get => Group?.Year;
        }

        [SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public User()
        {
            Tests = new List<Test>();
        }
    }
}
