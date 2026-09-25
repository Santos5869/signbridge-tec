/* ==========================================
   SIGNBRIDGE - DASHBOARD
   Gestión de sesión y progreso del usuario
========================================== */

"use strict";


/* ==========================================
   CONFIGURACIÓN
========================================== */

const PROGRESO_INICIAL = {
    abecedario: 0,
    numeros: 0,
    saludos: 0,
    reconocimiento: 0,
    colores: 0,
    familia: 0,
    presentaciones: 0,
    presentacionesGeneral: 0,
    datosPersonales: 0,
    conversacionPresentacion: 0,
    practicaPresentaciones: 0
};


/* ==========================================
   OBTENER USUARIO ACTIVO
========================================== */

function obtenerUsuarioActivo() {

    try {

        const datos = localStorage.getItem(
            "usuarioSignbridge"
        );

        if (!datos) {
            return null;
        }

        const usuario = JSON.parse(datos);

        if (!usuario || typeof usuario !== "object") {
            return null;
        }

        return usuario;

    } catch (error) {

        console.error(
            "Error al obtener el usuario activo:",
            error
        );

        return null;
    }
}


/* ==========================================
   COMPROBAR SESIÓN ACTIVA
========================================== */

function existeSesionActiva() {

    const sesionLocal =
        localStorage.getItem(
            "sesionSignbridge"
        ) === "true";

    const sesionTemporal =
        sessionStorage.getItem(
            "sesionSignbridge"
        ) === "true";

    return (
        sesionLocal ||
        sesionTemporal
    );
}


/* ==========================================
   GUARDAR USUARIO ACTIVO
========================================== */

function guardarUsuarioActivo(usuario) {

    localStorage.setItem(
        "usuarioSignbridge",
        JSON.stringify(usuario)
    );
}


/* ==========================================
   OBTENER LISTA GENERAL DE USUARIOS
========================================== */

