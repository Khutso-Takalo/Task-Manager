using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.API.DTOs;
using TaskManager.API.Services;

namespace TaskManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        /// <param name="registerDto">Registration details</param>
        /// <returns>Authentication response with token</returns>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid input data",
                        Errors = ModelState.Values
                            .SelectMany(v => v.Errors)
                            .Select(e => e.ErrorMessage)
                            .ToList()
                    });
                }

                var result = await _authService.RegisterAsync(registerDto);

                if (result.Success)
                {
                    _logger.LogInformation("User registered successfully: {Email}", registerDto.Email);
                    return Ok(result);
                }
                else
                {
                    _logger.LogWarning("Registration failed for email: {Email}. Reason: {Message}", 
                        registerDto.Email, result.Message);
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration for email: {Email}", registerDto.Email);
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred during registration"
                });
            }
        }

        /// <summary>
        /// Login user
        /// </summary>
        /// <param name="loginDto">Login credentials</param>
        /// <returns>Authentication response with token</returns>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid input data",
                        Errors = ModelState.Values
                            .SelectMany(v => v.Errors)
                            .Select(e => e.ErrorMessage)
                            .ToList()
                    });
                }

                var result = await _authService.LoginAsync(loginDto);

                if (result.Success)
                {
                    _logger.LogInformation("User logged in successfully: {Email}", loginDto.Email);
                    return Ok(result);
                }
                else
                {
                    _logger.LogWarning("Login failed for email: {Email}", loginDto.Email);
                    return Unauthorized(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login for email: {Email}", loginDto.Email);
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred during login"
                });
            }
        }

        /// <summary>
        /// Change user password (requires authentication)
        /// </summary>
        /// <param name="changePasswordDto">Password change details</param>
        /// <returns>Success status</returns>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid input data",
                        errors = ModelState.Values
                            .SelectMany(v => v.Errors)
                            .Select(e => e.ErrorMessage)
                            .ToList()
                    });
                }

                var userIdClaim = User.FindFirst("userId")?.Value;
                if (!int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user token" });
                }

                var success = await _authService.ChangePasswordAsync(userId, changePasswordDto);

                if (success)
                {
                    _logger.LogInformation("Password changed successfully for user: {UserId}", userId);
                    return Ok(new { success = true, message = "Password changed successfully" });
                }
                else
                {
                    _logger.LogWarning("Password change failed for user: {UserId}", userId);
                    return BadRequest(new { success = false, message = "Current password is incorrect" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password change");
                return StatusCode(500, new { success = false, message = "An error occurred while changing password" });
            }
        }

        /// <summary>
        /// Get current user profile (requires authentication)
        /// </summary>
        /// <returns>User profile information</returns>
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (!int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var user = await _authService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var userDto = new UserDto
                {
                    UserId = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user profile");
                return StatusCode(500, new { message = "An error occurred while retrieving profile" });
            }
        }

        /// <summary>
        /// Validate token (requires authentication)
        /// </summary>
        /// <returns>Token validation status</returns>
        [HttpGet("validate-token")]
        [Authorize]
        public ActionResult ValidateToken()
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                var emailClaim = User.FindFirst(ClaimTypes.Email)?.Value;
                var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

                return Ok(new
                {
                    valid = true,
                    userId = userIdClaim,
                    email = emailClaim,
                    role = roleClaim,
                    message = "Token is valid"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return StatusCode(500, new { valid = false, message = "Token validation failed" });
            }
        }

        /// <summary>
        /// Logout user (client-side token removal)
        /// </summary>
        /// <returns>Logout confirmation</returns>
        [HttpPost("logout")]
        public ActionResult Logout()
        {
            // Since we're using JWT tokens, logout is primarily handled client-side
            // by removing the token from storage
            return Ok(new { success = true, message = "Logged out successfully" });
        }
    }
}