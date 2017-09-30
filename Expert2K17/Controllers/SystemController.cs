using Expert2K17.Data;
using Expert2K17.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class SystemController : Controller
    {
        private readonly Db _db;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly UserManager<User> _userManager;
        
        public SystemController(Db db, IHostingEnvironment hostingEnvironment, UserManager<User> userManager)
        {
            _db = db;
            _hostingEnvironment = hostingEnvironment;
            _userManager = userManager;
        }

        // POST: api/system/create
        [HttpPost]
        public async Task<CreateSystemResponse> Create(CreateSystem system)
        {
            var response = new CreateSystemResponse();
            if (system.Name == null || system.Name.Length == 0)
            {
                response.Error = "Введите название системы";
                return response;
            }
            var user = await _userManager.GetUserAsync(User);
            var obj = new Test
            {
                Name = system.Name,
                Description = system.About,
                User = user
            };
            var pictureTask = Task.CompletedTask;
            FileStream stream = null;
            if (system.Picture != null)
            {
                if (system.Picture.Length > 5 * 1024 * 1024)
                {
                    response.Error = "Картинка слишком большая";
                    return response;
                }
                var path = "/systems/" + obj.Id.ToString();
                switch (system.Picture.ContentType)
                {
                    case "image/gif":
                        break;
                    case "image/jpeg":
                        break;
                    case "image/png":
                        break;
                    default:
                        response.Error = "Картинка неизвестного формата";
                        return response;
                }
                stream = new FileStream(_hostingEnvironment.WebRootPath + path, FileMode.Create);
                pictureTask = system.Picture.CopyToAsync(stream);
                obj.Picture = path;
            }
            var responseObj = new TestJson
            {
                system = new SystemJson
                {
                    name = obj.Name,
                    user = obj.User.Id,
                    picture = obj.Picture,
                    about = obj.Description,
                    pub = obj.Published,
                    guid = obj.Id.ToString()
                }
            };
            var json = JsonConvert.SerializeObject(responseObj);
            obj.PublishedJson = json;
            obj.AutosavedJson = json;
            _db.Tests.Add(obj);

            response.Succeded = true;
            response.Json = json;

            await Task.WhenAll(pictureTask, _db.SaveChangesAsync());
            stream?.Close();
            return response;
        }

        public class CreateSystem
        {
            public string Name { get; set; }
            public string About { get; set; }
            public IFormFile Picture { get; set; }
        }

#pragma warning disable IDE1006 // Стили именования
        public class TestJson
        {
            public SystemJson system { get; set; }
        }

        public class SystemJson
        {
            public string name { get; set; }
            public string user { get; set; }
            public string picture { get; set; }
            public string about { get; set; }
            public bool pub { get; set; }
            public string guid { get; set; }
        }
#pragma warning restore IDE1006 // Стили именования

        public class CreateSystemResponse
        {
            public bool Succeded { get; set; } = false;
            public string Error { get; set; } = "";
            public string Json { get; set; } = null;
        }
    }
}
