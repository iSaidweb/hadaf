const moment = require('moment');
module.exports = {
    start: "<b>👋Assalomu aleykum botimizga xush kelibsiz</b>\n📨Kerakli bo'limni tanlang!",
    restart: "<b>👋Assalomu aleykum botimizga xush kelibsiz!</b>\n📨Kerakli bo'limni tanlang!",
    about: `Mahsulotlarimizni 📦 Mahsulotlar bo’limidan topishingiz mumkin\nSizni qiziqtirgan  yana boshqa  turdagi mahsulotlar bo’lsa 🛍️siz izlagan mahsulot bo’limidan  buyurtma  berishingiz yoki offisga  tashrif buyurishingiz  mumkin`,
    support: "<b>📞Aloqa markazlari</b>\n+998-95-175-10-00\n+998-77-128-10-00\n+998-77-305-10-00",
    product_menu: "<b>📃Qanday tartibda mahsulotlar chiqarilsin?</b>",
    about_hadaf: "s",
    search_photo: "<b>🖼️ Sizga qanday mahsulot kerak?</b>\niltimos rasmini yuboring!",
    get_all_products: (p) => {
        let txt = "<b>📦Barcha mahsulotlar</b>\n\n";
        p?.reverse()?.forEach((p, i) => {
            txt += `<i>${i + 1} - <b>${p?.title}</b> | ${Number(p?.price)?.toLocaleString()} so'm</i>\n`
        });
        return txt;
    },
    // categories: 
    get_all_categories: (p) => {
        let txt = "<b>📃Barcha kategoriyalar</b>\n\n";
        p?.reverse()?.forEach((p, i) => {
            txt += `<i>${i + 1} - <b>${p?.title}</b></i>\n`
        });
        return txt;
    },
    get_all_products_by_category: (c, p) => {
        let txt = `📃Kategoriya: <b>${c?.title}</b>\n<b>📦Barcha tegishli mahsulotlar</b>\n\n`;
        p?.reverse()?.forEach((p, i) => {
            txt += `<i>${i + 1} - <b>${p?.title}</b> | ${Number(p?.price)?.toLocaleString()} so'm</i>\n`
        });
        return txt;
    },
    // SHOPPING
    request_count: "<b>📦Mahsulot soni( Raqamlarda )\n📃Namuna: 10</b>",
    request_name: "<b>👤Ismingizni kiriting</b>\n📃Namuna: Saidislom",
    request_phone: "<b>📞Raqamingizni kiriting</b>\n📃Namuna: 901234567",
    request_location: "<b>🌍Buyurtmani yetkazib berish manzilini yuboring( Lokatsiya )</b>",
    success_order: "<b>✅Buyurtmangiz qabul qilindi!</b>\n📞Tez orada siz bilan bog'lanamiz!",
    no_product: "<b>❌Mahsulotlar mavjud emas!</b>",
    // // ADMIN
    admin: "<b>👨‍✈️Admin panel</b>",
    admin_success: "<b>✅Bajarildi!</b>",
    // CATEGORY
    admin_categories: (categories = []) => {
        let text = "<b>📃kategoriyalar</b>\n\n";
        const notext = "<b>❌Kategoriyalar mavjud emas!</b>";
        categories?.forEach((c, i) => {
            text += `<i>${i + 1} - ${c?.title}</i>\n`;
        });
        return !categories[0] ? notext : text;
    },
    admin_category_title: "<b>📃Kategoriya uchun nom kiriting!</b>",
    admin_category: (c, p) => {
        return `<b>${c?.title}</b>\n📦Biriktirilgan mahsulotlar: <b>${p}</b>ta`
    },
    admin_delete_category: (c) => {
        return `<b>${c?.title}</b> - kategoriyasi chindan ham o'chirilsinmi?`
    },
    // PRODUCT
    admin_products: (products = []) => {
        let text = "<b>📦Mahsulotlar</b>\n\n";
        const notext = "<b>❌Mahsulotlar mavjud emas!</b>";
        products?.forEach((p, i) => {
            text += `<i>${i + 1} - <b>${p?.title}</b> | ${Number(p?.price)?.toLocaleString()} so'm</i>\n`;
        });
        return !products[0] ? notext : text;
    },
    admin_product_title: "<b>✏️Mahsulot nomini kiriting!</b>",
    admin_product_about: "<b>📃Mahsulot haqida batafsil ma'lumot kiriting!</b>",
    admin_product_price: "<b>💰Mahsulot narxini RAQAMLARDA kiriting!</b>\n📃Namuna: 99000",
    admin_product_category: "<b>📃Mahsulot uchun kategoriya tanlang!</b>",
    admin_product_images: "<b>🖼️Mahsulot rasmini donalab yuboring!</b>",
    admin_image_set: "🖼️Rasm saqlandi keyingi rasmni yuboring yoki <b>✅Saqlash</b> tugmasini bosing!",
    admin_delete_product: (p) => {
        return `🗑️Diqqat <b>${p?.title}</b> chindan ham o'chirilsinmi? Qayta tiklab bo'lmaydi!`
    },
    // orders
    admin_orders: (r, n, s, d) => {
        return `📦 Yangi buyurtmalar: <b>${n}</b> ta\n\n✅ Qabul qilingan( yetkazib berish kutilmoqda )lar: <b>${s}</b> ta\n\n🚚 Yetkazib berilganlar: <b>${d}</b> ta\n\n❌ Rad etilganlar: <b>${r}</b> ta`
    },
    admin_no_orders: "<b>❌Buyurtmalar mavjud emas!</b>",
    admin_orders_list: (o, s) => {
        let txt = `<b>📦${s === 'new' ? "Yangi" : s === "success" ? "Qabul qilingan" : s === "delivered" ? "Yetkazilgan" : "Rad etilgan"}</b> buyurtmalar <b>${o?.length}</b> ta\n\n`;
        o?.forEach(((or, i) => {
            txt += `<i>${i + 1} - <b>${or?.product?.title}</b> | ${moment?.unix(or?.created)?.format("DD.MM.YYYY | HH:mm")}</i>\n`
        }));
        return txt
    },
    // SWET
    admin_one_orders: (o) => {
        return `🌍Manzili: 👆\n📦Mahsulot: <b>${o?.product?.title}</b>\n📃Mahulot soni: <b>${o?.count || 1}</b>\n💰Narxi: <b>${o?.product?.price?.toLocaleString()}</b> so'm\n👤Buyurtmachi: <b>${o?.name}</b>\n📞Raqami: <code>${o?.phone}</code>`
    },
    admin_set_status: (s) => {
        return `📃Buyurtma <b>${s === 'new' ? 'Yangi' : s === 'success' ? "Qabul qilingan" : s === 'delivered' ? "Yetkazilgan" : "Bekor qilingan"}larga o'tkazildi!</b>`
    },
    admin_orders_search_list: (o, s) => {
        let txt = `<b>📦${s === 'new' ? "Yangi" : s === "success" ? "Qabul qilingan" : s === "delivered" ? "Yetkazilgan" : "Rad etilgan"}</b> buyurtmalar <b>${o?.length}</b> ta\n\n`;
        o?.forEach(((or, i) => {
            txt += `<i>${i + 1} - <b>${or?.name}</b> | ${moment?.unix(or?.created)?.format("DD.MM.YYYY | HH:mm")}</i>\n`
        }));
        return txt
    },
    admin_one_search_orders: (o) => {
        return `🌍Manzili: 👆\n📃Mahulot soni: <b>${o?.count || 1}</b>\n👤Buyurtmachi: <b>${o?.name}</b>\n📞Raqami: <code>${o?.phone}</code>`
    },
}