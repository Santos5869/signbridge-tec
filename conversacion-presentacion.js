/* =========================================
   SIGNBRIDGE
   CONVERSACIÓN DE PRESENTACIÓN
========================================= */

const lecciones = [

    {
        titulo: "HOLA, MUCHO GUSTO",
        descripcion:
            "Aprende una expresión para iniciar una presentación.",
        icono: "👋",
        texto:
            "Observa el material visual y practica la expresión."
    },

    {
        titulo: "¿CÓMO TE LLAMAS?",
        descripcion:
            "Aprende cómo preguntar el nombre de otra persona.",
        icono: "❓",
        texto:
            "Practica la pregunta y relaciónala con una conversación."
    },

    {
        titulo: "ME LLAMO...",
        descripcion:
            "Aprende cómo responder diciendo tu nombre.",
        icono: "🙋",
        texto:
            "Observa el material y practica la respuesta."
    },

    {
        titulo: "¿DE DÓNDE ERES?",
        descripcion:
            "Aprende cómo preguntar el origen de otra persona.",
        icono: "🌎",
        texto:
            "Practica la pregunta dentro de una conversación."
    },

    {
        titulo: "SOY DE...",
        descripcion:
            "Aprende cómo responder indicando tu lugar de origen.",
        icono: "📍",
        texto:
            "Practica la respuesta utilizando tu lugar de origen."
    },

    {
        titulo: "¿CÓMO ESTÁS?",
        descripcion:
            "Aprende cómo preguntar cómo se encuentra otra persona.",
        icono: "💬",
        texto:
            "Observa el material visual y practica la pregunta."
    },

    {
        titulo: "ESTOY BIEN",
        descripcion:
            "Aprende una respuesta básica dentro de una conversación.",
        icono: "😊",
        texto:
            "Practica la expresión como respuesta."
    },

    {
        titulo: "¿QUÉ HACES?",
        descripcion:
            "Aprende una pregunta para conocer qué hace otra persona.",
        icono: "🤔",
        texto:
            "Observa el material visual y practica la pregunta."
    },

    {
        titulo: "SOY ESTUDIANTE",
        descripcion:
            "Aprende cómo expresar que eres estudiante.",
        icono: "🎓",
        texto:
            "Practica la expresión dentro de una presentación."
    },

    {
        titulo: "HASTA LUEGO",
        descripcion:
            "Aprende una expresión para finalizar una conversación.",
        icono: "👋",
        texto:
            "Practica la expresión utilizada para despedirte."
    }

];


let leccionActual =
    recuperarLeccion();


/* USUARIO */

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


/* GUARDAR USUARIO */

