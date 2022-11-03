using Microsoft.AspNetCore.Mvc;

namespace sample2.Controllers
{
    public class DemoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
