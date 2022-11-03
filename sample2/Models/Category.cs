using System.ComponentModel.DataAnnotations;

namespace sample2.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        [Required]
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public string Name { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

        public int DisplayOrder { get; set; }

        public DateTime CreatedDate { get; set; }= DateTime.Now;
    }
}
