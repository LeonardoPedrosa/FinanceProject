using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceApp.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddExpenseInstallments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "InstallmentGroupId",
                table: "Expenses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InstallmentNumber",
                table: "Expenses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalInstallments",
                table: "Expenses",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InstallmentGroupId",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "InstallmentNumber",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "TotalInstallments",
                table: "Expenses");
        }
    }
}
