import requests
import json

BASE_URL = "http://localhost:5000"

def test_analyze(content, type_of_content="text", tag="news"):
    url = f"{BASE_URL}/predict"
    data = {
        "type_of_content": type_of_content,
        "content": content,
        "tag": tag
    }
    
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 50)

if __name__ == "__main__":
    # Test cases
    test_cases = [
        "The president announced new policies today.",  # Real news
        "Aliens landed in Delhi yesterday.",           # Fake news
        "",                                            # Empty content (should error)
        "Breaking: Earth is flat confirmed!"           # Obvious fake
    ]
    
    for content in test_cases:
        test_analyze(content)
