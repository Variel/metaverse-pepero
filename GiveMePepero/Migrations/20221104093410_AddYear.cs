using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GiveMePepero.Migrations
{
    public partial class AddYear : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Peperos_ReceiverId",
                table: "Peperos");  

            migrationBuilder.AddColumn<short>(
                name: "Year",
                table: "Peperos",
                type: "smallint",
                nullable: false,
                defaultValue: (short)2021);

            migrationBuilder.CreateIndex(
                name: "IX_Peperos_ReceiverId_Year_CreatedAt",
                table: "Peperos",
                columns: new[] { "ReceiverId", "Year", "CreatedAt" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Peperos_ReceiverId_Year_CreatedAt",
                table: "Peperos");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "Peperos");

            migrationBuilder.CreateIndex(
                name: "IX_Peperos_ReceiverId",
                table: "Peperos",
                column: "ReceiverId");
        }
    }
}
