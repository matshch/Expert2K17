using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Expert2K17.Migrations
{
    public partial class FixKeysInGroups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Years_Year1",
                table: "Groups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Years",
                table: "Years");

            migrationBuilder.DropIndex(
                name: "IX_Groups_Year1",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "Year1",
                table: "Groups");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Years",
                type: "int4",
                nullable: false)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.AlterColumn<string>(
                name: "Group",
                table: "Groups",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "YearId",
                table: "Groups",
                type: "int4",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Years",
                table: "Years",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_YearId",
                table: "Groups",
                column: "YearId");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Years_YearId",
                table: "Groups",
                column: "YearId",
                principalTable: "Years",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Years_YearId",
                table: "Groups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Years",
                table: "Years");

            migrationBuilder.DropIndex(
                name: "IX_Groups_YearId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Years");

            migrationBuilder.DropColumn(
                name: "YearId",
                table: "Groups");

            migrationBuilder.AlterColumn<string>(
                name: "Group",
                table: "Groups",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Year1",
                table: "Groups",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Years",
                table: "Years",
                column: "Year");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_Year1",
                table: "Groups",
                column: "Year1");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Years_Year1",
                table: "Groups",
                column: "Year1",
                principalTable: "Years",
                principalColumn: "Year",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
