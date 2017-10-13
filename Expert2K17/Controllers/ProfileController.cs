using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Expert2K17.Data;
using Expert2K17.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]/[action]")]
    public class ProfileController : Controller
    {
        private readonly Db _db;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly UserManager<User> _userManager;

        public ProfileController(Db db, IHostingEnvironment hostingEnvironment, UserManager<User> userManager)
        {
            _db = db;
            _hostingEnvironment = hostingEnvironment;
            _userManager = userManager;
        }

        // POST: api/profile/setCover
        [HttpPost]
        public async Task<PictureResponse> SetCover(PictureForm system)
        {
            var response = new PictureResponse();

            var user = await _userManager.GetUserAsync(User);
            response.Picture = user.Cover;

            if (system.Picture != null)
            {
                if (system.Picture.Length > 5 * 1024 * 1024)
                {
                    response.Error = "Картинка слишком большая";
                    return response;
                }
                var path = "/covers/" + user.Id;
                switch (system.Picture.ContentType)
                {
                    case "image/gif":
                        path += ".gif";
                        break;
                    case "image/jpeg":
                        path += ".jpg";
                        break;
                    case "image/png":
                        path += ".png";
                        break;
                    default:
                        response.Error = "Картинка неизвестного формата";
                        return response;
                }
                using (var stream = new FileStream(_hostingEnvironment.WebRootPath + path, FileMode.Create))
                {
                    await system.Picture.CopyToAsync(stream);
                }
                var oldPath = user.Cover.Split("?").First();
                if (oldPath != path && !oldPath.StartsWith("/default/"))
                {
                    System.IO.File.Delete(_hostingEnvironment.WebRootPath + oldPath);
                }
                path += "?d=" + DateTimeOffset.Now.ToUnixTimeMilliseconds();
                user.Cover = path;
            }

            response.Succeded = true;
            response.Picture = user.Cover;

            await _db.SaveChangesAsync();
            return response;
        }

        // POST: api/profile/setUserpic
        [HttpPost]
        public async Task<PictureResponse> SetUserpic(PictureForm system)
        {
            var response = new PictureResponse();

            var user = await _userManager.GetUserAsync(User);
            response.Picture = user.Userpic;
            
            if (system.Picture != null)
            {
                if (system.Picture.Length > 5 * 1024 * 1024)
                {
                    response.Error = "Картинка слишком большая";
                    return response;
                }
                var path = "/userpics/" + user.Id;
                switch (system.Picture.ContentType)
                {
                    case "image/gif":
                        path += ".gif";
                        break;
                    case "image/jpeg":
                        path += ".jpg";
                        break;
                    case "image/png":
                        path += ".png";
                        break;
                    default:
                        response.Error = "Картинка неизвестного формата";
                        return response;
                }
                using (var stream = new FileStream(_hostingEnvironment.WebRootPath + path, FileMode.Create))
                {
                    await system.Picture.CopyToAsync(stream);
                }
                var oldPath = user.Userpic.Split("?").First();
                if (oldPath != path && !oldPath.StartsWith("/default/"))
                {
                    System.IO.File.Delete(_hostingEnvironment.WebRootPath + oldPath);
                }
                path += "?d=" + DateTimeOffset.Now.ToUnixTimeMilliseconds();
                user.Userpic = path;
            }
            
            response.Succeded = true;
            response.Picture = user.Userpic;

            await _db.SaveChangesAsync();
            return response;
        }

        public class PictureForm
        {
            public IFormFile Picture { get; set; }
        }

        public class PictureResponse
        {
            public bool Succeded { get; set; } = false;
            public string Error { get; set; } = "";
            public string Picture { get; set; } = null;
        }
    }
}