// ===========================================
// SIGNBRIDGE - CURSO DE SALUDOS
// PROGRESO POR USUARIO
// ===========================================


const saludos = [

    {
        titulo: "Hola",
        video: "../videos/saludos/hola.mp4",
        descripcion: "Seña utilizada para saludar a una persona."
    },

    {
        titulo: "Buenos días",
        video: "../videos/saludos/buenos_dias.mp4",
        descripcion: "Saludo utilizado durante la mañana."
    },

    {
        titulo: "Buenas tardes",
        video: "../videos/saludos/buenas_tardes.mp4",
        descripcion: "Saludo utilizado durante la tarde."
    },

    {
        titulo: "Buenas noches",
        video: "../videos/saludos/buenas_noches.mp4",
        descripcion: "Saludo utilizado durante la noche."
    },

    {
        titulo: "¿Cómo estás?",
        video: "../videos/saludos/como_estas.mp4",
        descripcion: "Pregunta utilizada para saber cómo se encuentra una persona."
    },

    {
        titulo: "Gracias",
        video: "../videos/saludos/gracias.mp4",
        descripcion: "Expresión para mostrar agradecimiento."
    },

    {
        titulo: "Por favor",
        video: "../videos/saludos/por_favor.mp4",
        descripcion: "Expresión utilizada para pedir algo con cortesía."
    },

    {
        titulo: "De nada",
        video: "../videos/saludos/de_nada.mp4",
        descripcion: "Respuesta común después de recibir un agradecimiento."
    },

    {
        titulo: "Adiós",
        video: "../videos/saludos/adios.mp4",
        descripcion: "Seña utilizada para despedirse."
    },

    {
        titulo: "Hasta luego",
        video: "../videos/saludos/hasta_luego.mp4",
        descripcion: "Despedida indicando que volverán a verse."
    }

];


// ===========================================
// VARIABLE PRINCIPAL
// ===========================================

let indice = 0;


// ===========================================
// ELEMENTOS HTML
// ===========================================

const titulo =
    document.getElementById("titulo");

const video =
    document.getElementById("video");

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


// ===========================================
// PANTALLA FINAL
// ===========================================

const pantallaFinal =
    document.getElementById("finalScreen");

const btnVolverInicio =
    document.getElementById("volverInicio");


// ===========================================
// OBTENER USUARIO ACTIVO
// ===========================================

function obtenerUsuarioActivo() {

    try {

        const datos =
            localStorage.getItem(
                "usuarioSignbridge"
            );

        if (!datos) {

            return null;

        }

        return JSON.parse(datos);

    } catch (error) {

        console.error(
            "Error obteniendo usuario:",
            error
        );

        return null;

    }

}


// ===========================================
// GUARDAR USUARIO ACTUALIZADO
// ===========================================

function guardarUsuarioActivo(usuario) {

    localStorage.setItem(
        "usuarioSignbridge",
        JSON.stringify(usuario)
    );


    // Actualizar lista general de usuarios

    try {

        const usuarios =
            JSON.parse(
                localStorage.getItem(
                    "usuariosSignbridge"
                )
            ) || [];


        const posicion =
            usuarios.findIndex(

                user =>
                    String(user.id) ===
                    String(usuario.id)

            );


        if (posicion !== -1) {

            usuarios[posicion] =
                usuario;


            localStorage.setItem(
                "usuariosSignbridge",
                JSON.stringify(usuarios)
            );

        }

    } catch (error) {

        console.error(
            "Error actualizando usuarios:",
            error
        );

    }

}


// ===========================================
// GUARDAR PROGRESO DE SALUDOS
// ===========================================

function guardarProgresoSaludos() {

    const usuario =
        obtenerUsuarioActivo();


    if (!usuario) {

        console.warn(
            "No hay usuario activo."
        );

        return;

    }


    // Crear estructura de progreso

    if (!usuario.progreso) {

        usuario.progreso = {

            abecedario: 0,
            numeros: 0,
            saludos: 0,
            reconocimiento: 0

        };

    }


    // Calcular porcentaje

    const porcentaje =
        Math.round(
            ((indice + 1) /
                saludos.length) * 100
        );


    const progresoActual =
        Number(
            usuario.progreso.saludos
        ) || 0;


    // Nunca retroceder

    usuario.progreso.saludos =
        Math.max(
            progresoActual,
            porcentaje
        );


    guardarUsuarioActivo(usuario);


    console.log(
        "✓ Progreso Saludos:",
        usuario.progreso.saludos + "%"
    );

}


