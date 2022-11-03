using Microsoft.AspNetCore.Mvc;

namespace sample2.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
