// using Azure;
// using Azure.AI.TextAnalytics;
// using Moq;

// public static class MockTextAnalyticsClient
// {
//     public static TextAnalyticsClient GetMockedClient()
//     {
//         var mockClient = new Mock<TextAnalyticsClient>();
        
//         // Mock the ExtractKeyPhrasesAsync method
//         mockClient.Setup(client => client.ExtractKeyPhrasesAsync(
//             It.IsAny<string>(),
//             It.IsAny<CancellationToken>()))
//         .ReturnsAsync(Response.FromValue(
//             new KeyPhraseCollection(new[] { "HR", "Policy" }, null),
//             Mock.Of<Response>()));

//         return mockClient.Object;
//     }
// }
