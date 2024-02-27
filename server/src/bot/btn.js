const { keyboard, inlineKeyboard, button } = require('telegraf').Markup;
const moment = require('moment');
module.exports = {
    main: keyboard([
        ["📑Mahsulotlar kategoriyasi"],
        [button.webApp("📋Veb menyu", 'https://65ddfdec455cb805a2be571e--starlit-pony-cceeae.netlify.app')],
        ["📞Aloqa", "📚Bot haqida"],
        ["🔎Mahsulot qidiruvi"],
        // , "🥇HADAF haqida"
    ]).resize(true),
    // 
    phone: keyboard([
        [button.contactRequest("📞Raqamni yuborish")]
    ]).resize(true),
    // 
    location: keyboard([
        [button.locationRequest("🌍Joylashuvni yuborish")],
        ["🔙Ortga"]
    ]).resize(true),
    // 
    back: keyboard([
        ["🔙Ortga"]
    ]).resize(true),
    // 
    support: inlineKeyboard([
        [{ text: "⚙️Dasturchi", url: "https://t.me/saidweb" }]
    ]),
    // 
    get_all_products: (p) => {
        const key = [];
        p?.forEach((p, i) => {
            key.push([
                {
                    text: `${i + 1} - ${p?.title} - ${Number(p?.price)?.toLocaleString()} so'm`,
                    callback_data: `user_product_${p?._id}`
                }
            ])
        });
        return inlineKeyboard(key)
    },
    product_menu: inlineKeyboard([
        [{ text: "📦Barcha mahsulotlarni ko'rish", callback_data: `user_getall_products` }],
        [{ text: "📃Kategoriya bo'yicha saralash", callback_data: `user_getall_categories` }]
    ]),
    product_shop_menu: (id) => {
        return inlineKeyboard([
            [{ text: "🛒Sotib olish", callback_data: `user_shop_${id}` }],
            [{ text: "🔙Ortga", callback_data: `user_getall_products` }],
        ]);
    },
    get_all_categories: (p) => {
        const key = [];
        p?.forEach((p, i) => {
            key.push([
                {
                    text: `${i + 1} - ${p?.title}`,
                    callback_data: `user_category_${p?._id}`
                }
            ])
        });
        return inlineKeyboard(key)
    },
    get_all_products_by_category: (c, p) => {
        const key = [];
        p?.forEach((p, i) => {
            key?.push([
                {
                    text: `${i + 1} - ${p?.title} - ${Number(p?.price)?.toLocaleString()} so'm`,
                    callback_data: `user_product_${p?._id}`
                }
            ])
        });
        key?.push([{
            text: `🔙Ortga`,
            callback_data: `user_getall_categories`
        }])
        return inlineKeyboard(key)
    },
    product_shop_menu_by_category: (c, id) => {
        return inlineKeyboard([
            [{ text: "🛒Sotib olish", callback_data: `user_shop_${id}` }],
            [{ text: "🔙Ortga", callback_data: `user_category_${c?._id}` }],
        ]);
    },
    // ADMIN
    admin_main: keyboard([
        ["🔗Mahsulotlar", "📃Kategoriyalar"],
        ["🛍️Buyurtmalar","🔎Qidiruv so'rovlari"]
    ]).resize(true),
    // // CATEGORY
    admin_categories: (categories = []) => {
        const keyb = [[{ text: "➕Qo'shish", callback_data: "admin_add_category" }]];
        categories?.forEach((c) => {
            keyb?.push(
                [{ text: c?.title, callback_data: `admin_show_category--${c?._id}` }]
            )
        })
        return inlineKeyboard(keyb);
    },
    admin_category: (c) => {
        return inlineKeyboard([
            [{ text: "✏️Taxrirlash", callback_data: "admin_edit_category--" + c?._id }],
            [{ text: "🗑️O'chirish", callback_data: "admin_delete_category--" + c?._id }],
        ])
    },
    admin_delete_category: (c) => {
        return inlineKeyboard([
            [{ text: "🔙 Ortga", callback_data: `admin_show_category--${c?._id}` },
            { text: "🗑️O'chirish", callback_data: `admin_confirmdelete_category--${c?._id}` }],
        ])
    },
    // PRODUCT
    admin_products: (products = []) => {
        const keyb = [[{ text: "➕Qo'shish", callback_data: "admin_add_product" }]];
        products?.forEach((c) => {
            keyb?.push(
                [{ text: `${c?.title} - ${Number(c?.price)?.toLocaleString()} so'm`, callback_data: `admin_show_product--${c?._id}` }]
            );
        });
        return inlineKeyboard(keyb);
    },
    admin_product_categories: (categories = []) => {
        const keyb = [];
        categories?.forEach((c) => {
            keyb?.push(
                [{ text: c?.title, callback_data: `admin_select_category--${c?._id}` }]
            )
        })
        return inlineKeyboard(keyb);
    },
    admin_product_images: keyboard([
        ["✅Saqlash"],
        ["🔙Ortga"]
    ]).resize(true),
    admin_product: (p) => {
        return inlineKeyboard([
            [{ text: '✏️Nomini taxrirlash', callback_data: `admin_edittitle_product--${p?._id}` },
            { text: '💰Narxni taxrirlash', callback_data: `admin_editprice_product--${p?._id}` }
            ], [
                { text: '📃Batafsilni taxrirlash', callback_data: `admin_editabout_product--${p?._id}` },
                { text: '❌O\'chirib tashlash', callback_data: `admin_delete_product--${p?._id}` }
            ]
        ])
    },
    admin_product_delete: (p) => {
        return inlineKeyboard([
            [
                { text: "🗑️O'chirib tashlash", callback_data: `admin_submitdelete_product--${p?._id}` },
                { text: '🔙Ortga', callback_data: `admin_show_product--${p?._id}` }
            ],
        ])
    },
    // orders
    admin_orders: (r, n, s, d) => {
        return inlineKeyboard([
            [{ text: `📦Yangilarni ko'rish (${n})`, callback_data: `admin_orders_new` }],
            [{ text: `✅Qabullarni ko'rish (${s})`, callback_data: `admin_orders_success` }],
            [{ text: `🚚Yetkazilganlarni ko'rish (${d})`, callback_data: `admin_orders_delivered` }],
        ]);
    },
    admin_orders_list: (o) => {
        const key = [];
        o?.forEach(((or, i) => {
            key.push([{
                text: `${i + 1} - ${or?.product?.title} | ${moment?.unix(or?.created)?.format("DD.MM.YYYY | HH:mm")}`,
                callback_data: `admin_orders_getone--${or?._id}`
            }])
        }))
        return inlineKeyboard(key);
    },
    admin_one_orders: (o, s)=>{
        return inlineKeyboard([
            [{text: "✅Qabul qilindi", callback_data: 'admin_orders_setsuccess--'+o?._id}],
            [{text: "🚚Yetkazildi", callback_data: 'admin_orders_setdelivered--'+o?._id}],
            [{text: "❌Bekor qilindi", callback_data: 'admin_orders_setsuccess--'+o?._id}],
            [{text: "🔙Ortga", callback_data: `admin_orders_${s}`}],
        ])
    } ,
    admin_orders_search_list: (o) => {
        const key = [];
        o?.forEach(((or, i) => {
            key.push([{
                text: `${i + 1} - ${or?.name} | ${moment?.unix(or?.created)?.format("DD.MM.YYYY | HH:mm")}`,
                callback_data: `admin_orders_getsearchone--${or?._id}`
            }])
        }))
        return inlineKeyboard(key);
    },
    admin_one_orders_search: (o, s)=>{
        return inlineKeyboard([
            [{text: "✅Qabul qilindi", callback_data: 'admin_orders_stsearchsuccess--'+o?._id}],
            [{text: "🚚Yetkazildi", callback_data: 'admin_orders_stsearchdelivered--'+o?._id}],
            [{text: "❌Bekor qilindi", callback_data: 'admin_orders_stsearchsuccess--'+o?._id}],
            [{text: "🔙Ortga", callback_data: `admin_searchorders_${s}`}],
        ])
    } 
}