using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Expert2K17.Models
{
    public class GroupModel
    {
        public int Id { get; set; }
        [Required]
        public string Group { get; set; }
        [Required]
        public virtual YearModel Year { get; set; }
        public virtual IEnumerable<User> Users { get; set; }

        [SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public GroupModel()
        {
            Users = new List<User>();
        }
    }
}