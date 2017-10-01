using Microsoft.EntityFrameworkCore.Migrations;

namespace Expert2K17.Migrations
{
    public partial class ForceDefaultUserpics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Cover",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "/default/cover.jpg");

            migrationBuilder.AddColumn<string>(
                name: "Userpic",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "/default/userpic.png");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cover",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Userpic",
                table: "AspNetUsers");
        }
    }
}
