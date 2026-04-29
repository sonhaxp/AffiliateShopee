import asyncio
from playwright.async_api import async_playwright
from playwright_stealth import Stealth
import logging
import random
import re

class ProductScraper:
    async def scrape_shopee(self, url):
        async with async_playwright() as p:
            # DÙNG CHẾ ĐỘ HEADLESS=FALSE NẾU CẦN THIẾT (NHƯNG Ở ĐÂY TA THỬ LÁCH TRƯỚC)
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={'width': 1366, 'height': 768},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            )
            page = await context.new_page()
            await Stealth().apply_stealth_async(page)
            
            logging.info(f"Đang thực hiện 'Hành trình người dùng' để lách Captcha...")
            try:
                # 1. Vào trang chủ trước để lấy Cookie/Session 'sạch'
                await page.goto("https://shopee.vn/", wait_until="networkidle", timeout=60000)
                await asyncio.sleep(random.uniform(2, 4))
                
                # Rê chuột ngẫu nhiên trên trang chủ
                await page.mouse.move(random.randint(100, 500), random.randint(100, 500))
                await asyncio.sleep(1)

                # 2. Bây giờ mới vào link sản phẩm thực tế
                logging.info(f"Đang chuyển hướng sang sản phẩm: {url}")
                await page.goto(url, wait_until="networkidle", timeout=60000)
                await asyncio.sleep(random.uniform(5, 8))

                # Kiểm tra tình trạng trang
                title = await page.title()
                logging.info(f"Tiêu đề trang: {title}")
                if "verify" in page.url or "Hot Deals" in title:
                    logging.warning("⚠️ Vẫn gặp trang xác minh. Đang thử cuộn trang để tự giải...")
                    await page.mouse.wheel(0, 400)
                    await asyncio.sleep(3)
                    title = await page.title() # Cập nhật lại title

                # DÙNG JS QUÉT TOÀN BỘ CÁC THẺ CÓ THỂ CHỨA ẢNH
                image_urls = await page.evaluate("""
                    () => {
                        const urls = [];
                        document.querySelectorAll('img, source').forEach(el => {
                            const src = el.src || el.dataset.src || el.getAttribute('src');
                            if (src && src.includes('http')) urls.push(src);
                            if (el.srcset) {
                                el.srcset.split(',').forEach(s => {
                                    const link = s.trim().split(' ')[0];
                                    if (link.includes('http')) urls.push(link);
                                });
                            }
                        });
                        return urls;
                    }
                """)

                # QUÉT REGEX DNA
                content = await page.content()
                shopee_dna_pattern = r'(?:sg|vn)-[a-zA-Z0-9-]+'
                ids = re.findall(shopee_dna_pattern, content)
                for i in ids:
                    if len(i) > 20:
                        image_urls.append(f"https://down-vn.img.susercontent.com/file/{i}")

                # BỘ LỌC TINH KHIẾT
                final_images = []
                blacklist = ['mobile', 'setting', 'mall', 'buyer', 'app', 'status', 'icon', 'logo', 'plus', 'skin', 'banner']
                
                for url in list(dict.fromkeys(image_urls)):
                    url_lower = url.lower()
                    if any(word in url_lower for word in blacklist): continue
                    if "susercontent" not in url_lower and "cf.shopee" not in url_lower: continue
                    
                    clean_url = re.sub(r'_(?:tn|he|sm|md|lg).*$', '', url)
                    clean_url = clean_url.split('@')[0].split('?')[0]
                    if not clean_url.startswith('http'): 
                        clean_url = 'https:' + clean_url if clean_url.startswith('//') else clean_url
                    
                    img_id = clean_url.split('/')[-1]
                    if "-" in img_id and len(img_id) >= 20:
                        final_images.append(clean_url)

                product_data = {
                    'name': title.split('|')[0].strip(),
                    'images': list(dict.fromkeys(final_images))[:12],
                    'price': "Liên hệ"
                }
                
                if not product_data['images']:
                    logging.warning("⚠️ Không bốc được ảnh. Shopee vẫn đang chặn hoặc trang không load được ảnh.")
                else:
                    logging.info(f"KẾT QUẢ: Đã lách thành công và tìm thấy {len(product_data['images'])} ảnh.")
                    for idx, img in enumerate(product_data['images']):
                        logging.info(f"📸 Ảnh {idx+1}: {img}")
                    
                return product_data
            except Exception as e:
                logging.error(f"Lỗi: {e}")
                return None
            finally:
                await browser.close()

    async def scrape(self, url):
        if "shopee.vn" in url:
            return await self.scrape_shopee(url)
        return None
