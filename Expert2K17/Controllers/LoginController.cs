using Expert2K17.Data;
using Expert2K17.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly Db _db;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public LoginController(Db db, SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _db = db;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // GET: api/login
        // Returns current user information
        [HttpGet]
        public async Task<UserData> GetAsync()
        {
            var userId = _userManager.GetUserId(User);
            var user = await _db.Users.Include(e => e.Group.Year).FirstOrDefaultAsync(e => e.Id == userId);
            if (user != null)
            {
                return new UserData
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Name = user.Name,
                    Surname = user.Surname,
                    Patronymic = user.Patronymic,
                    Group = user.Group?.Group,
                    Year = user.Year?.Year
                };
            }
            else
            {
                return null;
            }
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

        public class UserData
        {
            public string Id { get; set; }
            public string UserName { get; set; }

            public string Surname { get; set; }
            public string Name { get; set; }
            public string Patronymic { get; set; }

            public string Group { get; set; }
            public string Year { get; set; }
        }
    }
}