function obtenerUsuarios() {

    try {

        const datos = localStorage.getItem(
            "usuariosSignbridge"
        );

        if (!datos) {
            return [];
        }

        const usuarios = JSON.parse(datos);

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
   ACTUALIZAR USUARIO REGISTRADO
========================================== */

function actualizarUsuarioRegistrado(usuario) {

    try {

        const usuarios =
            obtenerUsuarios();

        const indice =
            usuarios.findIndex(
                usuarioRegistrado =>
                    String(usuarioRegistrado?.id) ===
                    String(usuario.id)
            );

        if (indice === -1) {
            return;
        }

        usuarios[indice] = usuario;

        localStorage.setItem(
            "usuariosSignbridge",
            JSON.stringify(usuarios)
        );

    } catch (error) {

        console.error(
            "Error al actualizar el usuario:",
            error
        );
    }
}


/* ==========================================
   NORMALIZAR USUARIO Y PROGRESO
========================================== */

function normalizarUsuario(usuario) {

    if (
        !usuario ||
        typeof usuario !== "object"
    ) {
        return null;
    }

    const progresoExistente =
        usuario.progreso &&
        typeof usuario.progreso === "object"
            ? usuario.progreso
            : {};

    usuario.progreso = {
        ...PROGRESO_INICIAL,
        ...progresoExistente
    };

    return usuario;
}


/* ==========================================
   LIMITAR PORCENTAJE
========================================== */

function limitarPorcentaje(valor) {

    return Math.min(
        100,
        Math.max(
            0,
            Number(valor) || 0
        )
    );
}


/* ==========================================
   CALCULAR PROGRESO DE PRESENTACIONES
========================================== */

function calcularProgresoPresentaciones(progreso) {

    const presentacionBasica =
        limitarPorcentaje(
            progreso.presentaciones
        );

    const datosPersonales =
        limitarPorcentaje(
            progreso.datosPersonales
        );

    const conversacionPresentacion =
        limitarPorcentaje(
            progreso.conversacionPresentacion
        );

    const practicaPresentaciones =
        limitarPorcentaje(
            progreso.practicaPresentaciones
        );

    const promedio =
        Math.round(
            (
                presentacionBasica +
                datosPersonales +
                conversacionPresentacion +
                practicaPresentaciones
            ) / 4
        );

    progreso.presentacionesGeneral =
        promedio;

    return {
        presentacionBasica,
        datosPersonales,
        conversacionPresentacion,
        practicaPresentaciones,
        presentaciones: promedio
    };
}


/* ==========================================
   OBTENER PROGRESO DEL USUARIO
========================================== */

function obtenerProgresoUsuario() {

    let usuario =
        obtenerUsuarioActivo();

    if (!usuario) {
        return null;
    }

    usuario =
        normalizarUsuario(usuario);

    const presentaciones =
        calcularProgresoPresentaciones(
            usuario.progreso
        );

    guardarUsuarioActivo(usuario);

    actualizarUsuarioRegistrado(usuario);

    return {

        abecedario:
            limitarPorcentaje(
                usuario.progreso.abecedario
            ),

        numeros:
            limitarPorcentaje(
                usuario.progreso.numeros
            ),

        saludos:
            limitarPorcentaje(
                usuario.progreso.saludos
            ),

        reconocimiento:
            limitarPorcentaje(
                usuario.progreso.reconocimiento
            ),

        colores:
            limitarPorcentaje(
                usuario.progreso.colores
            ),

        familia:
            limitarPorcentaje(
                usuario.progreso.familia
            ),

        presentacionBasica:
            presentaciones.presentacionBasica,

        datosPersonales:
            presentaciones.datosPersonales,

        conversacionPresentacion:
            presentaciones.conversacionPresentacion,

        practicaPresentaciones:
            presentaciones.practicaPresentaciones,

        presentaciones:
            presentaciones.presentaciones
    };
}


/* ==========================================
   ACTUALIZAR ELEMENTO DE PROGRESO
========================================== */

function actualizarElementoProgreso(
    textoId,
    barraId,
    valor,
    retraso = 0
) {

    const texto =
        document.getElementById(
            textoId
        );

    const barra =
        document.getElementById(
            barraId
        );

    if (texto) {
        texto.textContent =
            `${valor}%`;
    }

    if (barra) {

        setTimeout(
            () => {

                barra.style.width =
                    `${valor}%`;

            },
            retraso
        );
    }
}


/* ==========================================
   ACTUALIZAR DASHBOARD
========================================== */

function actualizarProgresoDashboard() {

    const progreso =
        obtenerProgresoUsuario();

    if (!progreso) {
        return;
    }


    /* ======================================
       PROGRESO GENERAL
       7 ÁREAS
    ====================================== */

    const progresoGeneral =
        Math.round(
            (
                progreso.abecedario +
                progreso.numeros +
                progreso.saludos +
                progreso.reconocimiento +
                progreso.colores +
                progreso.familia +
                progreso.presentaciones
            ) / 7
        );


    /* ======================================
       GENERAL
    ====================================== */

    actualizarElementoProgreso(
        "progresoGeneral",
        "barraProgresoGeneral",
        progresoGeneral,
        100
    );


    /* ======================================
       ABECEDARIO
    ====================================== */

    actualizarElementoProgreso(
        "progresoAbecedario",
        "barraAbecedario",
        progreso.abecedario,
        100
    );


    /* ======================================
       NÚMEROS
    ====================================== */

    actualizarElementoProgreso(
        "progresoNumeros",
        "barraNumeros",
        progreso.numeros,
        120
    );


    /* ======================================
       SALUDOS
    ====================================== */

    actualizarElementoProgreso(
        "progresoSaludos",
        "barraSaludos",
        progreso.saludos,
        140
    );


    /* ======================================
       RECONOCIMIENTO
    ====================================== */

    actualizarElementoProgreso(
        "progresoReconocimiento",
        "barraReconocimiento",
        progreso.reconocimiento,
        160
    );


    /* ======================================
       COLORES
    ====================================== */

    actualizarElementoProgreso(
        "progresoColores",
        "barraColores",
        progreso.colores,
        180
    );


    /* ======================================
       FAMILIA
    ====================================== */

    actualizarElementoProgreso(
        "progresoFamilia",
        "barraFamilia",
        progreso.familia,
        200
    );


    /* ======================================
       PRESENTACIONES
    ====================================== */

    actualizarElementoProgreso(
        "progresoPresentaciones",
        "barraPresentaciones",
        progreso.presentaciones,
        220
    );
}


/* ==========================================
   CERRAR SESIÓN
========================================== */

function cerrarSesion() {

    localStorage.removeItem(
        "sesionSignbridge"
    );

    sessionStorage.removeItem(
        "sesionSignbridge"
    );

    localStorage.removeItem(
        "usuarioSignbridge"
    );

    window.location.href =
        "login.html";
}

window.cerrarSesion =
    cerrarSesion;


/* ==========================================
   TRANSICIONES ENTRE PÁGINAS
========================================== */

function configurarTransiciones() {

    const enlaces =
        document.querySelectorAll(
            'a[href$=".html"], button[onclick*="location.href"]'
        );

    enlaces.forEach(
        elemento => {

            elemento.addEventListener(
                "click",
                function (evento) {

                    const onclick =
                        this.getAttribute(
                            "onclick"
                        ) || "";

                    let url = null;


                    /* ==============================
                       ENLACE
                    ============================== */

                    if (
                        this.tagName === "A"
                    ) {

                        url =
                            this.getAttribute(
                                "href"
                            );
                    }


                    /* ==============================
                       BOTÓN
                    ============================== */

                    else {

                        const coincidencia =
                            onclick.match(
                                /["']([^"']+\.html)["']/
                            );

                        if (coincidencia) {
                            url =
                                coincidencia[1];
                        }
                    }


                    /* ==============================
                       IGNORAR
                    ============================== */

                    if (
                        !url ||
                        url === "#" ||
                        url.startsWith("http") ||
                        url.startsWith("mailto:") ||
                        url.startsWith("javascript:")
                    ) {
                        return;
                    }


                    /* ==============================
                       EVITAR DOBLE CLIC
                    ============================== */

                    if (
                        document.body.classList.contains(
                            "page-exiting"
                        )
                    ) {
                        return;
                    }


                    /* ==============================
                       TRANSICIÓN
                    ============================== */

                    evento.preventDefault();

                    document.body.classList.add(
                        "page-exiting"
                    );

                    setTimeout(
                        () => {

                            window.location.href =
                                url;

                        },
                        300
                    );
                }
            );
        }
    );
}


/* ==========================================
   INICIAR DASHBOARD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const usuario =
            obtenerUsuarioActivo();

        if (
            !usuario ||
            !existeSesionActiva()
        ) {

            window.location.href =
                "login.html";

            return;
        }

        actualizarProgresoDashboard();

        configurarTransiciones();

        setTimeout(
            () => {

                document.body.classList.add(
                    "page-ready"
                );

            },
            50
        );
    }
);