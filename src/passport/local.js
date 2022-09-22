import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import  Usuario  from "../models/usuarios.js";

const localStrategy = LocalStrategy

passport.use('registro', new localStrategy({
    usernameField: 'nombre',
    passwordField: 'password',
    passReqToCallback: true 
    }, async (req, nombre, password, done) => { 
        const usuarioDB = await Usuario.findOne({ nombre });
        if (usuarioDB) {
            return done(null, false, { message: 'El usuario ya existe' });
        }
        const nuevoUsuario = new Usuario();
        nuevoUsuario.nombre = nombre;
        nuevoUsuario.contrasenia = password;
        await nuevoUsuario.save();
        return done(null, nuevoUsuario);
    }
));

passport.use('login', new localStrategy({
    usernameField: 'nombre',
    passwordField: 'password',
    passReqToCallback: true
    }, async (req, nombre, password, done) => { 
        const usuarioDB = await Usuario.findOne({ nombre });
        if (!usuarioDB) {
            return done(null, false, { message: 'El usuario no existe' });
        }
        if (usuarioDB.contrasenia !== password) {
            return done(null, false, { message: 'El password es incorrecto' });
        }
        return done(null, usuarioDB);
    }
));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    const usuario = await Usuario.findById(id);
    done(null, usuario);
});