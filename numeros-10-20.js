// =====================================================
// SIGNBRIDGE
// CURSO DE NÚMEROS DEL 10 AL 20
// =====================================================


// =====================================================
// DATOS DEL CURSO
// =====================================================

const numeros = [

    {
        titulo: "10",
        tipo: "imagen",
        contenido: "../images/numeros/10.png",
        descripcion:
            "Observa la imagen para aprender la seña correspondiente al número 10."
    },

    {
        titulo: "11",
        tipo: "video",
        contenido: "../videos/numeros/11.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 11."
    },

    {
        titulo: "12",
        tipo: "video",
        contenido: "../videos/numeros/12.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 12."
    },

    {
        titulo: "13",
        tipo: "video",
        contenido: "../videos/numeros/13.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 13."
    },

    {
        titulo: "14",
        tipo: "video",
        contenido: "../videos/numeros/14.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 14."
    },

    {
        titulo: "15",
        tipo: "video",
        contenido: "../videos/numeros/15.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 15."
    },

    {
        titulo: "16",
        tipo: "video",
        contenido: "../videos/numeros/16.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 16."
    },

    {
        titulo: "17",
        tipo: "video",
        contenido: "../videos/numeros/17.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 17."
    },

    {
        titulo: "18",
        tipo: "video",
        contenido: "../videos/numeros/18.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 18."
    },

    {
        titulo: "19",
        tipo: "video",
        contenido: "../videos/numeros/19.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 19."
    },

    {
        titulo: "20",
        tipo: "video",
        contenido: "../videos/numeros/20.mp4",
        descripcion:
            "Observa atentamente el video para aprender la seña correspondiente al número 20."
    }

];


// =====================================================
// VARIABLES
// =====================================================

let indice = 0;

let cambiandoLeccion = false;


// =====================================================
// ELEMENTOS HTML
// =====================================================

const titulo =
    document.getElementById("titulo");

const video =
    document.getElementById("video");

const imagenNumero =
    document.getElementById("imagenNumero");

const descripcion =
    document.getElementById("descripcion");

const barra =
    document.getElementById("barra");

const contador =
    document.getElementById("contador");

const textoProgreso =
    document.getElementById("textoProgreso");

const btnAnterior =
    document.getElementById("anterior");

const btnSiguiente =
    document.getElementById("siguiente");

const pantallaFinal =
    document.getElementById("finalScreen");

const btnVolverInicio =
    document.getElementById("volverInicio");


// =====================================================
// CARGAR LECCIÓN
// =====================================================

