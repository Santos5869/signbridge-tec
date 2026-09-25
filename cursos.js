"use strict";

/* ==========================================
   SIGNBRIDGE - NAVEGACIÓN DE CURSOS
   TRANSICIONES SUAVES
========================================== */


/* ==========================================
   INICIO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /*
       Esperamos un momento mínimo para que
       la entrada visual pueda apreciarse.
    */

    requestAnimationFrame(() => {
        document.body.classList.add("page-ready");
    });


    prepararTeclado();

});


/* ==========================================
   ABRIR CATEGORÍA
========================================== */

function abrirCategoria(categoria) {

    let destino = null;


    switch (categoria) {

        case "numeros":
            destino = "numeros-cursos.html";
            break;

        case "abecedario":
            destino = "abecedario-cursos.html";
            break;

        case "saludos":
            destino = "saludos-cursos.html";
            break;

        case "colores":
            destino = "colores-cursos.html";
            break;

        case "presentaciones":
            destino = "presentaciones-cursos.html";
            break;

        case "familia":
            destino = "familia-cursos.html";
            break;

        default:
            console.warn(
                "Categoría no encontrada:",
                categoria
            );

            return;
    }


    navegarSuave(destino);
}


/* ==========================================
   VOLVER AL DASHBOARD
========================================== */

function volverDashboard() {

    navegarSuave(
        "dashboard.html"
    );
}


/* ==========================================
   NAVEGACIÓN SUAVE
========================================== */

function navegarSuave(destino) {

    /*
       Evitamos ejecutar la transición
       varias veces.
    */

    if (
        document.body.classList.contains(
            "page-exiting"
        )
    ) {
        return;
    }


    document.body.classList.remove(
        "page-ready"
    );

    document.body.classList.add(
        "page-exiting"
    );


    /*
       Dejamos que la animación de salida
       termine antes de cambiar de página.
    */

    setTimeout(() => {

        window.location.href =
            destino;

    }, 420);

}


/* ==========================================
   TECLADO
========================================== */

function prepararTeclado() {

    const tarjetas =
        document.querySelectorAll(
            ".category-card:not(.locked)"
        );


    tarjetas.forEach((tarjeta) => {

        tarjeta.addEventListener(
            "keydown",
            (evento) => {

                if (
                    evento.key === "Enter" ||
                    evento.key === " "
                ) {

                    evento.preventDefault();

                    tarjeta.click();

                }

            }
        );

    });

}


/* ==========================================
   EVITAR TRANSICIÓN INCORRECTA
========================================== */

window.addEventListener(
    "pageshow",
    () => {

        document.body.classList.remove(
            "page-exiting"
        );

        requestAnimationFrame(() => {

            document.body.classList.add(
                "page-ready"
            );

        });

    }
);