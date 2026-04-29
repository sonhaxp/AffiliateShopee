import os
import openai
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class AIEngine:
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "gemini").lower()
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        
        # Cấu hình Gemini nếu có key
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            
        # Cấu hình OpenAI nếu có key
        if self.openai_key:
            openai.api_key = self.openai_key

    def generate_script(self, product_name, price, description=""):
        prompt = f"""
        Bạn là một chuyên gia viết kịch bản TikTok, Shopee ngắn.
        Hãy viết 6 câu quảng cáo cho sản phẩm: {product_name} với giá {price}.
        
        Yêu cầu:
        - Mỗi câu dưới 12 từ.
        - Tổng cộng đúng 6 câu.
        - Câu 1: Hook thu hút.
        - Câu 2-5: Tính năng/Lợi ích.
        - Câu 6: Kêu gọi mua ngay.
        
        Chỉ trả về các câu văn, phân cách bằng dấu chấm.
        """

        if self.provider == "gemini" and self.gemini_key:
            return self._generate_with_gemini(prompt)
        elif self.provider == "openai" and self.openai_key:
            return self._generate_with_openai(prompt)
        else:
            return f"[Kịch bản dự phòng]: Siêu phẩm {product_name} giá chỉ {price}. Mua ngay!"

    def _generate_with_gemini(self, prompt):
        try:
            # Sử dụng model Gemini 3 Flash Preview mới nhất
            model = genai.GenerativeModel('gemini-3-flash-preview')
            response = model.generate_content(prompt)
            return response.text.replace('*', '').replace('#', '')
        except Exception as e:
            return f"Lỗi Gemini: {e}"

    def _generate_with_openai(self, prompt):
        try:
            response = openai.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Lỗi OpenAI: {e}"

# Test
if __name__ == "__main__":
    engine = AIEngine()
    # print(f"Dùng {engine.provider}: {engine.generate_script('Sản phẩm A', '100k')}")
