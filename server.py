from flask import Flask, request, jsonify
import requests
import traceback

API_KEY = "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message")
    print("📩 Roblox ส่งมา:", message)

    try:
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost",  # หรือโดเมนของคุณ
            "X-Title": "roblox-chat-ai"
        }

        payload = {
            "model": "google/gemini-pro",
            "messages": [
                {"role": "system", "content": "คุณคือผู้ช่วยพูดไทยใน Roblox เป็นมิตร"},
                {"role": "user", "content": message}
            ]
        }

        response = requests.post(API_URL, headers=headers, json=payload)
        result = response.json()
        print("📦 ตอบกลับจาก AI:", result)  
        reply = result["choices"][0]["message"]["content"]
        print("🤖 Gemini ตอบ:", reply)
        return jsonify({"reply": reply})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"reply": "เกิดข้อผิดพลาดจาก AI"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
