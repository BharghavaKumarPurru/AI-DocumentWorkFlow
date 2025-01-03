using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using AI_DocumentWorkflow.Controllers;
using AI_DocumentWorkflow.Models;

public class LoginControllerTests
{
    [Fact]
    public void Login_ValidCredentials_ShouldReturnJwtToken()
    {
        // Arrange
        var inMemorySettings = new Dictionary<string, string>
        {
            { "JWT:Key", "YourSecretKey" },
            { "JWT:Issuer", "YourIssuer" },
            { "JWT:ExpiryInMinutes", "60" }
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var controller = new LoginController(configuration);
        var loginRequest = new LoginRequest
        {
            Username = "admin",
            Password = "password"
        };

        // Act
        var result = controller.Login(loginRequest);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Contains("Token", okResult.Value.ToString());
    }
}
