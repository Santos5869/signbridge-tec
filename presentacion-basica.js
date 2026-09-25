/* =========================================
   SIGNBRIDGE
   PRESENTACIÓN BÁSICA
========================================= */

const lecciones = [

    {
        titulo: "MI NOMBRE",
        descripcion:
            "Aprende la expresión utilizada al momento de indicar tu nombre.",
        icono: "👤",
        texto:
            "Observa atentamente el material visual, identifica la expresión y practica la seña."
    },

    {
        titulo: "¿CÓMO TE LLAMAS?",
        descripcion:
            "Aprende cómo preguntar el nombre de otra persona.",
        icono: "❓",
        texto:
            "Observa el material visual y practica la expresión varias veces."
    },

    {
        titulo: "ME LLAMO...",
        descripcion:
            "Aprende la expresión para responder indicando tu nombre.",
        icono: "🙋",
        texto:
            "Practica la expresión y relaciónala con una presentación personal."
    },

    {
        titulo: "MUCHO GUSTO",
        descripcion:
            "Aprende una expresión utilizada al conocer a otra persona.",
        icono: "🤝",
        texto:
            "Observa el material visual y practica la expresión."
    },

    {
        titulo: "YO",
        descripcion:
            "Aprende la palabra utilizada para referirte a ti mismo.",
        icono: "👤",
        texto:
            "Observa el material y practica la expresión."
    },

    {
        titulo: "TÚ",
        descripcion:
            "Aprende la palabra utilizada para referirte a otra persona.",
        icono: "👉",
        texto:
            "Observa el material visual y practica la expresión."
    },

    {
        titulo: "¿DE DÓNDE ERES?",
        descripcion:
            "Aprende cómo preguntar el lugar de origen de otra persona.",
        icono: "🌎",
        texto:
            "Observa el material visual y practica la pregunta."
    },

    {
        titulo: "SOY DE...",
        descripcion:
            "Aprende cómo indicar tu lugar de origen.",
        icono: "📍",
        texto:
            "Practica la expresión y relaciónala con tu lugar de origen."
    },

    {
        titulo: "¿CÓMO ESTÁS?",
        descripcion:
            "Aprende cómo preguntar a otra persona cómo se encuentra.",
        icono: "💬",
        texto:
            "Observa el material visual y practica la pregunta."
    },

    {
        titulo: "ESTOY BIEN",
        descripcion:
            "Aprende cómo responder cuando te encuentras bien.",
        icono: "😊",
        texto:
            "Practica la expresión y relaciónala con una respuesta cotidiana."
    }

];


/* =========================================
   ESTADO
========================================= */

let leccionActual = recuperarLeccion();


/* =========================================
   USUARIO
========================================= */

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

            usuarios[posicion] = usuario;

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


/* =========================================
   RECUPERAR LECCIÓN
========================================= */

function recuperarLeccion() {

    const usuario =
        obtenerUsuarioActivo();


    if (
        usuario &&
        usuario.progreso &&
        typeof usuario.progreso.presentacionBasicaLeccion ===
            "number"
    ) {

        return Math.min(
            Math.max(
                usuario.progreso.presentacionBasicaLeccion,
                0
            ),
            lecciones.length - 1
        );
    }


    return 0;
}


/* =========================================
   GUARDAR PROGRESO
========================================= */

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
            usuario.progreso.presentacionBasica
        ) || 0;


    usuario.progreso.presentacionBasica =
        Math.max(
            progresoAnterior,
            porcentaje
        );


    usuario.progreso.presentacionBasicaLeccion =
        leccionActual;


    guardarUsuarioActivo(usuario);
}


/* =========================================
   ELEMENTOS
========================================= */

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


/* =========================================
   MOSTRAR LECCIÓN
========================================= */

function mostrarLeccion(animar = false) {

    const leccion =
        lecciones[leccionActual];


    const actualizarContenido = () => {

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
    };


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


/* =========================================
   SIGUIENTE
========================================= */

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


/* =========================================
   ANTERIOR
========================================= */

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


/* =========================================
   FINALIZAR CURSO
========================================= */

function finalizarCurso() {

    const usuario =
        obtenerUsuarioActivo();


    if (usuario) {

        if (!usuario.progreso) {
            usuario.progreso = {};
        }


        usuario.progreso.presentacionBasica =
            100;


        usuario.progreso.presentacionBasicaLeccion =
            lecciones.length - 1;


        guardarUsuarioActivo(usuario);
    }


    learningCard.style.display =
        "none";


    document.querySelector(
        ".progress-card"
    ).style.display = "none";


    document.querySelector(
        ".navigation"
    ).style.display = "none";


    document.querySelector(
        ".lesson-heading"
    ).style.display = "none";


    document.getElementById(
        "finalScreen"
    ).classList.remove(
        "hidden"
    );
}


/* =========================================
   VOLVER
========================================= */

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


/* =========================================
   BOTONES
========================================= */

siguiente.addEventListener(
    "click",
    siguienteLeccion
);


anterior.addEventListener(
    "click",
    anteriorLeccion
);


/* =========================================
   ANIMACIÓN ENTRE LECCIONES
========================================= */

const style =
    document.createElement("style");

style.textContent = `

    .learning-card.changing {
        opacity: 0;
        transform: translateY(8px) scale(0.995);
        transition:
            opacity 0.22s ease,
            transform 0.22s ease;
    }

`;

document.head.appendChild(style);


/* =========================================
   INICIO
========================================= */

mostrarLeccion();