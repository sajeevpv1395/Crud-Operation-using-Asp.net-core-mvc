using System.ComponentModel.DataAnnotations;

namespace sample2.Models
{
    public class Login
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Email { get; set; }

        public string Password { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
