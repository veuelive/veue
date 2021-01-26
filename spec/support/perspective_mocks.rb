# frozen_string_literal: true

def setup_perspective_mock(key_name, response)
  stub_request(:post, /commentanalyzer/)
    .with { PerspectiveApi.key == key_name }
    .to_return(body: response.to_json)
end

def mock_score_for(key_name, score)
  setup_perspective_mock(
    key_name,
    {
      attributeScores: {
        TOXICITY: {
          summaryScore: {
            value: score,
          },
        },
      },
    },
  )
end

def setup_perspective_mocks!
  PerspectiveApi.enabled = true
  PerspectiveApi.key = "PASS"

  mock_score_for("PASS", 0.1982)
  mock_score_for("FAIL", 0.982)

  setup_perspective_mock(
    "ERROR",
    {
      error: {
        message: "FAILED",
      },
    },
  )
end
