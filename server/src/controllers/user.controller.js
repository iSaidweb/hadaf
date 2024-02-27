const bot = require("../bot/bot");
const cartModel = require("../models/cart.model");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const moment = require('moment');
const webOrderModel = require("../models/webOrder.model");
const userModel = require("../models/user.model");
module.exports = {
    getHome: async (req, res) => {
        const $c = await categoryModel.find({ active: true });
        const $p = await productModel.find({ active: true });
        const categories = [];
        const products = [];
        $c?.forEach(c => {
            categories.unshift({
                _id: c?._id,
                title: c?.title
            });
        });
        $p?.forEach(p => {
            products.unshift({
                _id: p?._id,
                title: p?.title,
                price: p?.price,
                about: p?.about,
                images: p?.images,
                category: p?.category
            });
        });
        res.send({
            ok: true,
            products,
            categories,
        })
    },
    createOrder: async (req, res) => {
        const { products, name, phone, id } = req?.body;
        if (!name || !phone) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            new cartModel({
                name,
                phone,
                created: moment.now() / 1000
            }).save().then(async ($data) => {
                products?.forEach((p) => {
                    new webOrderModel({
                        product: p?._id,
                        count: p?.count,
                        name,
                        phone,
                        cart: $data?._id
                    }).save();
                });
            }).then(async () => {
                res.send({
                    ok: true,
                    msg: "OK"
                });
                const $admins = await userModel.find({ role: 'admin' });
                $admins?.forEach(a => {
                    bot.telegram.sendMessage(a?.telegram, "📨Yangi buyurtma, Buyurtmani veb admin panel orqali ko'rishingiz mumkin!").catch(() => { });
                });
                let txt = "📑Buyurtma ro'yhati\n\n";
                products?.forEach((p, i) => {
                    txt += `${i + 1} ) - <b>${p?.title} ${p?.count}</b> ta = <b>${Number(p?.count * p?.price)?.toLocaleString()}</b> so'm\n`
                });
                bot.telegram.sendMessage(id, txt, { parse_mode: "HTML" }).catch(() => { });
            })
        }
    }
}