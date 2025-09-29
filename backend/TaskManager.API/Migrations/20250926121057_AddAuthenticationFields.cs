using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthenticationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAt",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "TaskId",
                keyValue: 1,
                columns: new[] { "CompletedAt", "CreatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 12, 10, 57, 343, DateTimeKind.Utc).AddTicks(3180), new DateTime(2025, 9, 26, 12, 10, 57, 343, DateTimeKind.Utc).AddTicks(3180) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "TaskId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DueDate" },
                values: new object[] { new DateTime(2025, 9, 26, 12, 10, 57, 343, DateTimeKind.Utc).AddTicks(3189), new DateTime(2025, 10, 3, 12, 10, 57, 343, DateTimeKind.Utc).AddTicks(3190) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "IsActive", "LastLoginAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 9, 26, 12, 10, 57, 343, DateTimeKind.Utc).AddTicks(3026), true, null, "" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "IsActive", "LastLoginAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 9, 26, 12, 10, 57, 343, DateTimeKind.Utc).AddTicks(3028), true, null, "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastLoginAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "TaskId",
                keyValue: 1,
                columns: new[] { "CompletedAt", "CreatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 25, 36, 381, DateTimeKind.Utc).AddTicks(8737), new DateTime(2025, 9, 26, 11, 25, 36, 381, DateTimeKind.Utc).AddTicks(8737) });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "TaskId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DueDate" },
                values: new object[] { new DateTime(2025, 9, 26, 11, 25, 36, 381, DateTimeKind.Utc).AddTicks(8748), new DateTime(2025, 10, 3, 11, 25, 36, 381, DateTimeKind.Utc).AddTicks(8748) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 26, 11, 25, 36, 381, DateTimeKind.Utc).AddTicks(8613));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 9, 26, 11, 25, 36, 381, DateTimeKind.Utc).AddTicks(8615));
        }
    }
}
