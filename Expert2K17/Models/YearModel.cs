using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace Expert2K17.Models
{
    public class YearModel
    {
        [Key]
        public string Year { get; set; }
        public virtual IEnumerable<GroupModel> Groups { get; set; }

        [NotMapped]
        public IEnumerable<User> Users {
            get => Groups.SelectMany(e => e.Users);
        }

        [SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public YearModel()
        {
            Groups = new List<GroupModel>();
        }
    }
}
