/* =========================================================
   SIGNBRIDGE - SISTEMA DE POSTURAS
========================================================= */

const CONFIG_POSTURAS = {
    muestrasPorLetra: 5,
    puntosPorMano: 21,
    almacenamiento: "signbridge_posturas"
};


/* =========================================================
   CARGAR POSTURAS GUARDADAS
========================================================= */

let posturas = cargarPosturas();


function cargarPosturas() {

    try {

        const datos =
            localStorage.getItem(
                CONFIG_POSTURAS.almacenamiento
            );

        if (!datos) {
            return {};
        }

        return JSON.parse(datos);

    } catch (error) {

        console.error(
            "Error cargando posturas:",
            error
        );

        return {};
    }
}


/* =========================================================
   GUARDAR EN LOCALSTORAGE
========================================================= */

function guardarEnAlmacenamiento() {

    try {

        localStorage.setItem(
            CONFIG_POSTURAS.almacenamiento,
            JSON.stringify(posturas)
        );

        console.log(
            "✓ Posturas guardadas permanentemente."
        );

        return true;

    } catch (error) {

        console.error(
            "Error guardando posturas:",
            error
        );

        return false;
    }
}


/* =========================================================
   NORMALIZAR POSTURA
========================================================= */

function normalizarPostura(landmarks) {

    if (
        !Array.isArray(landmarks) ||
        landmarks.length !== 21
    ) {

        return null;
    }


    const muñeca =
        landmarks[0];

    const palma =
        landmarks[9];


    const dx =
        palma.x - muñeca.x;

    const dy =
        palma.y - muñeca.y;

    const dz =
        (palma.z || 0) -
        (muñeca.z || 0);


    let escala =
        Math.sqrt(
            dx * dx +
            dy * dy +
            dz * dz
        );


    if (
        !Number.isFinite(escala) ||
        escala < 0.001
    ) {

        escala = 1;
    }


    return landmarks.map(
        punto => ({

            x:
                (punto.x - muñeca.x) /
                escala,

            y:
                (punto.y - muñeca.y) /
                escala,

            z:
                ((punto.z || 0) -
                    (muñeca.z || 0)) /
                escala

        })
    );
}


/* =========================================================
   GUARDAR POSTURA
========================================================= */

function guardarPostura(
    letra,
    landmarks
) {

    letra =
        String(letra)
            .trim()
            .toUpperCase();


    if (!letra) {

        console.error(
            "Letra inválida."
        );

        return false;
    }


    const postura =
        normalizarPostura(
            landmarks
        );


    if (!postura) {

        console.error(
            "No se pudo normalizar la postura."
        );

        return false;
    }


    if (!posturas[letra]) {

        posturas[letra] = [];
    }


    if (
        posturas[letra].length >=
        CONFIG_POSTURAS.muestrasPorLetra
    ) {

        console.warn(
            `La letra ${letra} ya está completa.`
        );

        return false;
    }


    posturas[letra].push(
        postura
    );


    guardarEnAlmacenamiento();


    console.log(
        `✓ ${letra}: ${posturas[letra].length}/${CONFIG_POSTURAS.muestrasPorLetra}`
    );


    return true;
}


/* =========================================================
   OBTENER POSTURAS
========================================================= */

function obtenerPosturas(letra) {

    letra =
        String(letra)
            .trim()
            .toUpperCase();


    return posturas[letra] || [];
}


/* =========================================================
   COMPROBAR SI ESTÁ COMPLETA
========================================================= */

function posturaCompleta(letra) {

    return (
        obtenerPosturas(letra).length >=
        CONFIG_POSTURAS.muestrasPorLetra
    );
}


/* =========================================================
   OBTENER TODAS LAS LETRAS COMPLETAS
========================================================= */

function obtenerLetrasCompletas() {

    return Object.keys(posturas)
        .filter(
            letra =>
                posturaCompleta(letra)
        );
}


/* =========================================================
   ELIMINAR UNA LETRA
========================================================= */

function eliminarPosturas(letra) {

    letra =
        String(letra)
            .trim()
            .toUpperCase();


    if (!posturas[letra]) {
        return false;
    }


    delete posturas[letra];

    guardarEnAlmacenamiento();


    console.log(
        `✓ Posturas de ${letra} eliminadas.`
    );


    return true;
}


/* =========================================================
   ELIMINAR TODO
========================================================= */

function eliminarTodasLasPosturas() {

    posturas = {};

    localStorage.removeItem(
        CONFIG_POSTURAS.almacenamiento
    );


    console.log(
        "✓ Todas las posturas fueron eliminadas."
    );
}


/* =========================================================
   MOSTRAR INFORMACIÓN
========================================================= */

function mostrarPosturasGuardadas() {

    console.log(
        "========== SIGNBRIDGE =========="
    );


    const letras =
        Object.keys(posturas);


    if (letras.length === 0) {

        console.log(
            "No hay posturas guardadas."
        );

        return;
    }


    letras.forEach(
        letra => {

            console.log(
                `${letra}: ${posturas[letra].length}/${CONFIG_POSTURAS.muestrasPorLetra}`
            );

        }
    );


    console.log(
        "================================"
    );
}


/* =========================================================
   EXPORTAR
========================================================= */

window.posturas =
    posturas;

window.CONFIG_POSTURAS =
    CONFIG_POSTURAS;

window.normalizarPostura =
    normalizarPostura;

window.guardarPostura =
    guardarPostura;

window.obtenerPosturas =
    obtenerPosturas;

window.posturaCompleta =
    posturaCompleta;

window.obtenerLetrasCompletas =
    obtenerLetrasCompletas;

window.eliminarPosturas =
    eliminarPosturas;

window.eliminarTodasLasPosturas =
    eliminarTodasLasPosturas;

window.mostrarPosturasGuardadas =
    mostrarPosturasGuardadas;