using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.DTOs;
using TaskManager.API.Models;

namespace TaskManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskManagerDbContext _context;

        public TasksController(TaskManagerDbContext context)
        {
            _context = context;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasks()
        {
            var tasks = await _context.Tasks
                .Include(t => t.User)
                .Select(t => new TaskResponseDto
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    Category = t.Category,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CompletedAt = t.CompletedAt,
                    UserId = t.UserId,
                    UserName = $"{t.User.FirstName} {t.User.LastName}"
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskResponseDto>> GetTask(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.User)
                .Where(t => t.TaskId == id)
                .Select(t => new TaskResponseDto
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    Category = t.Category,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CompletedAt = t.CompletedAt,
                    UserId = t.UserId,
                    UserName = $"{t.User.FirstName} {t.User.LastName}"
                })
                .FirstOrDefaultAsync();

            if (task == null)
            {
                return NotFound($"Task with ID {id} not found.");
            }

            return Ok(task);
        }

        // GET: api/tasks/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasksByUser(int userId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.User)
                .Where(t => t.UserId == userId)
                .Select(t => new TaskResponseDto
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    Category = t.Category,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CompletedAt = t.CompletedAt,
                    UserId = t.UserId,
                    UserName = $"{t.User.FirstName} {t.User.LastName}"
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // GET: api/tasks/status/{status} - Filtered query example
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasksByStatus(string status)
        {
            var tasks = await _context.Tasks
                .Include(t => t.User)
                .Where(t => t.Status.ToLower() == status.ToLower())
                .Select(t => new TaskResponseDto
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    Category = t.Category,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CompletedAt = t.CompletedAt,
                    UserId = t.UserId,
                    UserName = $"{t.User.FirstName} {t.User.LastName}"
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // GET: api/tasks/category/{category}
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasksByCategory(string category)
        {
            var tasks = await _context.Tasks
                .Include(t => t.User)
                .Where(t => t.Category.ToLower() == category.ToLower())
                .Select(t => new TaskResponseDto
                {
                    TaskId = t.TaskId,
                    Title = t.Title,
                    Description = t.Description,
                    Priority = t.Priority,
                    Status = t.Status,
                    Category = t.Category,
                    DueDate = t.DueDate,
                    CreatedAt = t.CreatedAt,
                    CompletedAt = t.CompletedAt,
                    UserId = t.UserId,
                    UserName = $"{t.User.FirstName} {t.User.LastName}"
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskResponseDto>> CreateTask(CreateTaskDto createTaskDto)
        {
            // Check if user exists
            var user = await _context.Users.FindAsync(createTaskDto.UserId);
            if (user == null)
            {
                return BadRequest($"User with ID {createTaskDto.UserId} does not exist.");
            }

            // Duplicate check logic - no duplicate titles for the same user
            var existingTask = await _context.Tasks
                .FirstOrDefaultAsync(t => t.UserId == createTaskDto.UserId && 
                                        t.Title.ToLower() == createTaskDto.Title.ToLower());

            if (existingTask != null)
            {
                return BadRequest($"A task with title '{createTaskDto.Title}' already exists for this user.");
            }

            var task = new TaskItem
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                Priority = createTaskDto.Priority,
                Category = createTaskDto.Category,
                DueDate = createTaskDto.DueDate,
                UserId = createTaskDto.UserId,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending"
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            // Load the user for response
            await _context.Entry(task).Reference(t => t.User).LoadAsync();

            var taskResponse = new TaskResponseDto
            {
                TaskId = task.TaskId,
                Title = task.Title,
                Description = task.Description,
                Priority = task.Priority,
                Status = task.Status,
                Category = task.Category,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                CompletedAt = task.CompletedAt,
                UserId = task.UserId,
                UserName = $"{task.User.FirstName} {task.User.LastName}"
            };

            return CreatedAtAction(nameof(GetTask), new { id = task.TaskId }, taskResponse);
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto updateTaskDto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound($"Task with ID {id} not found.");
            }

            task.Title = updateTaskDto.Title;
            task.Description = updateTaskDto.Description;
            task.Priority = updateTaskDto.Priority;
            task.Category = updateTaskDto.Category;
            task.DueDate = updateTaskDto.DueDate;
            
            // Handle status change to completed
            if (updateTaskDto.Status.ToLower() == "completed" && task.Status.ToLower() != "completed")
            {
                task.CompletedAt = DateTime.UtcNow;
            }
            else if (updateTaskDto.Status.ToLower() != "completed")
            {
                task.CompletedAt = null;
            }

            task.Status = updateTaskDto.Status;

            _context.Entry(task).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/tasks/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] string status)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound($"Task with ID {id} not found.");
            }

            // Handle status change to completed
            if (status.ToLower() == "completed" && task.Status.ToLower() != "completed")
            {
                task.CompletedAt = DateTime.UtcNow;
            }
            else if (status.ToLower() != "completed")
            {
                task.CompletedAt = null;
            }

            task.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound($"Task with ID {id} not found.");
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}