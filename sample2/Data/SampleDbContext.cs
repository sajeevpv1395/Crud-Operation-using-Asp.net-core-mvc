using Microsoft.EntityFrameworkCore;
using sample2.Models;

namespace sample2.Data
{
    public class SampleDbContext:DbContext
    {
      public SampleDbContext(DbContextOptions<SampleDbContext>options):base(options)
        {

        }
        public DbSet<Category> Categories { get; set; }

        public DbSet<Carrier> Carriers { get; set; }

        public DbSet<Contact> Contacts { get; set; }

        public DbSet<Login> Logins { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Signup> Signups { get; set; }
    }


}
