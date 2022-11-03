using Microsoft.AspNetCore.Mvc;
using sample2.Data;
using sample2.Models;
using sample2.temp;

namespace sample2.Controllers
{
    public class SignupController : Controller
    {
        private readonly SampleDbContext _db;

        public SignupController(SampleDbContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public (int,string) SaveSignUp(SignupModel obj)
        {
            (int,string) result = (0,String.Empty);
            Signup signup=new Signup();
            signup.Id = obj.Id;
            signup.FirstName= obj.FirstName;
            signup.LastName= obj.LastName;
            signup.PhoneNumber= obj.PhoneNumber;
            signup.Email= obj.Email;
            signup.Qualification= obj.Qualification;
            signup.CreatedDate=DateTime.Now;
            if (obj.FirstName == null)
            {
                ModelState.AddModelError("name", "The DisplayOrder cannot exactly match the Name.");
                result = (2, "please fill mandatory  fields");
            }
            if (ModelState.IsValid)
            {
                _db.Signups.Add(signup);
                _db.SaveChanges();
                result = (1,"data uploaded successfully");


            }
            
            return result;
        }
       
    }
}
