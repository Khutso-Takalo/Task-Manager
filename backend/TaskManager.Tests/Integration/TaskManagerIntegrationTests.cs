using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using TaskManager.API.Data;
using TaskManager.API.DTOs;
using TaskManager.API.Models;
using Xunit;

namespace TaskManager.Tests.Integration
{
    public class TaskManagerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public TaskManagerIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Remove the existing DbContext registration
                    var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(DbContextOptions<TaskManagerDbContext>));
                    if (descriptor != null)
                        services.Remove(descriptor);

                    // Add InMemory database for testing
                    services.AddDbContext<TaskManagerDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDatabase");
                    });

                    // Ensure database is created
                    var serviceProvider = services.BuildServiceProvider();
                    using var scope = serviceProvider.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<TaskManagerDbContext>();
                    context.Database.EnsureCreated();
                });
            });

            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task IntegrationTest_CreateUserAndTask_FullWorkflow()
        {
            // 1. Create a user
            var createUserDto = new CreateUserDto
            {
                FirstName = "Integration",
                LastName = "Test",
                Email = "integration@test.com",
                Role = "User"
            };

            var createUserResponse = await _client.PostAsJsonAsync("/api/users", createUserDto);
            Assert.Equal(HttpStatusCode.Created, createUserResponse.StatusCode);

            var userContent = await createUserResponse.Content.ReadAsStringAsync();
            var user = JsonSerializer.Deserialize<UserResponseDto>(userContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            Assert.NotNull(user);
            Assert.True(user.UserId > 0);

            // 2. Get the created user
            var getUserResponse = await _client.GetAsync($"/api/users/{user.UserId}");
            Assert.Equal(HttpStatusCode.OK, getUserResponse.StatusCode);

            // 3. Create a task for the user
            var createTaskDto = new CreateTaskDto
            {
                Title = "Integration Test Task",
                Description = "This task was created during integration testing",
                Priority = "High",
                Category = "Testing",
                UserId = user.UserId,
                DueDate = DateTime.UtcNow.AddDays(5)
            };

            var createTaskResponse = await _client.PostAsJsonAsync("/api/tasks", createTaskDto);
            Assert.Equal(HttpStatusCode.Created, createTaskResponse.StatusCode);

            var taskContent = await createTaskResponse.Content.ReadAsStringAsync();
            var task = JsonSerializer.Deserialize<TaskResponseDto>(taskContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            Assert.NotNull(task);
            Assert.True(task.TaskId > 0);
            Assert.Equal(user.UserId, task.UserId);

            // 4. Get tasks by user
            var getTasksByUserResponse = await _client.GetAsync($"/api/tasks/user/{user.UserId}");
            Assert.Equal(HttpStatusCode.OK, getTasksByUserResponse.StatusCode);

            var tasksContent = await getTasksByUserResponse.Content.ReadAsStringAsync();
            var tasks = JsonSerializer.Deserialize<TaskResponseDto[]>(tasksContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            Assert.NotNull(tasks);
            Assert.Single(tasks);
            Assert.Equal(task.TaskId, tasks[0].TaskId);

            // 5. Update task status
            var updateStatusResponse = await _client.PatchAsync($"/api/tasks/{task.TaskId}/status", 
                JsonContent.Create("Completed"));
            Assert.Equal(HttpStatusCode.NoContent, updateStatusResponse.StatusCode);

            // 6. Verify status update
            var getUpdatedTaskResponse = await _client.GetAsync($"/api/tasks/{task.TaskId}");
            Assert.Equal(HttpStatusCode.OK, getUpdatedTaskResponse.StatusCode);

            var updatedTaskContent = await getUpdatedTaskResponse.Content.ReadAsStringAsync();
            var updatedTask = JsonSerializer.Deserialize<TaskResponseDto>(updatedTaskContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            Assert.NotNull(updatedTask);
            Assert.Equal("Completed", updatedTask.Status);
            Assert.NotNull(updatedTask.CompletedAt);

            // 7. Get tasks by status
            var getCompletedTasksResponse = await _client.GetAsync("/api/tasks/status/Completed");
            Assert.Equal(HttpStatusCode.OK, getCompletedTasksResponse.StatusCode);

            // 8. Delete the task
            var deleteTaskResponse = await _client.DeleteAsync($"/api/tasks/{task.TaskId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteTaskResponse.StatusCode);

            // 9. Verify task deletion
            var getDeletedTaskResponse = await _client.GetAsync($"/api/tasks/{task.TaskId}");
            Assert.Equal(HttpStatusCode.NotFound, getDeletedTaskResponse.StatusCode);

            // 10. Delete the user
            var deleteUserResponse = await _client.DeleteAsync($"/api/users/{user.UserId}");
            Assert.Equal(HttpStatusCode.NoContent, deleteUserResponse.StatusCode);
        }

        [Fact]
        public async Task IntegrationTest_DuplicateUserEmail_ReturnsBadRequest()
        {
            // Create first user
            var createUserDto1 = new CreateUserDto
            {
                FirstName = "First",
                LastName = "User",
                Email = "duplicate@test.com",
                Role = "User"
            };

            var response1 = await _client.PostAsJsonAsync("/api/users", createUserDto1);
            Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

            // Try to create second user with same email
            var createUserDto2 = new CreateUserDto
            {
                FirstName = "Second",
                LastName = "User",
                Email = "duplicate@test.com", // Same email
                Role = "Admin"
            };

            var response2 = await _client.PostAsJsonAsync("/api/users", createUserDto2);
            Assert.Equal(HttpStatusCode.BadRequest, response2.StatusCode);

            var errorContent = await response2.Content.ReadAsStringAsync();
            Assert.Contains("already exists", errorContent);
        }

        [Fact]
        public async Task IntegrationTest_FilteredQueries_ReturnCorrectData()
        {
            // Create users with different roles
            var adminUser = new CreateUserDto
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin.filtered@test.com",
                Role = "Admin"
            };

            var regularUser = new CreateUserDto
            {
                FirstName = "Regular",
                LastName = "User",
                Email = "regular.filtered@test.com",
                Role = "User"
            };

            var adminResponse = await _client.PostAsJsonAsync("/api/users", adminUser);
            var regularResponse = await _client.PostAsJsonAsync("/api/users", regularUser);

            Assert.Equal(HttpStatusCode.Created, adminResponse.StatusCode);
            Assert.Equal(HttpStatusCode.Created, regularResponse.StatusCode);

            // Test filtered query - get users by role
            var adminUsersResponse = await _client.GetAsync("/api/users/role/Admin");
            Assert.Equal(HttpStatusCode.OK, adminUsersResponse.StatusCode);

            var adminUsersContent = await adminUsersResponse.Content.ReadAsStringAsync();
            var adminUsers = JsonSerializer.Deserialize<UserResponseDto[]>(adminUsersContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(adminUsers);
            Assert.All(adminUsers, u => Assert.Equal("Admin", u.Role));

            // Test another filtered query - get users by role "User"
            var regularUsersResponse = await _client.GetAsync("/api/users/role/User");
            Assert.Equal(HttpStatusCode.OK, regularUsersResponse.StatusCode);

            var regularUsersContent = await regularUsersResponse.Content.ReadAsStringAsync();
            var regularUsers = JsonSerializer.Deserialize<UserResponseDto[]>(regularUsersContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(regularUsers);
            Assert.All(regularUsers, u => Assert.Equal("User", u.Role));
        }
    }
}