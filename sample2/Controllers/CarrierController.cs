using Microsoft.AspNetCore.Mvc;
using sample2.Data;
using sample2.Models;
using sample2.temp;

namespace sample2.Controllers
{
    public class CarrierController : Controller
    {
        private readonly SampleDbContext _db;

        public CarrierController(SampleDbContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            IEnumerable<Carrier> objCarrierList = _db.Carriers;
            return View(objCarrierList);
        }

        public IActionResult Create()
        {
            
            return View();
        }
        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Carrier obj)
        {
            if (obj.FirstName == obj.LastName.ToString())
            {
                ModelState.AddModelError("first name", "The Lastname cannot exactly match the firstName.");
            }
            if (ModelState.IsValid)
            {
                _db.Carriers.Add(obj);
                _db.SaveChanges();
                return RedirectToAction();
                TempData["success"] = "Category created successfully";
            }
            return View(obj);   
        }

    
        //GET
        public IActionResult Edit(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var carrierFromDb = _db.Carriers.Find(id);
            //var categoryFromDbFirst = _db.Categories.FirstOrDefault(u=>u.Id==id);
            //var categoryFromDbSingle = _db.Categories.SingleOrDefault(u => u.Id == id);

            if (carrierFromDb == null)
            {
                return NotFound();
            }

            return View(carrierFromDb);
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Carrier obj)
        {
         
            if (ModelState.IsValid)
            {
                _db.Carriers.Update(obj);
                _db.SaveChanges();
                TempData["success"] = "Category updated successfully";
                return RedirectToAction("Index");
            }
            return View(obj);
        }

        public IActionResult Delete(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }
            var carrierFromDb = _db.Carriers.Find(id);
            //var categoryFromDbFirst = _db.Categories.FirstOrDefault(u=>u.Id==id);
            //var categoryFromDbSingle = _db.Categories.SingleOrDefault(u => u.Id == id);

            if (carrierFromDb == null)
            {
                return NotFound();
            }

            return View(carrierFromDb);
        }

        //POST
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeletePOST(int? id)
        {
            var obj = _db.Carriers.Find(id);
            if (obj == null)
            {
                return NotFound();
            }

            _db.Carriers.Remove(obj);
            _db.SaveChanges();
            TempData["success"] = "Category deleted successfully";
            return RedirectToAction("Index");
        }




    }
}
