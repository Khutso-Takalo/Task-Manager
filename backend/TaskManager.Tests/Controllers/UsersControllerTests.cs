using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Controllers;
using TaskManager.API.Data;
using TaskManager.API.DTOs;
using TaskManager.API.Models;
using Xunit;

namespace TaskManager.Tests.Controllers
{
    public class UsersControllerTests
    {
        private TaskManagerDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<TaskManagerDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new TaskManagerDbContext(options);
            context.Database.EnsureCreated();

            return context;
        }

        [Fact]
        public async Task CreateUser_ValidData_ReturnsCreatedResult()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            var createUserDto = new CreateUserDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@test.com",
                Role = "User"
            };

            // Act
            var result = await controller.CreateUser(createUserDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var userResponse = Assert.IsType<UserResponseDto>(createdResult.Value);
            
            Assert.Equal("John", userResponse.FirstName);
            Assert.Equal("Doe", userResponse.LastName);
            Assert.Equal("john.doe@test.com", userResponse.Email);
            Assert.Equal("User", userResponse.Role);
            Assert.True(userResponse.UserId > 0);
        }

        [Fact]
        public async Task CreateUser_DuplicateEmail_ReturnsBadRequest()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            // Create first user
            var user = new User
            {
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane.smith@test.com",
                Role = "User"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var createUserDto = new CreateUserDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "jane.smith@test.com", // Same email
                Role = "Admin"
            };

            // Act
            var result = await controller.CreateUser(createUserDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("already exists", badRequestResult.Value?.ToString());
        }

        [Fact]
        public async Task GetUsersByRole_ValidRole_ReturnsFilteredUsers()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            // Add test data
            context.Users.AddRange(
                new User { FirstName = "Admin", LastName = "User", Email = "admin@test.com", Role = "Admin" },
                new User { FirstName = "Regular", LastName = "User", Email = "user@test.com", Role = "User" },
                new User { FirstName = "Another", LastName = "Admin", Email = "admin2@test.com", Role = "Admin" }
            );
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetUsersByRole("Admin");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var users = Assert.IsAssignableFrom<IEnumerable<UserResponseDto>>(okResult.Value);
            Assert.Equal(2, users.Count());
            Assert.All(users, u => Assert.Equal("Admin", u.Role));
        }

        [Fact]
        public async Task GetUser_NonExistentId_ReturnsNotFound()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            // Act
            var result = await controller.GetUser(999);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Contains("not found", notFoundResult.Value?.ToString());
        }

        [Fact]
        public async Task UpdateUser_ValidData_ReturnsNoContent()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            var user = new User
            {
                FirstName = "Original",
                LastName = "Name",
                Email = "original@test.com",
                Role = "User"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var updateDto = new UpdateUserDto
            {
                FirstName = "Updated",
                LastName = "Name",
                Role = "Admin"
            };

            // Act
            var result = await controller.UpdateUser(user.UserId, updateDto);

            // Assert
            Assert.IsType<NoContentResult>(result);

            // Verify the update
            var updatedUser = await context.Users.FindAsync(user.UserId);
            Assert.NotNull(updatedUser);
            Assert.Equal("Updated", updatedUser.FirstName);
            Assert.Equal("Admin", updatedUser.Role);
        }

        [Fact]
        public async Task DeleteUser_ValidId_ReturnsNoContent()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new UsersController(context);

            var user = new User
            {
                FirstName = "Delete",
                LastName = "Me",
                Email = "delete@test.com",
                Role = "User"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.DeleteUser(user.UserId);

            // Assert
            Assert.IsType<NoContentResult>(result);

            // Verify deletion
            var deletedUser = await context.Users.FindAsync(user.UserId);
            Assert.Null(deletedUser);
        }
    }
}