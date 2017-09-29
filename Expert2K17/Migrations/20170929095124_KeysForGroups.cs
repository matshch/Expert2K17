using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Expert2K17.Migrations
{
    public partial class KeysForGroups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Groups_Group1",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Groups",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_Group1",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Group1",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "Group",
                table: "Groups",
                type: "text",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Groups",
                type: "int4",
                nullable: false)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn);

            migrationBuilder.AddColumn<int>(
                name: "GroupId",
                table: "AspNetUsers",
                type: "int4",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Groups",
                table: "Groups",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_GroupId",
                table: "AspNetUsers",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Groups_GroupId",
                table: "AspNetUsers",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Groups_GroupId",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Groups",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_GroupId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "Group",
                table: "Groups",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Group1",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Groups",
                table: "Groups",
                column: "Group");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_Group1",
                table: "AspNetUsers",
                column: "Group1");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Groups_Group1",
                table: "AspNetUsers",
                column: "Group1",
                principalTable: "Groups",
                principalColumn: "Group",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
