const User = require('../models/users.model.js');
const utilities = require('../utilities/utilities')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, msg: "Invalid email" });
        }

        const check = bcrypt.compareSync(req.body.password, user.password);

        if (!check) {
            return res.status(401).json({
                success: false,
                accessToken: null,
                msg: "Password is incorrect"
            })
        }

        const token = utilities.generateToken({ id: user._id, type: user.type })

        return res.status(200).json({
            success: true,
            accessToken: token,
            id: user._id,
            type: user.type,
        })
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach((key) => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msgs: errors });
        }
        else
            res.status(500).json({ success: false, msg: err.message || "An error occurred while logging in." });
    }
}

exports.register = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        createdUser: new Date()
    });

    try {
        await user.save();
        res.status(201).json({ success: true, msg: "Novo Utilizador criado com sucesso.", URL: `/user/${user._id}` })
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach((key) => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msgs: errors });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Ocorreu algum erro ao criar o utilizador."
            });
        }
    }
}

exports.getAll = async (req, res) => {
    try {
        let data = await User
            .find()
            .select('name image type')
            .exec();
        res.status(200).json({ success: true, user: data });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msg: err.message || "Ocorreu algum erro ao recuperar os utilizadores." })
        }
    }
}

exports.findUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userID).exec();

        if (user === null) {
            res.status(404).json({ success: false, msg: `Não foi possível encontrar nenhum utilizador com o ID ${req.params.userID}` })
        }

        res.json({ success: true, user: user })
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msg: `Erro ao recuperar o utilizador com ID ${req.params.userID}.` })
        }
    }
}

exports.update = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userID, req.body).exec();

        if (!user) {
            return res.status(404).json({ success: false, msg: `Não é possível atualizar o utilizador com id=${req.params.userID}. Verifica se utilizador existe!` });
        }
        res.status(200).json({ success: true, msg: `Utilizador id=${req.params.userID} foi atualizado com sucesso!` });
    } catch (err) {
        if (err.name === "ValidationError") {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key].message);
            });
            return res.status(400).json({ success: false, msg: `Erro ao alterar o utilizador com ID ${req.params.userID}.` })
        }
    }
}
