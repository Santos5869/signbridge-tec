/* ==========================================
   SIGNBRIDGE - LOGIN
   Sistema completo de inicio de sesión
========================================== */

"use strict";


/* ==========================================
   ELEMENTOS
========================================== */

const loginForm =
    document.getElementById("loginForm");

const correoInput =
    document.getElementById("correo");

const contrasenaInput =
    document.getElementById("contrasena");

const correoError =
    document.getElementById("correoError");

const contrasenaError =
    document.getElementById("contrasenaError");

const formMessage =
    document.getElementById("formMessage");

const togglePassword =
    document.getElementById("togglePassword");

const recordarme =
    document.getElementById("recordarme");


/* ==========================================
   PROGRESO INICIAL
========================================== */

const PROGRESO_INICIAL = {

    abecedario: 0,
    numeros: 0,
    saludos: 0,
    reconocimiento: 0,
    colores: 0,
    familia: 0,

    presentaciones: 0,
    datosPersonales: 0,
    conversacionPresentacion: 0,
    practicaPresentaciones: 0,

    presentacionesGeneral: 0
};


/* ==========================================
   HASH
========================================== */

async function generarHash(texto) {

    const datos =
        new TextEncoder().encode(texto);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            datos
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    return hashArray
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


/* ==========================================
   OBTENER USUARIOS
========================================== */

function obtenerUsuarios() {

    try {

        const datos =
            localStorage.getItem(
                "usuariosSignbridge"
            );

        if (!datos) {
            return [];
        }

        const usuarios =
            JSON.parse(datos);

        return Array.isArray(usuarios)
            ? usuarios
            : [];

    } catch (error) {

        console.error(
            "Error al leer usuarios:",
            error
        );

        return [];
    }
}


/* ==========================================
   GUARDAR USUARIOS
========================================== */

function guardarUsuarios(
    usuarios
) {

    localStorage.setItem(
        "usuariosSignbridge",
        JSON.stringify(usuarios)
    );
}


/* ==========================================
   NORMALIZAR USUARIO
========================================== */

function normalizarUsuario(
    usuario
) {

    if (
        !usuario ||
        typeof usuario !== "object"
    ) {
        return null;
    }

    const progreso =
        usuario.progreso &&
        typeof usuario.progreso ===
            "object"
            ? usuario.progreso
            : {};

    return {

        ...usuario,

        correo:
            String(
                usuario.correo || ""
            )
                .trim()
                .toLowerCase(),

        progreso: {

            ...PROGRESO_INICIAL,

            ...progreso
        }
    };
}


/* ==========================================
   GUARDAR USUARIO ACTIVO
========================================== */

function guardarUsuarioActivo(
    usuario
) {

    const usuarioCompleto =
        normalizarUsuario(
            usuario
        );

    localStorage.setItem(
        "usuarioSignbridge",
        JSON.stringify(
            usuarioCompleto
        )
    );

    return usuarioCompleto;
}


/* ==========================================
   ACTUALIZAR USUARIO EN LA LISTA
========================================== */

function actualizarUsuarioRegistrado(
    usuario
) {

    const usuarios =
        obtenerUsuarios();

    const indice =
        usuarios.findIndex(
            usuarioGuardado =>
                String(
                    usuarioGuardado?.id
                ) ===
                String(usuario.id)
        );

    if (indice === -1) {
        return;
    }

    usuarios[indice] =
        normalizarUsuario(
            usuario
        );

    guardarUsuarios(
        usuarios
    );
}


/* ==========================================
   LIMPIAR ERRORES
========================================== */

function limpiarErrores() {

    correoError.textContent = "";

    contrasenaError.textContent = "";

    formMessage.textContent = "";

    formMessage.className =
        "form-message";

    correoInput.classList.remove(
        "input-error"
    );

    contrasenaInput.classList.remove(
        "input-error"
    );
}


/* ==========================================
   MOSTRAR ERROR
========================================== */

function mostrarError(
    elemento,
    input,
    mensaje
) {

    elemento.textContent =
        mensaje;

    input.classList.add(
        "input-error"
    );
}


/* ==========================================
   MOSTRAR / OCULTAR CONTRASEÑA
========================================== */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (
                contrasenaInput.type ===
                "password"
            ) {

                contrasenaInput.type =
                    "text";

                togglePassword.textContent =
                    "Ocultar";

            } else {

                contrasenaInput.type =
                    "password";

                togglePassword.textContent =
                    "Mostrar";
            }
        }
    );
}


/* ==========================================
   RECUPERAR CORREO
========================================== */

function cargarCorreoGuardado() {

    const correoGuardado =
        localStorage.getItem(
            "correoSignbridgeRecordado"
        );

    if (
        correoGuardado &&
        correoInput
    ) {

        correoInput.value =
            correoGuardado;
    }
}


/* ==========================================
   GUARDAR CORREO MIENTRAS SE ESCRIBE
========================================== */

if (correoInput) {

    correoInput.addEventListener(
        "input",
        () => {

            const correo =
                correoInput.value
                    .trim()
                    .toLowerCase();

            if (correo) {

                localStorage.setItem(
                    "correoSignbridgeRecordado",
                    correo
                );
            }
        }
    );
}


