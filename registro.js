/* ==========================================
   SIGNBRIDGE - REGISTRO
   Sistema de creación de cuentas
========================================== */

"use strict";


/* ==========================================
   ELEMENTOS DEL FORMULARIO
========================================== */

const registroForm =
    document.getElementById("registroForm");

const nombreInput =
    document.getElementById("nombre");

const correoInput =
    document.getElementById("correo");

const contrasenaInput =
    document.getElementById("contrasena");

const confirmarInput =
    document.getElementById("confirmarContrasena");

const nombreError =
    document.getElementById("nombreError");

const correoError =
    document.getElementById("correoError");

const contrasenaError =
    document.getElementById("contrasenaError");

const confirmarError =
    document.getElementById("confirmarError");

const formMessage =
    document.getElementById("formMessage");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


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
   GENERAR HASH DE CONTRASEÑA
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
            "Error al obtener usuarios:",
            error
        );

        return [];
    }
}


/* ==========================================
   GUARDAR USUARIOS
========================================== */

function guardarUsuarios(usuarios) {

    try {

        localStorage.setItem(
            "usuariosSignbridge",
            JSON.stringify(usuarios)
        );

        return true;

    } catch (error) {

        console.error(
            "Error al guardar usuarios:",
            error
        );

        return false;
    }
}


/* ==========================================
   LIMPIAR ERRORES
========================================== */

function limpiarErrores() {

    nombreError.textContent = "";
    correoError.textContent = "";
    contrasenaError.textContent = "";
    confirmarError.textContent = "";
    formMessage.textContent = "";

    formMessage.className =
        "message";

    nombreInput.classList.remove(
        "input-error"
    );

    correoInput.classList.remove(
        "input-error"
    );

    contrasenaInput.classList.remove(
        "input-error"
    );

    confirmarInput.classList.remove(
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
   MOSTRAR / OCULTAR CONFIRMACIÓN
========================================== */

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener(
        "click",
        () => {

            if (
                confirmarInput.type ===
                "password"
            ) {

                confirmarInput.type =
                    "text";

                toggleConfirmPassword.textContent =
                    "Ocultar";

            } else {

                confirmarInput.type =
                    "password";

                toggleConfirmPassword.textContent =
                    "Mostrar";
            }
        }
    );
}


/* ==========================================
   REGISTRO
========================================== */

if (registroForm) {

    registroForm.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            limpiarErrores();


            /* ======================================
               OBTENER DATOS
            ====================================== */

            const nombre =
                nombreInput.value.trim();

            const correo =
                correoInput.value
                    .trim()
                    .toLowerCase();

            const contrasena =
                contrasenaInput.value;

            const confirmarContrasena =
                confirmarInput.value;


            let hayError = false;


            /* ======================================
               VALIDAR NOMBRE
            ====================================== */

            if (!nombre) {

                mostrarError(
                    nombreError,
                    nombreInput,
                    "Ingresa tu nombre completo."
                );

                hayError = true;

            } else if (
                nombre.length < 3
            ) {

                mostrarError(
                    nombreError,
                    nombreInput,
                    "El nombre debe tener al menos 3 caracteres."
                );

                hayError = true;
            }


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
                    "Ingresa una contraseña."
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


            /* ======================================
               CONFIRMAR CONTRASEÑA
            ====================================== */

            if (!confirmarContrasena) {

                mostrarError(
                    confirmarError,
                    confirmarInput,
                    "Confirma tu contraseña."
                );

                hayError = true;

            } else if (
                contrasena !==
                confirmarContrasena
            ) {

                mostrarError(
                    confirmarError,
                    confirmarInput,
                    "Las contraseñas no coinciden."
                );

                hayError = true;
            }


            /* ======================================
               DETENER SI HAY ERRORES
            ====================================== */

            if (hayError) {
                return;
            }


            /* ======================================
               OBTENER USUARIOS EXISTENTES
            ====================================== */

            const usuarios =
                obtenerUsuarios();


            /* ======================================
               COMPROBAR CORREO
            ====================================== */

            const usuarioExistente =
                usuarios.find(
                    usuario =>
                        String(
                            usuario?.correo || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        correo
                );


            if (usuarioExistente) {

                mostrarError(
                    correoError,
                    correoInput,
                    "Este correo ya está registrado."
                );

                formMessage.textContent =
                    "Ya existe una cuenta con este correo.";

                formMessage.className =
                    "message error";

                return;
            }


            /* ======================================
               GENERAR CONTRASEÑA
            ====================================== */

            let passwordHash;

            try {

                passwordHash =
                    await generarHash(
                        contrasena
                    );

            } catch (error) {

                console.error(
                    "Error al crear contraseña:",
                    error
                );

                formMessage.textContent =
                    "No se pudo crear la cuenta. Inténtalo nuevamente.";

                formMessage.className =
                    "message error";

                return;
            }


            /* ======================================
               CREAR USUARIO
            ====================================== */

            const nuevoUsuario = {

                id:
                    Date.now(),

                nombre:
                    nombre,

                correo:
                    correo,

                password:
                    passwordHash,


                /* DATOS */
                xp: 0,
                coins: 0,
                vidas: 5,
                racha: 1,
                nivel: 1,


                /* PROGRESO */
                progreso: {
                    ...PROGRESO_INICIAL
                }
            };


            /* ======================================
               GUARDAR
            ====================================== */

            usuarios.push(
                nuevoUsuario
            );

            const guardado =
                guardarUsuarios(
                    usuarios
                );


            if (!guardado) {

                formMessage.textContent =
                    "No se pudo guardar la cuenta.";

                formMessage.className =
                    "message error";

                return;
            }


            /* ======================================
               LIMPIAR SESIÓN ANTERIOR
            ====================================== */

            localStorage.removeItem(
                "sesionSignbridge"
            );

            sessionStorage.removeItem(
                "sesionSignbridge"
            );

            localStorage.removeItem(
                "usuarioSignbridge"
            );


            /* ======================================
               GUARDAR CORREO
               Para que aparezca al volver al login
            ====================================== */

            localStorage.setItem(
                "correoSignbridgeRecordado",
                correo
            );


            /* ======================================
               MENSAJE
            ====================================== */

            formMessage.textContent =
                "¡Cuenta creada correctamente!";

            formMessage.className =
                "message success";


            /* ======================================
               IR AL LOGIN
            ====================================== */

            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1000
            );
        }
    );
}