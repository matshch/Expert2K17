using System;
using System.ComponentModel.DataAnnotations;

namespace Expert2K17.Models
{
    public class Test
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public string Picture { get; set; }
        public bool Published { get; set; }

        public DateTime PublishedAt { get; set; }

        [Required]
        public string PublishedJson { get; set; }
        [Required]
        public string AutosavedJson { get; set; }

        [Required]
        public virtual User User { get; set; }

        public Test()
        {
            Id = Guid.NewGuid();
            Picture = "/default/system.png";

            Published = false;
            PublishedAt = DateTime.Now;
        }
    }
}
