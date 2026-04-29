import os
import requests
from moviepy.editor import ImageClip, concatenate_videoclips
from PIL import Image, ImageDraw, ImageFont
import logging
import traceback
import textwrap

class MediaEngine:
    def __init__(self):
        backend_wwwroot = os.path.abspath(os.path.join(os.getcwd(), "..", "Backend", "src", "Affiliate.API", "wwwroot"))
        self.output_dir = os.path.join(backend_wwwroot, "outputs")
        self.temp_dir = "temp"
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.temp_dir, exist_ok=True)
        logging.info(f"MediaEngine initialized. Output: {self.output_dir}")

    def add_text_to_image(self, image_path, text):
        """Vẽ chữ lên ảnh bằng Pillow (Không cần ImageMagick)"""
        try:
            img = Image.open(image_path).convert("RGB")
            # Resize ảnh về chuẩn HD (720x1280) cho TikTok
            img = img.resize((720, 1280), Image.Resampling.LANCZOS)
            
            draw = ImageDraw.Draw(img)
            
            # Thử lấy font hệ thống trên Windows
            try:
                font = ImageFont.truetype("arial.ttf", 40)
            except:
                font = ImageFont.load_default()

            # Chia text thành nhiều dòng
            lines = textwrap.wrap(text, width=30)
            
            # Vẽ dải nền đen ở dưới để chữ nổi bật
            banner_height = 100 + (len(lines) * 45)
            overlay = Image.new('RGBA', img.size, (0,0,0,0))
            draw_ov = ImageDraw.Draw(overlay)
            draw_ov.rectangle([0, 1280 - banner_height, 720, 1280], fill=(0,0,0,160))
            img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
            
            draw = ImageDraw.Draw(img)
            y_text = 1280 - banner_height + 20
            for line in lines:
                # Tính toán căn giữa
                w = draw.textlength(line, font=font)
                draw.text(((720 - w) / 2, y_text), line, font=font, fill="white")
                y_text += 50
                
            new_path = image_path.replace(".jpg", "_ready.jpg")
            img.save(new_path)
            return new_path
        except Exception as e:
            logging.error(f"Lỗi add_text_to_image: {e}")
            return image_path

    def create_video(self, product_data, script, job_id):
        try:
            logging.info(f"Đang dựng video 15s cho Job {job_id}...")
            image_paths = []
            
            # Danh sách các server ảnh của Shopee để thử dần
            domains = [
                "https://down-vn.img.susercontent.com/file/",
                "https://cf.shopee.vn/file/",
                "https://down-tx-vn.img.susercontent.com/file/",
                "https://down-id.img.susercontent.com/file/"
            ]
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Referer": "https://shopee.vn/",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
                "Cache-Control": "no-cache"
            }
            
            for i, img_url in enumerate(product_data['images']):
                img_id = img_url.split('/')[-1]
                success = False
                
                # Thử từng domain cho đến khi được thì thôi
                for domain in domains:
                    try:
                        try_url = f"{domain}{img_id}"
                        response = requests.get(try_url, timeout=10, headers=headers)
                        if response.status_code == 200:
                            path = os.path.join(self.temp_dir, f"{job_id}_{i}.jpg")
                            with open(path, "wb") as f:
                                f.write(response.content)
                            image_paths.append(path)
                            success = True
                            logging.info(f"✅ Tải thành công từ {domain}: {img_id}")
                            break
                        else:
                            continue
                    except:
                        continue
                
                if not success:
                    logging.warning(f"Không thể tải ảnh {img_id} từ bất kỳ server nào.")

            if not image_paths: return None

            # Tách kịch bản thành các câu
            sentences = [s.strip() for s in script.split('.') if len(s.strip()) > 5]
            if not sentences: sentences = [product_data['name']]

            # Tính toán thời lượng: Cố định 15s tổng cộng
            total_duration = 15
            num_images = len(image_paths)
            duration_per_clip = total_duration / num_images
            
            clips = []
            for i, img_path in enumerate(image_paths):
                # Lấy câu kịch bản tương ứng (lặp lại nếu hết câu)
                txt = sentences[i % len(sentences)]
                
                # Chèn chữ vào ảnh
                ready_img_path = self.add_text_to_image(img_path, txt)
                
                # Tạo clip
                clip = ImageClip(ready_img_path).set_duration(duration_per_clip)
                clips.append(clip)

            # Ghép video
            final_video = concatenate_videoclips(clips, method="compose")
            output_path = os.path.join(self.output_dir, f"video_{job_id}.mp4")
            
            logging.info(f"Đang xuất video 15s: {output_path}")
            final_video.write_videofile(output_path, fps=24, codec="libx264", audio=False)
            
            # Dọn dẹp
            for p in image_paths:
                try: os.remove(p); os.remove(p.replace(".jpg", "_ready.jpg"))
                except: pass
                
            return output_path
            
        except Exception as e:
            logging.error(f"Render lỗi: {e}")
            return None
