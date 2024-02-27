const { Telegraf } = require('telegraf');
const { TOKEN } = require('../helpers/env.helper');
const userModel = require('../models/user.model');
const txt = require('./txt');
const btn = require('./btn');
const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const uploadHelper = require('../helpers/upload.helper');
const md5 = require('md5');
const bot = new Telegraf(TOKEN);
const fs = require('fs');
const orderModel = require('../models/order.model');
const moment = require('moment/moment');
const searchModel = require('../models/search.model');
// 
bot.start(async msg => {
    const { id, first_name } = msg.from;
    const $user = await userModel.findOne({ telegram: id });
    if (!$user) {
        new userModel({
            name: first_name?.replaceAll('/', '')?.replaceAll('<', '')?.replaceAll('?', '')?.replaceAll('\\', ''),
            telegram: id,
        }).save();
        msg.replyWithHTML(txt?.start, { ...btn?.main });
    } else {
        msg.replyWithHTML(txt?.restart, { ...btn?.main });
    }
});
// 
bot.on('text', async msg => {
    const { id, first_name } = msg.from;
    const tx = msg?.message?.text;
    const $user = await userModel.findOne({ telegram: id });
    function sm(text = txt.restart, button = btn.main) {
        msg.replyWithHTML(text, { ...button });
    }
    if (!$user) {
        new userModel({
            name: first_name?.replaceAll('/', '')?.replaceAll('<', '')?.replaceAll('?', '')?.replaceAll('\\', ''),
            telegram: id,
        }).save();
        sm(txt?.start, btn?.main);
    } else if (tx === "🔙Ortga") {
        fs?.unlink('.' + $user?.etc?.image, () => { });
        $user.set({ step: '', etc: {} }).save();
        if ($user.role === 'admin') {
            sm(txt?.admin, btn?.admin_main);
        } else {
            sm(txt?.restart, btn?.main);
        }
    } else if (tx === "📚Bot haqida") {
        sm(txt?.about);
    } else if (tx === "📞Aloqa") {
        sm(txt?.support, btn?.support)
    } else if (tx === "📦Mahsulotlar") {
        const c = await categoryModel.find({ active: true });
        sm(txt?.get_all_categories(c), btn?.get_all_categories(c));
    } else if (tx === "📑Mahsulotlar kategoriyasi") {
        const c = await categoryModel.find({ active: true });
        sm(txt?.get_all_categories(c), btn?.get_all_categories(c));
    } else if (tx === "🥇HADAF haqida") {
        sm(txt?.about_hadaf, btn?.main);
    } else if (tx === "🔎Mahsulot qidiruvi") {
        $user?.set({ step: "search_photo" }).save();
        sm(txt?.search_photo, btn?.back)
    } else if (tx === '/admin' && $user?.role === 'admin') {
        sm(txt?.admin, btn?.admin_main);
    } else if (tx === '📃Kategoriyalar' && $user?.role === 'admin') {
        const $categories = await categoryModel.find({ active: true });
        sm(txt?.admin_categories($categories), btn?.admin_categories($categories));
    } else if (tx === '🔗Mahsulotlar' && $user?.role === 'admin') {
        const $products = await productModel.find({ active: true });
        sm(txt?.admin_products($products), btn?.admin_products($products));
    } else if (tx === "🛍️Buyurtmalar" && $user?.role === "admin") {
        const r = await orderModel.find({ status: 'reject' }).countDocuments();
        const n = await orderModel.find({ status: 'new' }).countDocuments();
        const s = await orderModel.find({ status: 'success' }).countDocuments();
        const d = await orderModel.find({ status: 'delivered' }).countDocuments();
        sm(txt?.admin_orders(r, n, s, d), btn?.admin_orders(r, n, s, d));
    } else if (tx === "🔎Qidiruv so'rovlari") {
        const $orders = await searchModel.find({ status: 'new' });
        sm(txt?.admin_orders_search_list($orders, 'new'), btn?.admin_orders_search_list($orders));
    } else {
        if ($user?.role === 'admin') {
            if ($user?.step === 'category_title') {
                const id = await categoryModel.find().countDocuments() + 1;
                new categoryModel({
                    title: tx,
                    id
                }).save().then(async () => {
                    $user.set({ step: '' }).save();
                    sm(txt?.admin_success, btn?.admin_main);
                    const $categories = await categoryModel.find({ active: true });
                    sm(txt?.admin_categories($categories), btn?.admin_categories($categories));
                })
            } if ($user?.step === 'category_title_edit') {
                const $c = await categoryModel.findOne({ _id: $user?.etc?.id });
                const $p = await productModel.find({ category: $c?._id }).countDocuments();
                $c.set({ title: tx }).save().then(($s) => {
                    sm(txt?.admin_success, btn?.admin_main);
                    sm(txt?.admin_category($s, $p), btn?.admin_category($s));
                })
            }
            // product ADMIN
            else if ($user?.step === 'product_title') {
                $user.set({ step: 'product_about', etc: { title: tx?.replaceAll('/', '')?.replaceAll('<', '')?.replaceAll('?', '')?.replaceAll('\\', '') } }).save();
                sm(txt?.admin_product_about, btn?.back);
            } else if ($user?.step === 'product_about') {
                $user.set({ step: 'product_price', etc: { ...$user?.etc, about: tx?.replaceAll('/', '')?.replaceAll('<', '')?.replaceAll('?', '')?.replaceAll('\\', '') } }).save();
                sm(txt?.admin_product_price, btn?.back);
            } else if ($user?.step === 'product_price') {
                if (isNaN(tx)) {
                    sm(txt?.admin_product_price, btn?.back);
                } else {
                    $user.set({ step: 'product_category', etc: { ...$user?.etc, price: Number(tx) } }).save();
                    const $categories = await categoryModel.find({ active: true });
                    sm(txt?.admin_product_category, btn?.admin_product_categories($categories));
                }
            } else if ($user?.step === 'product_images') {
                const id = await productModel.find().countDocuments() + 1;
                new productModel({
                    id,
                    ...$user?.etc
                }).save().then(async () => {
                    $user.set({ step: '', etc: {} }).save();
                    sm(txt?.admin_success, btn.admin_main);
                    const $p = await productModel.find({ active: true });
                    sm(txt?.admin_products($p), btn?.admin_products($p))
                })
            } else if ($user?.step === 'edittitle') {
                const $p = await productModel.findOne({ _id: $user?.etc?.id });
                $p.set({ title: tx?.replaceAll('/', '')?.replaceAll('<', '')?.replaceAll('?', '')?.replaceAll('\\', '') }).save();
                sm(txt?.admin_success, btn?.admin);
                // 
                const form = [];
                for (let img of $p.images) {
                    form.push(
                        {
                            type: 'photo',
                            media: {
                                source: fs.readFileSync(`.${img}`),
                            },
                        }
                    )
                }
                form[0].caption = `📦Mahsulot: <b>${$p?.title}</b>\n💰Narxi: <b>${$p?.price?.toLocaleString()}</b> so'm\n📃Batafsil: <i>${$p?.about}</i>`
                form[0].parse_mode = "html";
                await msg.replyWithMediaGroup(form).then(() => {
                    sm("<b>-------------------------------------------------</b>", btn?.admin_product($p)).catch(() => { })
                }).catch(e => console.log(e))
            } else if ($user?.step === 'editprice') {
                if (isNaN(tx)) {
                    sm(txt?.admin_product_price, btn?.back);
                } else {
                    const $p = await productModel.findOne({ _id: $user?.etc?.id });
                    $p.set({ price: tx }).save();
                    sm(txt?.admin_success, btn?.admin);
                    // 
                    const form = [];
                    for (let img of $p.images) {
                        form.push(
                            {
                                type: 'photo',
                                media: {
                                    source: fs.readFileSync(`.${img}`),
                                },
                            }
                        )
                    }
                    form[0].caption = `📦Mahsulot: <b>${$p?.title}</b>\n💰Narxi: <b>${$p?.price?.toLocaleString()}</b> so'm\n📃Batafsil: <i>${$p?.about}</i>`
                    form[0].parse_mode = "html";
                    await msg.replyWithMediaGroup(form).then(() => {
                        sm("<b>-------------------------------------------------</b>", btn?.admin_product($p)).catch(() => { })
                    }).catch(e => console.log(e))
                }
            } else if ($user?.step === 'editabout') {
                const $p = await productModel.findOne({ _id: $user?.etc?.id });
                $p.set({ about: tx?.replaceAll('/', '')?.replaceAll('<', '')?.replaceAll('?', '')?.replaceAll('\\', '') }).save();
                sm(txt?.admin_success, btn?.admin);
                // 
                const form = [];
                for (let img of $p.images) {
                    form.push(
                        {
                            type: 'photo',
                            media: {
                                source: fs.readFileSync(`.${img}`),
                            },
                        }
                    )
                }
                form[0].caption = `📦Mahsulot: <b>${$p?.title}</b>\n💰Narxi: <b>${$p?.price?.toLocaleString()}</b> so'm\n📃Batafsil: <i>${$p?.about}</i>`
                form[0].parse_mode = "html";
                await msg.replyWithMediaGroup(form).then(() => {
                    sm("<b>-------------------------------------------------</b>", btn?.admin_product($p)).catch(() => { })
                }).catch(e => console.log(e))
            }
        } else {
            if ($user?.step === "request_name") {
                $user.set({ step: "request_phone", etc: { ...$user?.etc, name: tx?.replaceAll('<', '')?.replaceAll('>', '')?.replaceAll('/', '')?.replaceAll('\\', '') } }).save();
                sm(txt?.request_phone, btn?.back)
            } else if ($user?.step === "request_phone") {
                let t = tx.replaceAll(' ', '');
                if (isNaN(t)) {
                    sm(txt?.request_phone, btn?.back);
                } else {
                    $user.set({ step: "request_location", etc: { ...$user?.etc, phone: t } }).save();
                    sm(txt?.request_location, btn?.location)
                }
            } else if ($user?.step === "request_count") {

                let t = tx.replaceAll(' ', '');
                if (isNaN(t)) {
                    sm(txt?.request_count, btn?.back);
                } else {
                    $user.set({ step: "request_name", etc: { ...$user?.etc, count: t } }).save();
                    sm(txt?.request_name, btn?.back)
                }
            } else if ($user?.step === "search_name") {
                $user.set({ step: "search_phone", etc: { ...$user?.etc, name: tx?.replaceAll('<', '')?.replaceAll('>', '')?.replaceAll('/', '')?.replaceAll('\\', '') } }).save();
                sm(txt?.request_phone, btn?.back)
            } else if ($user?.step === "search_phone") {
                let t = tx.replaceAll(' ', '');
                if (isNaN(t)) {
                    sm(txt?.request_phone, btn?.back);
                } else {
                    $user.set({ step: "search_location", etc: { ...$user?.etc, phone: t } }).save();
                    sm(txt?.request_location, btn?.location)
                }
            } else if ($user?.step === "search_count") {

                let t = tx.replaceAll(' ', '');
                if (isNaN(t)) {
                    sm(txt?.request_count, btn?.back);
                } else {
                    $user.set({ step: "search_name", etc: { ...$user?.etc, count: t } }).save();
                    sm(txt?.request_name, btn?.back)
                }
            }
        }
    }
});

