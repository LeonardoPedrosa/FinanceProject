using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceApp.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryMonthConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxValue",
                table: "Categories");

            migrationBuilder.CreateTable(
                name: "CategoryMonthConfigs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    Month = table.Column<int>(type: "integer", nullable: false),
                    MaxValue = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryMonthConfigs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CategoryMonthConfigs_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoryMonthConfigs_CategoryId_Year_Month",
                table: "CategoryMonthConfigs",
                columns: new[] { "CategoryId", "Year", "Month" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoryMonthConfigs");

            migrationBuilder.AddColumn<decimal>(
                name: "MaxValue",
                table: "Categories",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
