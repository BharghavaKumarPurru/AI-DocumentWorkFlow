using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class TextAnalyticsService
{
    private readonly string _huggingFaceApiUrl = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"; // Hugging Face endpoint for summarization
    private readonly string _huggingFaceApiKey= "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";

    public TextAnalyticsService(string huggingFaceApiKey, string v)
    {
        _huggingFaceApiKey = huggingFaceApiKey;
    }

    public async Task<string> AbstractiveSummarizeAsync(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return "Summary not available.";
        }

        try
        {
            using HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_huggingFaceApiKey}");

            var requestBody = new
            {
                inputs = content,
                parameters = new
                {
                    max_length = 100, // Maximum length of the summary
                    min_length = 50,  // Minimum length of the summary
                    do_sample = false
                }
            };

            string jsonBody = JsonSerializer.Serialize(requestBody);
            HttpContent httpContent = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(_huggingFaceApiUrl, httpContent);

            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<List<Dictionary<string, string>>>(responseBody);

                // Extract and return the summary text
                return result?[0]?["summary_text"] ?? "Summary not available.";
            }
            else
            {
                string errorMessage = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Hugging Face API error: {response.StatusCode} - {errorMessage}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
        }

        return "Summary not available.";
    }

    /// <summary>
    /// Categorize a document based on its content using key phrases.
    /// </summary>
    /// <param name="content">The content of the document.</param>
    /// <returns>The category of the document.</returns>
    public async Task<string> CategorizeDocumentAsync(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return "Uncategorized";
        }

        try
        {
            // Define categories and their associated keywords
            var categories = new[]
            {
            new { Category = "Finance", Keywords = new[] { "investment", "finance", "banking", "accounting", "budget", "profit", "equity", "dividend", "expenses", "financial statement", "capital", "ROI" } },
            new { Category = "Sales", Keywords = new[] { "sales", "marketing", "customer", "revenue", "product", "pricing", "promotion", "lead generation", "campaign", "pipeline", "B2B", "B2C" } },
            new { Category = "HR", Keywords = new[] { "recruitment", "hiring", "employee", "policy", "training", "onboarding", "payroll", "HRIS", "performance", "benefits", "diversity", "workforce" } },
            new { Category = "IT", Keywords = new[] { "technology", "software", "hardware", "network", "security", "development", "cloud", "data center", "infrastructure", "DevOps", "cybersecurity", "database", "AI", "ML" } },
            new { Category = "Management", Keywords = new[] { "management", "leadership", "strategy", "planning", "organization", "goal", "roadmap", "team building", "stakeholders", "KPIs", "decision making", "operations" } },
            new { Category = "Legal", Keywords = new[] { "law", "contract", "compliance", "policy", "regulation", "litigation", "intellectual property", "negotiation", "dispute", "arbitration", "risk management", "legal framework" } },
            new { Category = "Marketing", Keywords = new[] { "advertising", "campaign", "brand", "promotion", "content", "media", "SEO", "social media", "analytics", "target audience", "public relations", "creative" } }
        };

            // Match categories based on keyword frequency
            var categoryScores = new Dictionary<string, int>();

            foreach (var category in categories)
            {
                int matchCount = category.Keywords
                    .Count(keyword => content.Contains(keyword, StringComparison.OrdinalIgnoreCase));

                if (matchCount > 0)
                {
                    categoryScores[category.Category] = matchCount;
                }
            }

            // Select the category with the highest score
            if (categoryScores.Count > 0)
            {
                return categoryScores
                    .OrderByDescending(kvp => kvp.Value)
                    .First()
                    .Key;
            }

            return "General"; // Default category if no match is found
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
            return "Uncategorized";
        }
    }

}