bot.on('callback_query', async msg => {
    const { id, first_name } = msg.from;
    const { data } = msg?.callbackQuery
    const $user = await userModel.findOne({ telegram: id });
    function sm(text = txt.restart, button = btn.main) {
        msg.deleteMessage().catch(() => { });
        msg.replyWithHTML(text, { ...button });
    }
    if (!$user) {
        new userModel({
            name: first_name?.replaceAll('/', '')?.replaceAll('<', '')?.replaceAll('?', '')?.replaceAll('\\', ''),
            telegram: id,
        }).save();
        sm(txt?.start, btn?.main);
    } else if (data?.includes('admin_') && $user?.role === 'admin') {
        const route = data?.split('_')[1];
        const path = data?.split('_')[2];
        const param = path?.split('--')[1];
        if (path.includes('category')) {
            if (route === 'add') {
                $user.set({ step: 'category_title' }).save();
                sm(txt?.admin_category_title, btn?.back);
            } else if (route === 'show') {
                const $c = await categoryModel.findById(param);
                const $p = await productModel.find({ category: $c?._id }).countDocuments();
                sm(txt?.admin_category($c, $p), btn?.admin_category($c))
            } else if (route === 'edit') {
                $user.set({ step: 'category_title_edit', etc: { id: param } }).save();
                sm(txt?.admin_category_title, btn?.back);
            } else if (route === 'delete') {
                const $c = await categoryModel.findById(param);
                sm(txt?.admin_delete_category($c), btn?.admin_delete_category($c));
            } else if (route === 'confirmdelete') {
                const $c = await categoryModel.findById(param);
                $c.set({ active: false }).save().then(async () => {
                    const $categories = await categoryModel.find({ active: true });
                    sm(txt?.admin_success, btn?.admin_main);
                    sm(txt?.admin_categories($categories), btn?.admin_categories($categories));
                });
            } else if (route === 'select' && $user?.step === 'product_category') {
                $user.set({ step: 'product_images', etc: { ...$user?.etc, category: param, images: [] } }).save();
                sm(txt?.admin_product_images, btn?.back);
            }
        } else if (path?.includes('product')) {
            if (route === 'add') {
                $user.set({ step: 'product_title' }).save();
                sm(txt?.admin_product_title, btn?.back);
            }
            else if (route === 'show') {
                const $p = await productModel.findOne({ _id: param });
                const form = [];
                for (let img of $p.images) {
                    form.push(
                        {
                            type: 'photo',
                            media: {
                                source: fs.readFileSync(`.${img}`),
                            },
                        }
                    )
                }
                form[0].caption = `📦Mahsulot: <b>${$p?.title}</b>\n💰Narxi: <b>${$p?.price?.toLocaleString()}</b> so'm\n📃Batafsil: <i>${$p?.about}</i>`
                form[0].parse_mode = "html";
                await msg.replyWithMediaGroup(form).then(() => {
                    sm("<b>-------------------------------------------------</b>", btn?.admin_product($p))
                }).catch(e => console.log(e))
            } else if (route === "edittitle") {
                $user.set({ step: "edittitle", etc: { id: param } }).save();
                sm(txt?.admin_product_title, btn?.back)
            } else if (route === "editprice") {
                $user.set({ step: "editprice", etc: { id: param } }).save();
                sm(txt?.admin_product_price, btn?.back)
            } else if (route === "editabout") {
                $user.set({ step: "editabout", etc: { id: param } }).save();
                sm(txt?.admin_product_about, btn?.back)
            } else if (route === "delete") {
                $user.set({ step: "delete_product", etc: { id: param } }).save();
                const $p = await productModel.findOne({ _id: param });
                sm(txt?.admin_delete_product($p), btn?.admin_product_delete($p));
            } else if (route === "submitdelete" && $user.step === "delete_product") {
                $user.set({ step: "", etc: {} }).save();
                const $p = await productModel.findOne({ _id: param });
                const $ps = await productModel.find({ active: true });
                $p.set({ active: false }).save();
                sm(txt?.admin_products($ps), btn?.admin_products($ps));
            }
        } else if (route === "orders") {
            if (path === 'new' || path === 'success' || path === 'delivered' || path === 'reject') {
                const o = await orderModel.find({ status: path }).populate('product')
                if (!o[0]) {
                    sm(txt?.admin_no_orders, btn?.admin_main);
                } else {
                    sm(txt?.admin_orders_list(o, path), btn?.admin_orders_list(o))
                }
            } else if (path?.includes('getone')) {
                const $o = await orderModel.findOne({ _id: param }).populate('product')
                msg.replyWithLocation($o?.lat, $o?.long).then(() => {
                    sm(txt?.admin_one_orders($o), btn?.admin_one_orders($o, $o?.status))
                });
            } else if (path?.includes('set')) {
                const status = path?.replace('set', '')?.split('--')[0];
                const $o = await orderModel.findOne({ _id: param });
                $o.set({ status }).save();
                sm(txt?.admin_set_status(status), btn?.admin_main)
            } else if (path?.includes('getsearchone')) {
                const $o = await searchModel.findOne({ _id: param })
                msg.replyWithLocation($o?.lat, $o?.long).then(() => {
                    msg?.replyWithPhoto({source: `.${$o?.image}`},{
                        ...btn?.admin_one_orders_search($o, $o?.status),
                        parse_mode: "HTML",
                        caption: txt?.admin_one_search_orders($o)
                    })
                });
            } else if (path?.includes('stsearch')) {
                const status = path?.replace('stsearch', '')?.split('--')[0];
                const $o = await searchModel.findOne({ _id: param });
                $o.set({ status }).save();
                sm(txt?.admin_set_status(status), btn?.admin_main)
            }
        }
    } else {
        if (data === 'user_getall_products') {
            const products = await productModel.find({ active: true });
            if (!products[0]) {
                sm(txt?.no_product, btn?.main);
            } else {
                sm(txt?.get_all_products(products), btn?.get_all_products(products));
            }
        } else if (data?.includes('user_product_')) {
            const param = data?.split('_')[2];
            const p = await productModel.findOne({ _id: param });
            const form = [];
            for (let img of p.images) {
                form.push(
                    {
                        type: 'photo',
                        media: {
                            source: fs.readFileSync(`.${img}`),
                        },
                    }
                )
            }
            form[0].caption = `📦Mahsulot: <b>${p?.title}</b>\n💰Narxi: <b>${p?.price?.toLocaleString()}</b> so'm\n📃Batafsil: <i>${p?.about}</i>`
            form[0].parse_mode = "html";
            await msg.replyWithMediaGroup(form).then(() => {
                sm("<b>-------------------------------------------------</b>", btn?.product_shop_menu_by_category(p?.category, p?._id))
            }).catch(()=>{
                sm(`📦Mahsulot: <b>${p?.title}</b>\n💰Narxi: <b>${p?.price?.toLocaleString()}</b> so'm\n📃Batafsil: <i>${p?.about}</i>`, btn?.product_shop_menu_by_category(p?.category, p?._id))
            })
        }
        // by_category
        else if (data === "user_getall_categories") {
            const c = await categoryModel.find({ active: true });
            sm(txt?.get_all_categories(c), btn?.get_all_categories(c));
        } else if (data?.includes("user_category_")) {
            const param = data.split('_')[2];
            const c = await categoryModel.findOne({ _id: param });
            const products = await productModel.find({ active: true, category: c?._id });
            if (!products[0]) {
                sm(txt?.no_product, btn?.main);
            } else {
                sm(txt?.get_all_products_by_category(c, products), btn?.get_all_products_by_category(c, products));
            }
        } else if (data?.includes('user_shop_')) {
            const param = data.split('_')[2];
            $user.set({ step: 'request_count', etc: { id: param } }).save();
            sm(txt?.request_count, btn?.back);
        }
    }
});
// 
bot.on('photo', async (msg) => {
    const { id, first_name } = msg.from;
    const $user = await userModel.findOne({ telegram: id });
    const photo = msg.message?.photo.reverse()[0]
    function sm(text = txt.restart, button = btn.main) {
        msg.replyWithHTML(text, { ...button });
    }
    if (!$user) {
        new userModel({
            name: first_name?.replaceAll('/', '')?.replaceAll('<', '')?.replaceAll('?', '')?.replaceAll('\\', ''),
            telegram: id,
        }).save();
        sm(txt?.start, btn?.main);
    } else {
        if ($user.role === 'admin' && $user.step === 'product_images') {
            const url = await bot.telegram.getFileLink(photo?.file_id);
            const filePath = `/uploads/${md5(new Date() + url)}.jpg`
            uploadHelper(url, filePath)
                .then(response => {
                    return new Promise(() => {
                        response.data.pipe(fs.createWriteStream(`.${filePath}`))
                            .on('finish', () => {
                                $user.set({ etc: { ...$user?.etc, images: [...$user?.etc?.images, filePath] } }).save();
                                sm(txt?.admin_image_set, btn?.admin_product_images);
                            })
                            .on('error', e => { console.log(e) })
                    });
                })
        } else if ($user?.step === "search_photo") {
            const url = await bot.telegram.getFileLink(photo?.file_id);
            const filePath = `/uploads/search/${md5(new Date() + url)}.jpg`
            uploadHelper(url, filePath)
                .then(response => {
                    return new Promise(() => {
                        response.data.pipe(fs.createWriteStream(`.${filePath}`))
                            .on('finish', () => {
                                $user.set({ etc: { image: filePath }, step: "search_count" }).save();
                                sm(txt?.request_count, btn?.back);
                            })
                            .on('error', e => { console.log(e) })
                    });
                })
        }
    }
});
// 
bot.on('location', async (msg) => {
    const { latitude: lat, longitude: long } = msg.message.location;
    const { id, first_name } = msg.from;
    const $user = await userModel.findOne({ telegram: id });
    function sm(text = txt.restart, button = btn.main) {
        msg.replyWithHTML(text, { ...button });
    }
    if (!$user) {
        new userModel({
            name: first_name?.replaceAll('/', '')?.replaceAll('<', '')?.replaceAll('?', '')?.replaceAll('\\', ''),
            telegram: id,
        }).save();
        sm(txt?.start, btn?.main);
    } else if ($user?.step === 'request_location') {
        new orderModel({
            product: $user?.etc?.id,
            name: $user?.etc?.name,
            phone: $user?.etc?.phone,
            lat,
            long,
            created: moment.now() / 1000,
            count: $user?.etc?.count
        }).save().then(async () => {
            sm(txt?.success_order, btn?.main);
            $user.set({ step: '', etc: {} }).save();
            const $admins = await userModel.find({ role: 'admin' });
            $admins?.forEach(a => {
                bot.telegram.sendMessage(a?.telegram, "<b>📦Yangi buyurtma olindi!</b>\nIltimos <b>🛍️Buyurtmalar</b> bo'limiga qarang!", {
                    parse_mode: 'HTML',
                    reply_markup: btn?.admin_main
                }).catch(() => { });
            })
        });

    } else if ($user?.step === 'search_location') {
        new searchModel({
            name: $user?.etc?.name,
            phone: $user?.etc?.phone,
            lat,
            long,
            created: moment.now() / 1000,
            count: $user?.etc?.count,
            image: $user?.etc?.image
        }).save().then(async () => {
            sm(txt?.success_order, btn?.main);
            $user.set({ step: '', etc: {} }).save();
            const $admins = await userModel.find({ role: 'admin' });
            $admins?.forEach(a => {
                bot.telegram.sendMessage(a?.telegram, "<b>🔎Yangi qidiruv buyurtma olindi!</b>\nIltimos <b>🔎Qidiruv so'rovlari</b> bo'limiga qarang!", {
                    parse_mode: 'HTML',
                    reply_markup: btn?.admin_main
                }).catch(() => { });
            })
        });

    }
});
module.exports = bot;