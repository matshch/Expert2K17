using Expert2K17.Data;
using Expert2K17.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
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

        // GET: api/system/get
        [HttpGet]
        public async Task<IEnumerable<SystemItem>> Get()
        {
            var userId = _userManager.GetUserId(User);
            var user = await _db.Users.Include(e => e.Tests).FirstOrDefaultAsync(e => e.Id == userId);
            return from s in user.Tests
                   orderby s.PublishedAt
                   select new SystemItem
                   {
                       Id = s.Id,
                       Name = s.Name,
                       Description = s.Description,
                       Picture = s.Picture
                   };
        }

        // GET: api/system/get/cee8e768-6490-45a8-9848-090c7a89878a
        [HttpGet("{id}")]
        public async Task<CreateSystemResponse> Get(Guid id)
        {
            var response = new CreateSystemResponse();
            var (system, error) = await GetPrepare(id.ToString());

            if (error != null)
            {
                response.Error = error;
                return response;
            }

            response.Json = system.AutosavedJson;
            response.Succeded = true;
            return response;
        }

        // POST: api/system/create
        [HttpPost]
        public async Task<CreateSystemResponse> Create(CreateSystem system)
        {
            var response = new CreateSystemResponse();
            if (string.IsNullOrEmpty(system.Name))
            {
                response.Error = "Введите название системы";
                return response;
            }
            if (system.Name.Length > 40)
            {
                response.Error = "Слишком длинное название системы";
                return response;
            }
            if (system.About == null)
            {
                system.About = "";
            }
            if (system.About.Length > 140)
            {
                response.Error = "Слишком длинное описание системы";
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
                var path = "/systems/" + obj.Id;
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
                path += "?d=" + DateTimeOffset.Now.ToUnixTimeMilliseconds();
                stream = new FileStream(_hostingEnvironment.WebRootPath + path, FileMode.Create);
                pictureTask = system.Picture.CopyToAsync(stream);
                obj.Picture = path;
            }
            var responseObj = new TestJson
            {
                system = new SystemJson
                {
                    name = obj.Name,
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

        // POST: api/system/autosave
        [HttpPost]
        public async Task<MyResponse> Autosave()
        {
            var (response, request, system, _) = await SavePrepare();
            if (response.Error != "") return response;

            system.AutosavedJson = request;
            await _db.SaveChangesAsync();

            response.Succeded = true;
            return response;
        }

        // POST: api/system/rollback/cee8e768-6490-45a8-9848-090c7a89878a
        [HttpPost("{id}")]
        public async Task<CreateSystemResponse> Rollback(Guid id)
        {
            var response = new CreateSystemResponse();
            var (system, error) = await GetPrepare(id.ToString());

            if (error != null)
            {
                response.Error = error;
                return response;
            }

            system.AutosavedJson = system.PublishedJson;
            response.Json = system.PublishedJson;
            response.Succeded = true;
            return response;
        }

        // POST: api/system/save
        [HttpPost]
        public async Task<MyResponse> Save()
        {
            var (response, request, system, obj) = await SavePrepare();
            if (response.Error != "") return response;

            system.Name = obj.name;
            system.Description = obj.about;
            system.Published = obj.pub;
            system.AutosavedJson = request;
            system.PublishedJson = request;
            await _db.SaveChangesAsync();

            response.Succeded = true;
            return response;
        }

        // POST: api/profile/setPicture
        [HttpPost]
        public async Task<PictureResponse> SetPicture(PictureForm form)
        {
            var response = new PictureResponse();
            var (system, error) = await GetPrepare(form.Id);

            if (error != null)
            {
                response.Error = error;
                return response;
            }
            response.Picture = system.Picture;

            if (form.Picture != null)
            {
                if (form.Picture.Length > 5 * 1024 * 1024)
                {
                    response.Error = "Картинка слишком большая";
                    return response;
                }
                var path = "/systems/" + form.Id;
                switch (form.Picture.ContentType)
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
                    await form.Picture.CopyToAsync(stream);
                }
                var oldPath = user.Cover.Split("?").First();
                var oldPath = system.Picture;
                if (oldPath != path && !oldPath.StartsWith("/default/"))
                {
                    System.IO.File.Delete(_hostingEnvironment.WebRootPath + oldPath);
                }
                path += "?d=" + DateTimeOffset.Now.ToUnixTimeMilliseconds();
                system.Picture = path;
            }

            response.Succeded = true;
            response.Picture = system.Picture;

            await _db.SaveChangesAsync();
            return response;
        }

        private async Task<ValueTuple<Test, string>> GetPrepare(string id)
        {
            var userGetter = _userManager.GetUserAsync(User);

            var system = await _db.Tests.Include(e => e.User).FirstOrDefaultAsync(e => e.Id.ToString() == id);
            if (system == null)
            {
                return (null, "Система не найдена");
            }

            var user = await userGetter;
            if (system.User.Id != user.Id)
            {
                return (null, "Система не принадлежит вам");
            }

            return (system, null);
        }

        private async Task<ValueTuple<MyResponse, string, Test, SystemJson>> SavePrepare()
        {
            var response = new MyResponse();
            var reader = new StreamReader(Request.Body, Encoding.UTF8).ReadToEndAsync();
            
            var request = await reader;
            var obj = JsonConvert.DeserializeObject<TestJson>(request);

            var (system, error) = await GetPrepare(obj.system.guid);
            if (error != null)
            {
                response.Error = error;
                return (response, null, null, null);
            }

            return (response, request, system, obj.system);
        }

        public class SystemItem
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Picture { get; set; }
            public string Description { get; set; }
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

        public class MyResponse
        {
            public bool Succeded { get; set; } = false;
            public string Error { get; set; } = "";
        }

        public class PictureForm
        {
            public string Id { get; set; }
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
