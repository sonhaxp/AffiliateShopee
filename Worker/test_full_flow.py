import asyncio
import logging
import os
from scraper import ProductScraper
from ai_engine import AIEngine
from media_engine import MediaEngine

async def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    scraper = ProductScraper()
    ai = AIEngine()
    media = MediaEngine()
    
    url = "https://shopee.vn/M%C3%A1y-N%C6%B0%E1%BB%9Bng-B%C3%A1nh-M%C3%A1y-L%C3%A0m-B%C3%A1nh-K%E1%BA%B9p-M%C3%A1y-L%C3%A0m-B%C3%A1nh-Qu%E1%BA%BF-B%C3%A1nh-T%E1%BB%95-Ong-M%C3%A1y-l%C3%A0m-b%C3%A1nh-waffle-Cao-c%E1%BA%A5p-i.1171350084.27562872349"
    job_id = "test_unit_final"
    
    print(f"\n--- BẮT ĐẦU TEST TỔNG LỰC ---")
    
    # 1. Cào dữ liệu
    print("\n[1/3] Đang cào dữ liệu Shopee...")
    product_data = await scraper.scrape(url)
    if not product_data or not product_data['images']:
        print("❌ Lỗi cào dữ liệu.")
        return

    # 2. Sinh kịch bản
    print(f"\n[2/3] Đang sinh kịch bản cho: {product_data['name']}")
    script = ai.generate_script(product_data['name'], "Liên hệ")
    print(f"Kịch bản: {script[:100]}...")

    # 3. Dựng video
    print("\n[3/3] Đang dựng video...")
    video_path = media.create_video(product_data, script, job_id)
    
    if video_path and os.path.exists(video_path):
        print(f"\n✅ THÀNH CÔNG RỰC RỠ!")
        print(f"File video tại: {video_path}")
    else:
        print("\n❌ THẤT BẠI ở bước dựng video. Kiểm tra log phía trên.")

if __name__ == "__main__":
    asyncio.run(main())
