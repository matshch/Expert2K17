using Microsoft.EntityFrameworkCore.Migrations;

namespace Expert2K17.Migrations
{
    public partial class UserGroups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Group1",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Years",
                columns: table => new
                {
                    Year = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Years", x => x.Year);
                });

            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    Group = table.Column<string>(type: "text", nullable: false),
                    Year1 = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.Group);
                    table.ForeignKey(
                        name: "FK_Groups_Years_Year1",
                        column: x => x.Year1,
                        principalTable: "Years",
                        principalColumn: "Year",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_Group1",
                table: "AspNetUsers",
                column: "Group1");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_Year1",
                table: "Groups",
                column: "Year1");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Groups_Group1",
                table: "AspNetUsers",
                column: "Group1",
                principalTable: "Groups",
                principalColumn: "Group",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Groups_Group1",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Groups");

            migrationBuilder.DropTable(
                name: "Years");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_Group1",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Group1",
                table: "AspNetUsers");
        }
    }
}
