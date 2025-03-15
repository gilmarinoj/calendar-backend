const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email: email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            })
        }

        usuario = new Usuario(req.body);

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JSONWebToken
        const token = await generateJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const loginUser = async (req, res = response) => {

    const { email, password } = req.body

    try {
        let usuario = await Usuario.findOne({ email: email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales Invalidas'
            })
        }

        // Confirmar los passwords

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales invalidas'
            })
        }

        // Generar JSONWebToken
        const token = await generateJWT(usuario.id, usuario.name);

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const renewToken = async(req, res = response) => {

    const { uid, name } = req

    // Generar JSONWebToken
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}