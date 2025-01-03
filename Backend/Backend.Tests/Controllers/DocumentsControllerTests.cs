using Xunit;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Threading.Tasks;
using System.Collections.Generic;
using AI_DocumentWorkflow.Controllers;
using AI_DocumentWorkflow.Data;
using AI_DocumentWorkflow.Models;
using AI_DocumentWorkflow.AI;
using Microsoft.EntityFrameworkCore;

public class DocumentsControllerTests
{
    private Mock<DocumentWorkflowContext> GetMockDbContext()
    {
        var options = new DbContextOptionsBuilder<DocumentWorkflowContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;
        var context = new DocumentWorkflowContext(options);

        context.Documents.AddRange(new List<Document>
        {
            new Document { Id = 1, Name = "HR Document", Content = "HR policies", Category = "HR", Status = "Approved" },
            new Document { Id = 2, Name = "Finance Document", Content = "Finance report", Category = "Finance", Status = "Pending" }
        });
        context.SaveChanges();

        return new Mock<DocumentWorkflowContext>(MockBehavior.Strict) { DefaultValue = DefaultValue.Mock };
    }

    [Fact]
    public async Task GetDocuments_ShouldReturnAllDocuments()
    {
        // Arrange
        var mockContext = GetMockDbContext();
        var mockTextAnalyticsService = new Mock<TextAnalyticsService>(null);
        var controller = new DocumentsController(mockContext.Object, mockTextAnalyticsService.Object);

        // Act
        var result = await controller.GetDocuments();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var documents = Assert.IsAssignableFrom<IEnumerable<Document>>(okResult.Value);
        Assert.Equal(2, documents.Count());
    }
}
