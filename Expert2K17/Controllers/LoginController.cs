using Expert2K17.Models;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public LoginController(SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // GET: api/login
        // Returns current user information
        [HttpGet]
        public async Task<User> GetAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            return user;
        }

        // POST api/values
        // login
        [HttpPost]
        public async Task<object> Post(string login, string password, bool rememberMe = true)
        {
            var result = await _signInManager.PasswordSignInAsync(login, password, rememberMe, lockoutOnFailure: true);
            if (result.Succeeded)
            {
                var user = await _signInManager.UserManager.FindByNameAsync(login);
                return user;
            }
            else if (result.RequiresTwoFactor)
            {
                return "Wow, you required 2FA. How?";
            }
            else if (result.IsLockedOut)
            {
                return "Your account is locked out. Try again later.";
            }
            else
            {
                return "Mdeeee, wrong login or password.";
            }
        }

        // DELETE api/login
        // logout
        public async Task Delete()
        {
            await _signInManager.SignOutAsync();
        }
    }
}