/* ==========================================
   COMPROBAR SESIÓN RECORDADA
========================================== */

function comprobarSesionRecordada() {

    const sesion =
        localStorage.getItem(
            "sesionSignbridge"
        );

    const usuarioActivo =
        localStorage.getItem(
            "usuarioSignbridge"
        );


    if (
        sesion === "true" &&
        usuarioActivo
    ) {

        try {

            const usuario =
                JSON.parse(
                    usuarioActivo
                );

            if (
                usuario &&
                usuario.id &&
                usuario.correo
            ) {

                window.location.href =
                    "dashboard.html";

                return true;
            }

        } catch (error) {

            console.error(
                "Sesión inválida:",
                error
            );

            localStorage.removeItem(
                "sesionSignbridge"
            );

            localStorage.removeItem(
                "usuarioSignbridge"
            );
        }
    }

    return false;
}


/* ==========================================
   CARGAR LOGIN
========================================== */

cargarCorreoGuardado();

comprobarSesionRecordada();


/* ==========================================
   LOGIN
========================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            limpiarErrores();


            /* ======================================
               DATOS
            ====================================== */

            const correo =
                correoInput.value
                    .trim()
                    .toLowerCase();

            const contrasena =
                contrasenaInput.value;


            let hayError =
                false;


            /* ======================================
               VALIDAR CORREO
            ====================================== */

            if (!correo) {

                mostrarError(
                    correoError,
                    correoInput,
                    "Ingresa tu correo electrónico."
                );

                hayError = true;

            } else if (
                !correoInput.validity.valid
            ) {

                mostrarError(
                    correoError,
                    correoInput,
                    "Ingresa un correo electrónico válido."
                );

                hayError = true;
            }


            /* ======================================
               VALIDAR CONTRASEÑA
            ====================================== */

            if (!contrasena) {

                mostrarError(
                    contrasenaError,
                    contrasenaInput,
                    "Ingresa tu contraseña."
                );

                hayError = true;

            } else if (
                contrasena.length < 6
            ) {

                mostrarError(
                    contrasenaError,
                    contrasenaInput,
                    "La contraseña debe tener al menos 6 caracteres."
                );

                hayError = true;
            }


            if (hayError) {
                return;
            }


            /* ======================================
               GUARDAR CORREO
               Siempre se conserva el correo.
            ====================================== */

            localStorage.setItem(
                "correoSignbridgeRecordado",
                correo
            );


            /* ======================================
               BUSCAR USUARIO
            ====================================== */

            const usuarios =
                obtenerUsuarios();

            const usuarioEncontrado =
                usuarios.find(
                    usuario =>
                        String(
                            usuario?.correo || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        correo
                );


            if (
                !usuarioEncontrado
            ) {

                formMessage.textContent =
                    "El correo electrónico no está registrado.";

                formMessage.className =
                    "form-message error";

                return;
            }


            /* ======================================
               COMPROBAR CONTRASEÑA
            ====================================== */

            if (
                !usuarioEncontrado.password
            ) {

                formMessage.textContent =
                    "Esta cuenta no tiene una contraseña válida.";

                formMessage.className =
                    "form-message error";

                return;
            }


            try {

                const hashIngresado =
                    await generarHash(
                        contrasena
                    );


                if (
                    hashIngresado !==
                    usuarioEncontrado.password
                ) {

                    formMessage.textContent =
                        "La contraseña es incorrecta.";

                    formMessage.className =
                        "form-message error";

                    return;
                }

            } catch (error) {

                console.error(
                    "Error al comprobar contraseña:",
                    error
                );

                formMessage.textContent =
                    "No se pudo comprobar la contraseña.";

                formMessage.className =
                    "form-message error";

                return;
            }


            /* ======================================
               USUARIO COMPLETO
            ====================================== */

            const usuario =
                normalizarUsuario(
                    usuarioEncontrado
                );


            /* ======================================
               GUARDAR USUARIO ACTIVO
            ====================================== */

            guardarUsuarioActivo(
                usuario
            );


            /* ======================================
               ACTUALIZAR USUARIO
            ====================================== */

            actualizarUsuarioRegistrado(
                usuario
            );


            /* ======================================
               RECORDAR SESIÓN
            ====================================== */

            if (
                recordarme &&
                recordarme.checked
            ) {

                /*
                   Se mantiene incluso después
                   de cerrar el navegador.
                */

                localStorage.setItem(
                    "sesionSignbridge",
                    "true"
                );

                sessionStorage.removeItem(
                    "sesionSignbridge"
                );

            } else {

                /*
                   Solo dura mientras la sesión
                   del navegador esté abierta.
                */

                sessionStorage.setItem(
                    "sesionSignbridge",
                    "true"
                );

                localStorage.removeItem(
                    "sesionSignbridge"
                );
            }


            /* ======================================
               MENSAJE
            ====================================== */

            formMessage.textContent =
                "¡Inicio de sesión exitoso!";

            formMessage.className =
                "form-message success";


            /* ======================================
               DASHBOARD
            ====================================== */

            setTimeout(
                () => {

                    window.location.href =
                        "dashboard.html";

                },
                700
            );
        }
    );
}