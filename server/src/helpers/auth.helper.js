const jwt = require('jsonwebtoken');
const { ACCESS } = require('./env.helper');
const adminModel = require('../models/admin.model');
module.exports = {
    admin: async (req, res, next) => {
        const token = req?.headers['x-auth-token'];
        if (!token || !token?.startsWith('Bearer ')) {
            res.send({
                ok: false,
                msg: "Auth error"
            });
        } else {
            const signature = token?.replace('Bearer ', '');
            try {
                jwt.verify(signature, ACCESS, async (err, data) => {
                    if (err) {
                        res.send({
                            ok: false,
                            msg: "Auth error"
                        });
                    } else {
                        const { _id } = data;
                        if (!_id || !_id[23]) {
                            res.send({
                                ok: false,
                                msg: "Auth error"
                            });
                        } else {
                            const $admin = await adminModel.findOne({ _id });
                            if (!$admin) {
                                res.send({
                                    ok: false,
                                    msg: "Auth error"
                                });
                            } else if ($admin?.access !== signature) {
                                res.send({
                                    ok: false,
                                    msg: "Auth error"
                                });
                            } else {
                                req.admin = {
                                    _id: $admin?._id,
                                    name: $admin?.name,
                                    phone: $admin?.phone,
                                    role: $admin?.role
                                },
                                    next();
                            }
                        }
                    }
                })
            } catch (error) {
                console.log(error);
                res.send({
                    ok: false,
                    msg: "SERVER ERROR"
                })
            }
        }
    },
    creator: (req, res, next) => {
        if (req?.admin?.role !== 'creator') {
            res.send({
                ok: false,
                msg: "Sizda ushbu aal uchun huquq mavjud emas!"
            });
        } else {
            next();
        }
    }
}