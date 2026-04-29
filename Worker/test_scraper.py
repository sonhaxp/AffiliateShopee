import asyncio
import logging
from scraper import ProductScraper

async def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    scraper = ProductScraper()
    url = "https://shopee.vn/M%C3%A1y-N%C6%B0%E1%BB%9Bng-B%C3%A1nh-M%C3%A1y-L%C3%A0m-B%C3%A1nh-K%E1%BA%B9p-M%C3%A1y-L%C3%A0m-B%C3%A1nh-Qu%E1%BA%BF-B%C3%A1nh-T%E1%BB%95-Ong-M%C3%A1y-l%C3%A0m-b%C3%A1nh-waffle-Cao-c%E1%BA%A5p-i.1171350084.27562872349"
    
    print(f"\n--- BẮT ĐẦU UNIT TEST ---")
    data = await scraper.scrape(url)
    
    if data and len(data.get('images', [])) > 0:
        print("\n✅ THÀNH CÔNG!")
        print(f"Tên: {data['name']}")
        print(f"Giá: {data['price']}")
        print(f"Số lượng ảnh: {len(data['images'])}")
        for img in data['images']:
            print(f" - {img}")
    else:
        print("\n❌ THẤT BẠI: Không cào được dữ liệu hoặc thiếu ảnh.")

if __name__ == "__main__":
    asyncio.run(main())
