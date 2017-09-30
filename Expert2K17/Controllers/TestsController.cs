using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Expert2K17.Controllers
{
    [Route("api/[controller]")]
    public class TestsController : Controller
    {
        // GET: api/tests
        [HttpGet]
        public IEnumerable<Test> Get()
        {
            var user1 = new UserJSON
            {
                Id = Guid.NewGuid(),
                Nickname = "MaxAvatar",
                Surname = "Лясковский",
                Name = "Максим",
                Patronymic = "Альбертович"
            };
            var user2 = new UserJSON
            {
                Id = Guid.NewGuid(),
                Nickname = "GWerewolf",
                Surname = "Лещев",
                Name = "Артем",
                Patronymic = "Олегович"
            };
            var user3 = new UserJSON
            {
                Id = Guid.NewGuid(),
                Nickname = "pidor_of_the_day",
                Surname = "Мельников",
                Name = "Константин",
                Patronymic = "Игоревич"
            };
            var test1 = new Test
            {
                Id = Guid.NewGuid(),
                Name = "Какую аниму глянуть?",
                Description = "Данная великолепная система унесёт вас в великолепный мир аниме!",
                User = user1,
                Image = new Uri("https://i.imgur.com/Ly4uhTA.png")
            };
            var test2 = new Test
            {
                Id = Guid.NewGuid(),
                Name = "На какой канал подписаться?",
                Description = "Данная великолепная система подберёт вам самый лучший канал с тянками!",
                User = user1,
                Image = new Uri("https://i.imgur.com/5Oz15Ge.jpg")
            };
            var test3 = new Test
            {
                Id = Guid.NewGuid(),
                Name = "Какие обои выбрать?",
                Description = "Данная великолепная система подберёт вам классные обои!",
                User = user1,
                Image = new Uri("https://i.imgur.com/U5c5hWV.jpg")
            };
            var test4 = new Test
            {
                Id = Guid.NewGuid(),
                Name = "Какие обои выбрать?",
                Description = "Данная великолепная система подберёт вам классные обои!",
                User = user1,
                Image = new Uri("https://i.imgur.com/U5c5hWV.jpg")
            };
            var test5 = new Test
            {
                Id = Guid.NewGuid(),
                Name = "Как добиться 120 FPS?",
                Description = "Поможем вам понять, почему у вас так мало FPS.",
                User = user3,
                Image = new Uri("https://i.imgur.com/gMi4k6B.png")
            };
            var test6 = new Test
            {
                Id = Guid.NewGuid(),
                Name = "Какой язык программирования выбрать?",
                Description = "До сдачи проекта 1 день. На чём писать?",
                User = user2,
                Image = new Uri("https://imgs.xkcd.com/comics/real_programmers.png")
            };
            var test7 = new Test
            {
                Id = Guid.NewGuid(),
                Name = "Какую вайфу выбрать?",
                Description = "До сдачи проекта 1 день. На чём писать?",
                User = user2,
                Image = new Uri("https://media.giphy.com/media/LLjvtJwvzaTni/giphy.gif")
            };
            return new Test[] { test1, test2, test3, test4, test5, test6, test7 };
        }

        public class UserJSON
        {
            public Guid Id;
            public string Nickname;
            public string Surname;
            public string Name;
            public string Patronymic;
        }

        public class Test
        {
            public Guid Id;
            public string Name;
            public string Description;
            public Uri Image;
            public UserJSON User;
        }

        // GET api/tests/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            throw new NotImplementedException();
        }
    }
}