function guardarUsuarioActivo(usuario) {

    localStorage.setItem(
        "usuarioSignbridge",
        JSON.stringify(usuario)
    );

    try {

        const usuarios =
            JSON.parse(
                localStorage.getItem(
                    "usuariosSignbridge"
                )
            ) || [];

        const posicion =
            usuarios.findIndex(
                usuarioRegistrado =>
                    String(usuarioRegistrado.id) ===
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


/* RECUPERAR LECCIÓN */

function recuperarLeccion() {

    const usuario =
        obtenerUsuarioActivo();

    if (
        usuario &&
        usuario.progreso &&
        typeof usuario.progreso.conversacionPresentacionLeccion ===
            "number"
    ) {

        return Math.min(
            Math.max(
                usuario.progreso.conversacionPresentacionLeccion,
                0
            ),
            lecciones.length - 1
        );
    }

    return 0;
}


/* GUARDAR PROGRESO */

function guardarProgreso() {

    const usuario =
        obtenerUsuarioActivo();

    if (!usuario) {
        return;
    }

    if (!usuario.progreso) {
        usuario.progreso = {};
    }

    const porcentaje =
        Math.round(
            ((leccionActual + 1) /
                lecciones.length) *
            100
        );

    const progresoAnterior =
        Number(
            usuario.progreso.conversacionPresentacion
        ) || 0;

    usuario.progreso.conversacionPresentacion =
        Math.max(
            progresoAnterior,
            porcentaje
        );

    usuario.progreso.conversacionPresentacionLeccion =
        leccionActual;

    guardarUsuarioActivo(usuario);
}


/* ELEMENTOS */

const titulo =
    document.getElementById(
        "tituloLeccion"
    );

const descripcion =
    document.getElementById(
        "descripcionLeccion"
    );

const nombre =
    document.getElementById(
        "nombreLeccion"
    );

const texto =
    document.getElementById(
        "textoLeccion"
    );

const icono =
    document.getElementById(
        "iconoLeccion"
    );

const contador =
    document.getElementById(
        "numeroLeccion"
    );

const progresoTexto =
    document.getElementById(
        "progresoTexto"
    );

const barra =
    document.getElementById(
        "barra"
    );

const navigationText =
    document.getElementById(
        "navigationText"
    );

const anterior =
    document.getElementById(
        "anterior"
    );

const siguiente =
    document.getElementById(
        "siguiente"
    );

const learningCard =
    document.querySelector(
        ".learning-card"
    );


/* MOSTRAR LECCIÓN */

function mostrarLeccion(animar = false) {

    const leccion =
        lecciones[leccionActual];


    function actualizarContenido() {

        contador.textContent =
            leccionActual + 1;

        titulo.textContent =
            leccion.titulo;

        descripcion.textContent =
            leccion.descripcion;

        nombre.textContent =
            leccion.titulo;

        texto.textContent =
            leccion.texto;

        icono.textContent =
            leccion.icono;

        navigationText.textContent =
            `${leccionActual + 1} / ${lecciones.length}`;


        const porcentaje =
            Math.round(
                ((leccionActual + 1) /
                    lecciones.length) *
                100
            );


        progresoTexto.textContent =
            `${porcentaje}%`;

        barra.style.width =
            `${porcentaje}%`;

        anterior.disabled =
            leccionActual === 0;

        siguiente.innerHTML =
            leccionActual ===
            lecciones.length - 1
                ? "Finalizar ✓"
                : 'Siguiente <span>→</span>';


        guardarProgreso();
    }


    if (!animar) {

        actualizarContenido();

        return;
    }


    learningCard.classList.add(
        "changing"
    );


    setTimeout(() => {

        actualizarContenido();

        learningCard.classList.remove(
            "changing"
        );

    }, 220);
}


/* SIGUIENTE */

function siguienteLeccion() {

    if (
        leccionActual <
        lecciones.length - 1
    ) {

        leccionActual++;

        mostrarLeccion(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } else {

        finalizarCurso();
    }
}


/* ANTERIOR */

function anteriorLeccion() {

    if (leccionActual > 0) {

        leccionActual--;

        mostrarLeccion(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


/* FINALIZAR */

function finalizarCurso() {

    const usuario =
        obtenerUsuarioActivo();

    if (usuario) {

        if (!usuario.progreso) {
            usuario.progreso = {};
        }

        usuario.progreso.conversacionPresentacion =
            100;

        usuario.progreso.conversacionPresentacionLeccion =
            lecciones.length - 1;

        guardarUsuarioActivo(usuario);
    }


    learningCard.style.display =
        "none";

    document.querySelector(
        ".progress-card"
    ).style.display =
        "none";

    document.querySelector(
        ".navigation"
    ).style.display =
        "none";

    document.querySelector(
        ".lesson-heading"
    ).style.display =
        "none";

    document.getElementById(
        "finalScreen"
    ).classList.remove(
        "hidden"
    );
}


/* VOLVER */

document.getElementById(
    "volver"
).addEventListener(
    "click",
    () => {

        window.location.href =
            "presentaciones-cursos.html";
    }
);


document.getElementById(
    "volverCursos"
).addEventListener(
    "click",
    () => {

        window.location.href =
            "presentaciones-cursos.html";
    }
);


/* BOTONES */

siguiente.addEventListener(
    "click",
    siguienteLeccion
);

anterior.addEventListener(
    "click",
    anteriorLeccion
);


/* INICIO */

mostrarLeccion();