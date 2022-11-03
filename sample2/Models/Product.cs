using System.ComponentModel.DataAnnotations;

namespace sample2.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Country { get; set; }
        public string Subject { get; set; }


        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
