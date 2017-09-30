using Microsoft.EntityFrameworkCore.Migrations;

namespace Expert2K17.Migrations
{
    public partial class FixKeysInYears : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Year",
                table: "Years",
                type: "text",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.CreateIndex(
                name: "IX_Years_Year",
                table: "Years",
                column: "Year",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Years_Year",
                table: "Years");

            migrationBuilder.AlterColumn<string>(
                name: "Year",
                table: "Years",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
