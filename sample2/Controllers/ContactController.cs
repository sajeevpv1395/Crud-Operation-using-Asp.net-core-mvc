using Microsoft.AspNetCore.Mvc;
using sample2.Data;
using sample2.Models;
using sample2.temp;

namespace sample2.Controllers
{
    public class ContactController : Controller
    {
        private readonly SampleDbContext _db;
         
        public ContactController(SampleDbContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public (int, string) SaveContactUs(ContactModel obj)
        {
            (int, string) result = (0, String.Empty);
            Contact contact = new Contact();
            contact.Id = obj.Id;
            contact.FirstName = obj.FirstName;
            contact.LastName = obj.LastName;
            contact.PhoneNumber = obj.PhoneNumber;
            contact.Email = obj.Email;
            contact.Qualification = obj.Qualification;
            contact.CreatedDate = DateTime.Now;
            if (obj.FirstName == null)
            {
                ModelState.AddModelError("name", "The DisplayOrder cannot exactly match the Name.");
                result = (2, "please fill mandatory  fields");
            }
            if (ModelState.IsValid)
            {
                _db.Contacts.Add(contact);
                _db.SaveChanges();
                result = (1, "data uploaded successfully");


            }

            return result;
        }

    }
}