function cargarNumero(animar = true) {

    const numero =
        numeros[indice];

    if (!numero) {
        return;
    }


    // =================================================
    // ANIMACIÓN DE SALIDA
    // =================================================

    if (animar) {

        titulo.classList.add("fade-out");

        video.classList.add("fade-out");

        imagenNumero.classList.add("fade-out");

        descripcion.classList.add("fade-out");

    }


    const tiempo =
        animar ? 250 : 0;


    setTimeout(() => {


        // =============================================
        // ACTUALIZAR TEXTO
        // =============================================

        titulo.textContent =
            numero.titulo;


        descripcion.textContent =
            numero.descripcion;


        // =============================================
        // ACTUALIZAR MATERIAL
        // =============================================

        if (numero.tipo === "imagen") {

            // Detener cualquier video anterior
            video.pause();

            // Quitar el video actual
            video.removeAttribute("src");

            video.load();

            // Ocultar video
            video.style.display =
                "none";

            // Mostrar imagen
            imagenNumero.src =
                numero.contenido;

            imagenNumero.style.display =
                "block";

        } else {

            // Ocultar imagen
            imagenNumero.style.display =
                "none";

            // Mostrar video
            video.style.display =
                "block";

            // Cargar video correspondiente
            video.pause();

            video.src =
                numero.contenido;

            video.load();

        }


        // =============================================
        // CONTADOR
        // =============================================

        contador.textContent =
            `${indice + 1} / ${numeros.length}`;


        // =============================================
        // PROGRESO
        // =============================================

        const porcentaje =
            ((indice + 1) /
                numeros.length) * 100;


        barra.style.width =
            `${porcentaje}%`;


        textoProgreso.textContent =
            `${Math.round(porcentaje)}% completado`;


        // =============================================
        // BOTÓN ANTERIOR
        // =============================================

        btnAnterior.disabled =
            indice === 0;


        // =============================================
        // BOTÓN SIGUIENTE
        // =============================================

        if (
            indice ===
            numeros.length - 1
        ) {

            btnSiguiente.innerHTML =
                "Finalizar ✓";

        } else {

            btnSiguiente.innerHTML =
                "Siguiente ➜";

        }


        // =============================================
        // ANIMACIÓN DE ENTRADA
        // =============================================

        if (animar) {

            titulo.classList.remove("fade-out");

            video.classList.remove("fade-out");

            imagenNumero.classList.remove("fade-out");

            descripcion.classList.remove("fade-out");


            titulo.classList.add("fade-in");

            video.classList.add("fade-in");

            imagenNumero.classList.add("fade-in");

            descripcion.classList.add("fade-in");


            setTimeout(() => {

                titulo.classList.remove("fade-in");

                video.classList.remove("fade-in");

                imagenNumero.classList.remove("fade-in");

                descripcion.classList.remove("fade-in");

            }, 350);

        }


        // =============================================
        // REPRODUCIR SOLO SI ES VIDEO
        // =============================================

        if (numero.tipo === "video") {

            video.play()
                .catch(() => {});

        }


        cambiandoLeccion =
            false;


    }, tiempo);

}


// =====================================================
// SIGUIENTE
// =====================================================

function siguienteNumero() {

    if (cambiandoLeccion) {
        return;
    }


    // Todavía quedan números

    if (
        indice <
        numeros.length - 1
    ) {

        cambiandoLeccion =
            true;

        indice++;

        cargarNumero(true);

        return;
    }


    // Ya llegó al 20

    mostrarPantallaFinal();

}


// =====================================================
// ANTERIOR
// =====================================================

function anteriorNumero() {

    if (cambiandoLeccion) {
        return;
    }


    if (indice > 0) {

        cambiandoLeccion =
            true;

        indice--;

        cargarNumero(true);

    }

}


// =====================================================
// PANTALLA FINAL
// =====================================================

function mostrarPantallaFinal() {

    video.pause();


    // Aseguramos que la barra
    // termine completamente llena

    barra.style.width =
        "100%";


    textoProgreso.textContent =
        "100% completado";


    pantallaFinal.classList.add(
        "show"
    );

}


// =====================================================
// VOLVER A NÚMEROS
// =====================================================

function volverANumeros() {

    window.location.href =
        "numeros-cursos.html";

}


// =====================================================
// EVENTO BOTÓN VOLVER
// =====================================================

if (btnVolverInicio) {

    btnVolverInicio.addEventListener(
        "click",
        volverANumeros
    );

}


// =====================================================
// EVENTO BOTÓN SIGUIENTE
// =====================================================

btnSiguiente.addEventListener(
    "click",
    siguienteNumero
);


// =====================================================
// EVENTO BOTÓN ANTERIOR
// =====================================================

btnAnterior.addEventListener(
    "click",
    anteriorNumero
);


// =====================================================
// NAVEGACIÓN CON TECLADO
// =====================================================

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            pantallaFinal.classList.contains("show")
        ) {
            return;
        }


        if (
            evento.key === "ArrowRight"
        ) {

            siguienteNumero();

        }


        if (
            evento.key === "ArrowLeft"
        ) {

            anteriorNumero();

        }

    }
);


// =====================================================
// INICIAR CURSO
// =====================================================

cargarNumero(false);