using Microsoft.Rest;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace AI_DocumentWorkflow.AI
{
    public class ApiKeyServiceClientCredentials : ServiceClientCredentials
    {
        private readonly string _subscriptionKey;

        public ApiKeyServiceClientCredentials(string subscriptionKey)
        {
            _subscriptionKey = subscriptionKey ?? throw new ArgumentNullException(nameof(subscriptionKey));
        }

        public override Task ProcessHttpRequestAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            request.Headers.Add("Ocp-Apim-Subscription-Key", _subscriptionKey);
            return base.ProcessHttpRequestAsync(request, cancellationToken);
        }
    }
}

// using Azure;
// using Azure.AI.TextAnalytics;
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;

// namespace AI_DocumentWorkflow.AI
// {
//     public class TextAnalyticsService
//     {
//         private readonly TextAnalyticsClient _client;

//         public TextAnalyticsService(string endpoint, string apiKey)
//         {
//             _client = new TextAnalyticsClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
//         }

//         /// <summary>
//         /// Perform extractive summarization to generate a one-line summary for the document.
//         /// </summary>
//         /// <param name="content">The content of the document.</param>
//         /// <param name="sentenceCount">Number of sentences to return in the summary.</param>
//         /// <returns>A summarized sentence.</returns>
//         public async Task<string> AbstractiveSummarizeAsync(string content)
//         {
//             if (string.IsNullOrWhiteSpace(content))
//             {
//                 return "Summary not available.";
//             }

//             try
//             {
//                 // Prepare the document list
//                 var documents = new List<TextDocumentInput>
//                 {
//                     new TextDocumentInput("1", content) { Language = "en" }
//                 };

//                 // Define options for summarization
//                 var options = new AbstractiveSummarizeOptions
//                 {
//                     MaxSentenceCount = 3 // Adjust as needed
//                 };

//                 // Perform abstractive summarization
//                 var operation = await _client.AbstractiveSummarizeAsync(
//                     WaitUntil.Completed,
//                     documents,
//                     options
//                 );

//                 // Process the response
//                 foreach (var result in operation.Value)
//                 {
//                     if (!result.HasError)
//                     {
//                         var summary = string.Join(" ", result.Summaries);
//                         return summary;
//                     }
//                     else
//                     {
//                         Console.WriteLine($"Error: {result.Error.Message}");
//                     }
//                 }
//             }
//             catch (RequestFailedException ex)
//             {
//                 Console.WriteLine($"Azure error: {ex.Message}");
//             }
//             catch (Exception ex)
//             {
//                 Console.WriteLine($"Unexpected error: {ex.Message}");
//             }

//             return "Summary not available.";
//         }

