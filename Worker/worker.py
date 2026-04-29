import time
import requests
import logging
import os
import asyncio
import traceback
from scraper import ProductScraper
from ai_engine import AIEngine
from media_engine import MediaEngine

# Cấu hình logging để vừa hiện ở console vừa ghi vào file
logger = logging.getLogger()
logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# Ghi ra Console
ch = logging.StreamHandler()
ch.setFormatter(formatter)
logger.addHandler(ch)

# Ghi ra File
fh = logging.FileHandler('log.txt', encoding='utf-8-sig')
fh.setFormatter(formatter)
logger.addHandler(fh)

# Cấu hình API Backend
API_BASE_URL = "http://localhost:5249/api/videos"
TEMP_DIR = "temp_assets"

class AffiliateWorker:
    def __init__(self):
        self.scraper = ProductScraper()
        self.ai = AIEngine()
        self.media = MediaEngine()
        os.makedirs(TEMP_DIR, exist_ok=True)

    def download_image(self, url, filename):
        try:
            resp = requests.get(url, stream=True, timeout=10)
            if resp.status_code == 200:
                path = os.path.join(TEMP_DIR, filename)
                with open(path, 'wb') as f:
                    for chunk in resp.iter_content(1024):
                        f.write(chunk)
                return path
        except Exception as e:
            logging.error(f"Lỗi tải ảnh: {e}")
        return None

    async def run(self):
        logging.info("Worker đang lắng nghe Job...")
        while True:
            try:
                response = requests.get(f"{API_BASE_URL}/pending")
                if response.status_code == 200:
                    job = response.json()
                    await self.process_job(job)
                elif response.status_code == 404:
                    pass # Hàng đợi trống
                else:
                    logging.error(f"Lỗi kết nối API: {response.status_code}")
            except Exception as e:
                logging.error(f"Lỗi vòng lặp Worker: {e}")
                logging.error(traceback.format_exc())
            
            await asyncio.sleep(5)

    async def process_job(self, job):
        job_id = job['id']
        product_link = job['productUrl']
        
        logging.info(f"--- Bắt đầu Job: {job_id} ---")
        
        # 1. Cào dữ liệu
        product_data = await self.scraper.scrape(product_link)
        if not product_data:
            logging.error("Không thể cào dữ liệu sản phẩm.")
            return

        # 2. Sinh kịch bản AI
        script = self.ai.generate_script(product_data['name'], product_data['price'])
        logging.info("Đã sinh xong kịch bản AI.")

        # 3. Dựng video
        video_path = self.media.create_video(product_data, script, job_id)

        if video_path:
            # 4. Báo cáo hoàn thành cho Backend
            output_name = os.path.basename(video_path)
            self.report_completion(job_id, f"/outputs/{output_name}")
            logging.info(f"Hoàn thành Job {job_id} rực rỡ!")
        else:
            logging.error(f"Render Job {job_id} thất bại.")

    def report_completion(self, job_id, video_url):
        try:
            requests.post(f"{API_BASE_URL}/complete", json={
                "jobId": job_id,
                "videoUrl": video_url
            })
        except Exception as e:
            logging.error(f"Lỗi báo cáo hoàn thành: {e}")

if __name__ == "__main__":
    worker = AffiliateWorker()
    asyncio.run(worker.run())
