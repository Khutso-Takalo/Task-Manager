using Microsoft.EntityFrameworkCore;
using TaskManager.API.Models;

namespace TaskManager.API.Data
{
    public class TaskManagerDbContext : DbContext
    {
        public TaskManagerDbContext(DbContextOptions<TaskManagerDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.HasIndex(e => e.Email).IsUnique(); // Ensure unique emails
                entity.Property(e => e.Email).HasMaxLength(255);
                entity.Property(e => e.FirstName).HasMaxLength(100);
                entity.Property(e => e.LastName).HasMaxLength(100);
                entity.Property(e => e.Role).HasMaxLength(50);
            });

            // Configure TaskItem entity
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(e => e.TaskId);
                entity.Property(e => e.Title).HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Priority).HasMaxLength(50);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.Category).HasMaxLength(100);

                // Configure the relationship
                entity.HasOne(e => e.User)
                      .WithMany(e => e.Tasks)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed data
            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    UserId = 1, 
                    FirstName = "John", 
                    LastName = "Doe", 
                    Email = "john.doe@example.com", 
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow 
                },
                new User 
                { 
                    UserId = 2, 
                    FirstName = "Jane", 
                    LastName = "Smith", 
                    Email = "jane.smith@example.com", 
                    Role = "User",
                    CreatedAt = DateTime.UtcNow 
                }
            );

            modelBuilder.Entity<TaskItem>().HasData(
                new TaskItem
                {
                    TaskId = 1,
                    Title = "Setup Development Environment",
                    Description = "Install necessary software and tools for development",
                    Priority = "High",
                    Status = "Completed",
                    Category = "Development",
                    UserId = 1,
                    CreatedAt = DateTime.UtcNow,
                    CompletedAt = DateTime.UtcNow.AddDays(-1)
                },
                new TaskItem
                {
                    TaskId = 2,
                    Title = "Create User Interface Mockups",
                    Description = "Design wireframes and mockups for the user interface",
                    Priority = "Medium",
                    Status = "InProgress",
                    Category = "Design",
                    UserId = 2,
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(7)
                }
            );
        }
    }
}