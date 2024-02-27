const md5 = require("md5");
const adminModel = require("../models/admin.model")
const jwt = require('jsonwebtoken');
const { ACCESS } = require("../helpers/env.helper");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const fs = require("fs");
const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");
const webOrderModel = require("../models/webOrder.model");
const moment = require("moment");
module.exports = {
    defaultAdmin: async () => {
        const $admin = await adminModel.findOne({ phone: "+998931042255" });
        if (!$admin) {
            new adminModel({
                name: "Saidislom",
                phone: "+998931042255",
                password: md5("555555")
            }).save();
        }
    },
    signIn: async (req, res) => {
        const { phone, password } = req?.body;
        if (!password || !phone) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            const $admin = await adminModel.findOne({ phone, password: md5(password) });
            if (!$admin) {
                res.send({
                    ok: false,
                    msg: "Ma'lumot topilmadi!"
                });
            } else {
                const access = jwt.sign({ _id: $admin?._id }, ACCESS, { expiresIn: '7d' });
                $admin.set({ access }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Bajarildi!",
                        access,
                        data: {
                            _id: $admin?._id,
                            name: $admin?.name,
                            phone: $admin?.phone,
                            role: $admin?.role
                        }
                    });
                });
            }
        }
    },
    verifyAuth: (req, res) => {
        res.send({
            ok: true,
            data: req?.admin
        });
    },
    // CATEGORIES
    getAllCategories: async (req, res) => {
        const $c = await categoryModel.find({ active: true });
        const data = [];
        $c?.forEach((c) => {
            data.unshift({
                title: c?.title,
                id: c?.id,
                _id: c?._id
            });
        });
        res.send({
            ok: true,
            data
        })
    },
    createCategory: async (req, res) => {
        const { title } = req?.body;
        if (!title) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            const id = await categoryModel.find().countDocuments() + 1;
            new categoryModel({
                title,
                id
            }).save().then(() => {
                res.send({
                    ok: true,
                    msg: "Saqlandi!"
                });
            })
        }
    },
    editCategory: async (req, res) => {
        const { title, _id } = req?.body;
        if (!title) {
            res.send({
                ok: true,
                msg: "Qatorlarni to'ldiring!"
            })
        } else {
            try {
                const $c = await categoryModel.findOne({ _id });
                if (!$c) {
                    res.send({
                        ok: false,
                        msg: "Xatolik!"
                    })
                } else {
                    $c.set({ title }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Saqlandi!"
                        });
                    })
                }
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            }
        }
    },
    deleteCategory: async (req, res) => {
        const { _id } = req?.body;
        try {
            const $c = await categoryModel.findOne({ _id });
            if (!$c) {
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                })
            } else {
                $c.set({ active: false }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    });
                })
            }
        } catch (error) {
            console.log(error);
            res.send({
                ok: false,
                msg: "Xatolik!"
            })
        }
    },
    // PRODUCTS
    getAllProducts: async (req, res) => {
        const $p = await productModel.find({ active: true });
        const data = [];
        const $c = await categoryModel.find({ active: true });
        const categories = [];
        $c?.forEach((c) => {
            categories.unshift({
                title: c?.title,
                _id: c?._id
            });
        });
        $p?.forEach((p) => {
            data.unshift({
                _id: p?._id,
                id: p?.id,
                title: p?.title,
                price: p?.price,
                about: p?.about,
                images: p?.images,
                category: p?.category
            });
        });
        res.send({
            ok: true,
            data,
            categories
        });
    },
    createProduct: async (req, res) => {
        const { title, about, category, price } = req?.body;
        const images = req?.files?.['images[]'][0] ? req?.files?.['images[]'] : [req?.files?.['images[]']];
        if (!title || !about || !category || !price || !images) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            try {
                const id = await productModel.find().countDocuments() + 1;
                const imgs = [];
                images?.forEach((img) => {
                    const filePath = `/uploads/${md5(new Date() + img?.name)}.png`;
                    img?.mv(`.${filePath}`);
                    imgs.push(filePath);
                });
                new productModel({
                    id, title, about, category, price, images: imgs
                }).save().then(() => {
                    res.send({
                        ok: true,
                        msg: "Saqlandi!"
                    });
                });
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "Xatolik!"
                });
            }
        }
    },
    deleteProduct: async (req, res) => {
        const { _id } = req?.body;
        if (!_id || !_id[23]) {
            res.send({
                ok: false,
                msg: "Xatolik!"
            });
        } else {
            const $p = await productModel.findOne({ _id });
            if (!$p) {
                res.send({
                    ok: false,
                    msg: "Mahsulot topilmadi!"
                });
            } else {
                try {
                    $p?.images?.slice(1,)?.forEach((img) => {
                        fs.unlink(`.${img}`, () => { });
                    });
                    $p.set({ active: false }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Bajarildi!"
                        });
                    });
                } catch (error) {
                    console.log(error);
                    res.send({
                        ok: false,
                        msg: "Xatolik!"
                    })
                }
            }
        }
    },
    editProduct: async (req, res) => {
        const { _id,
            title,
            price,
            about,
            category, } = req?.body;
        if (!_id || !_id[23]) {
            res.send({
                ok: false,
                msg: "Xatolik!"
            });
        } else if (!title || !price || !about || !category) {
            res.send({
                ok: false,
                msg: "Qatorlarni to'ldiring!"
            });
        } else {
            const $p = await productModel.findOne({ _id });
            if (!$p) {
                res.send({
                    ok: false,
                    msg: "Mahsulot topilmadi!"
                });
            } else {
                try {
                    $p.set({ title, about, price, category }).save().then(() => {
                        res.send({
                            ok: true,
                            msg: "Bajarildi!"
                        });
                    });
                } catch (error) {
                    console.log(error);
                    res.send({
                        ok: false,
                        msg: "Xatolik!"
                    })
                }
            }
        }
    },
    // 
    getNewOrders: async (req, res) => {
        const $c = await cartModel.find({ status: 'new' });
        const $o = await orderModel.find({ status: 'new' }).populate('product')
        // 
        const carts = [];
        const orders = [];
        // 
        for (let c of $c) {
            let ords = [];
            const $wo = await webOrderModel.find({ cart: c?._id, status: 'new' })?.populate('product');
            $wo?.forEach((o) => {
                ords?.push({
                    _id: o?._id,
                    title: o?.product?.title,
                    image: o?.images?.[0],
                    price: o?.product?.price,
                    count: o?.count
                });
            })
            carts?.push({
                _id: c?._id,
                name: c?.name,
                phone: c?.phone,
                created: moment.unix(c?.created).format('DD.MM.YYYY | HH:mm'),
                orders: ords
            });
        };
        $o?.forEach((o) => {
            orders?.push({
                _id: o?._id,
                name: o?.name,
                phone: o?.phone,
                product: {
                    title: o?.product?.title,
                    price: o?.product?.price,
                    image: o?.images?.[0],
                },
                created: moment.unix(o?.created)?.unix('DD.MM.YYYY | HH:mm')
            });
        })
        res.send({
            ok: true,
            carts,
            orders
        });
    }
}