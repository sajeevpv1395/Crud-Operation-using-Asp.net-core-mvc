using Microsoft.AspNetCore.Mvc;

namespace sample2.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
