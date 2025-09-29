using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Controllers;
using TaskManager.API.Data;
using TaskManager.API.DTOs;
using TaskManager.API.Models;
using Xunit;

namespace TaskManager.Tests.Controllers
{
    public class TasksControllerTests
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
        public async Task CreateTask_ValidData_ReturnsCreatedResult()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new TasksController(context);

            // Create a user first
            var user = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@test.com",
                Role = "User"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var createTaskDto = new CreateTaskDto
            {
                Title = "Test Task",
                Description = "This is a test task",
                Priority = "High",
                Category = "Development",
                UserId = user.UserId,
                DueDate = DateTime.UtcNow.AddDays(7)
            };

            // Act
            var result = await controller.CreateTask(createTaskDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var taskResponse = Assert.IsType<TaskResponseDto>(createdResult.Value);
            
            Assert.Equal("Test Task", taskResponse.Title);
            Assert.Equal("This is a test task", taskResponse.Description);
            Assert.Equal("High", taskResponse.Priority);
            Assert.Equal("Development", taskResponse.Category);
            Assert.Equal("Pending", taskResponse.Status);
            Assert.Equal(user.UserId, taskResponse.UserId);
            Assert.True(taskResponse.TaskId > 0);
        }

        [Fact]
        public async Task CreateTask_DuplicateTitle_ReturnsBadRequest()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new TasksController(context);

            // Create a user first
            var user = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@test.com",
                Role = "User"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            // Create first task
            var existingTask = new TaskItem
            {
                Title = "Duplicate Task",
                Description = "First task",
                Priority = "Medium",
                Category = "General",
                UserId = user.UserId,
                Status = "Pending"
            };
            context.Tasks.Add(existingTask);
            await context.SaveChangesAsync();

            var createTaskDto = new CreateTaskDto
            {
                Title = "Duplicate Task", // Same title
                Description = "Second task",
                Priority = "High",
                Category = "Development",
                UserId = user.UserId
            };

            // Act
            var result = await controller.CreateTask(createTaskDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("already exists", badRequestResult.Value?.ToString());
        }

        [Fact]
        public async Task CreateTask_NonExistentUser_ReturnsBadRequest()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new TasksController(context);

            var createTaskDto = new CreateTaskDto
            {
                Title = "Test Task",
                Description = "This is a test task",
                Priority = "High",
                Category = "Development",
                UserId = 999 // Non-existent user
            };

            // Act
            var result = await controller.CreateTask(createTaskDto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("does not exist", badRequestResult.Value?.ToString());
        }

        [Fact]
        public async Task GetTasksByStatus_ValidStatus_ReturnsFilteredTasks()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new TasksController(context);

            // Create a user first
            var user = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@test.com",
                Role = "User"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            // Add test tasks
            context.Tasks.AddRange(
                new TaskItem { Title = "Task 1", UserId = user.UserId, Status = "Pending", Priority = "High", Category = "General" },
                new TaskItem { Title = "Task 2", UserId = user.UserId, Status = "Completed", Priority = "Medium", Category = "General" },
                new TaskItem { Title = "Task 3", UserId = user.UserId, Status = "Pending", Priority = "Low", Category = "General" }
            );
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetTasksByStatus("Pending");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var tasks = Assert.IsAssignableFrom<IEnumerable<TaskResponseDto>>(okResult.Value);
            Assert.Equal(2, tasks.Count());
            Assert.All(tasks, t => Assert.Equal("Pending", t.Status));
        }

        [Fact]
        public async Task UpdateTaskStatus_ValidData_ReturnsNoContent()
        {
            // Arrange
            using var context = GetInMemoryDbContext();
            var controller = new TasksController(context);

            // Create a user first
            var user = new User
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@test.com",
                Role = "User"
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var task = new TaskItem
            {
                Title = "Test Task",
                Description = "Test Description",
                Priority = "Medium",
                Category = "General",
                Status = "Pending",
                UserId = user.UserId
            };
            context.Tasks.Add(task);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.UpdateTaskStatus(task.TaskId, "Completed");

            // Assert
            Assert.IsType<NoContentResult>(result);

            // Verify the update
            var updatedTask = await context.Tasks.FindAsync(task.TaskId);
            Assert.NotNull(updatedTask);
            Assert.Equal("Completed", updatedTask.Status);
            Assert.NotNull(updatedTask.CompletedAt);
        }
    }
}