// ===========================================
// MOSTRAR SALUDO
// ===========================================

function cargarSaludo() {

    const saludo =
        saludos[indice];


    if (!saludo) {

        return;

    }


    // Guardar progreso

    guardarProgresoSaludos();


    // =======================================
    // ANIMACIÓN DE SALIDA
    // =======================================

    titulo.classList.add("fade-out");

    video.classList.add("fade-out");

    descripcion.classList.add("fade-out");


    setTimeout(() => {


        // ===================================
        // ACTUALIZAR CONTENIDO
        // ===================================

        titulo.textContent =
            saludo.titulo;


        descripcion.textContent =
            saludo.descripcion;


        video.src =
            saludo.video;

        video.load();


        // ===================================
        // QUITAR SALIDA
        // ===================================

        titulo.classList.remove("fade-out");

        video.classList.remove("fade-out");

        descripcion.classList.remove("fade-out");


        // ===================================
        // ANIMACIÓN DE ENTRADA
        // ===================================

        titulo.classList.add("fade-in");

        video.classList.add("fade-in");

        descripcion.classList.add("fade-in");


        setTimeout(() => {

            titulo.classList.remove("fade-in");

            video.classList.remove("fade-in");

            descripcion.classList.remove("fade-in");

        }, 350);


        // Reproducir video

        video.play().catch(() => {});


    }, 250);


    // =======================================
    // CONTADOR
    // =======================================

    contador.textContent =
        `${indice + 1} / ${saludos.length}`;


    // =======================================
    // BARRA DE PROGRESO
    // =======================================

    const porcentaje =
        ((indice + 1) /
            saludos.length) * 100;


    barra.style.width =
        porcentaje + "%";


    textoProgreso.textContent =
        Math.round(porcentaje) +
        "% completado";


    // =======================================
    // BOTÓN ANTERIOR
    // =======================================

    btnAnterior.disabled =
        indice === 0;

}


// ===========================================
// MOSTRAR PANTALLA FINAL
// ===========================================

function mostrarPantallaFinal() {

    const usuario =
        obtenerUsuarioActivo();


    // =======================================
    // ASEGURAR 100%
    // =======================================

    if (usuario) {

        if (!usuario.progreso) {

            usuario.progreso = {

                abecedario: 0,
                numeros: 0,
                saludos: 0,
                reconocimiento: 0

            };

        }


        usuario.progreso.saludos =
            100;


        guardarUsuarioActivo(usuario);

    }


    // =======================================
    // PAUSAR VIDEO
    // =======================================

    if (video) {

        video.pause();

    }


    // =======================================
    // MOSTRAR TARJETA
    // =======================================

    if (pantallaFinal) {

        pantallaFinal.classList.add("show");

    }

}


// ===========================================
// BOTÓN SIGUIENTE
// ===========================================

if (btnSiguiente) {

    btnSiguiente.addEventListener(
        "click",
        () => {


            // =================================
            // TODAVÍA QUEDAN SALUDOS
            // =================================

            if (
                indice <
                saludos.length - 1
            ) {

                indice++;

                cargarSaludo();

            }


            // =================================
            // ÚLTIMO SALUDO
            // =================================

            else {

                mostrarPantallaFinal();

            }

        }
    );

}


// ===========================================
// BOTÓN ANTERIOR
// ===========================================

if (btnAnterior) {

    btnAnterior.addEventListener(
        "click",
        () => {

            if (indice > 0) {

                indice--;

                cargarSaludo();

            }

        }
    );

}


// ===========================================
// NAVEGACIÓN CON TECLADO
// ===========================================

document.addEventListener(
    "keydown",
    (e) => {


        // No avanzar mientras
        // está abierta la tarjeta final

        if (
            pantallaFinal &&
            pantallaFinal.classList.contains("show")
        ) {

            return;

        }


        if (
            e.key === "ArrowRight"
        ) {

            if (btnSiguiente) {

                btnSiguiente.click();

            }

        }


        if (
            e.key === "ArrowLeft"
        ) {

            if (btnAnterior) {

                btnAnterior.click();

            }

        }

    }
);


// ===========================================
// BOTÓN VOLVER AL INICIO
// ===========================================

if (btnVolverInicio) {

    btnVolverInicio.addEventListener(
        "click",
        () => {

            window.location.href = "saludos-cursos.html";

        }
    );

}


// ===========================================
// INICIALIZAR CURSO
// ===========================================

cargarSaludo();