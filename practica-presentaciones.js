/* =========================================
   SIGNBRIDGE
   PRÁCTICA DE PRESENTACIONES
========================================= */

const ejercicios = [
    {
        titulo: "Mi nombre",
        descripcion:
            "Observa la referencia y después intenta realizar la seña.",
        icono: "👤",
        referencia:
            "Aquí colocaremos el video real de la seña de «Mi nombre».",
        contexto:
            "Estás comenzando una presentación y quieres indicar tu nombre."
    },

    {
        titulo: "¿Cómo te llamas?",
        descripcion:
            "Observa la referencia y practica la pregunta.",
        icono: "❓",
        referencia:
            "Aquí colocaremos el video real de la seña de «¿Cómo te llamas?».",
        contexto:
            "Quieres conocer el nombre de la persona que acabas de conocer."
    },

    {
        titulo: "Me llamo...",
        descripcion:
            "Observa la referencia y practica la respuesta.",
        icono: "🙋",
        referencia:
            "Aquí colocaremos el video real de la seña de «Me llamo...».",
        contexto:
            "La otra persona te pregunta cómo te llamas."
    },

    {
        titulo: "¿De dónde eres?",
        descripcion:
            "Observa la referencia y practica la pregunta.",
        icono: "🌎",
        referencia:
            "Aquí colocaremos el video real de la seña de «¿De dónde eres?».",
        contexto:
            "Quieres conocer el lugar de origen de la otra persona."
    },

    {
        titulo: "Soy de...",
        descripcion:
            "Observa la referencia y practica la respuesta.",
        icono: "📍",
        referencia:
            "Aquí colocaremos el video real de la seña de «Soy de...».",
        contexto:
            "La otra persona te pregunta de dónde eres."
    }
];


/* =========================================
   ESTADO
========================================= */

let ejercicioActual = recuperarEjercicio();

let cameraInstance = null;

let streamActivo = null;

let manosDetectadas = false;

let practicaIniciada = false;

let intentoRegistrado = false;


/* =========================================
   ELEMENTOS
========================================= */

const video =
    document.getElementById("video");

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const startCamera =
    document.getElementById("startCamera");

const stopCamera =
    document.getElementById("stopCamera");

const cameraPlaceholder =
    document.getElementById("cameraPlaceholder");

const cameraStatusDot =
    document.getElementById("cameraStatusDot");

const cameraStatusText =
    document.getElementById("cameraStatusText");

const recognitionResult =
    document.getElementById("recognitionResult");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const siguienteEjercicio =
    document.getElementById("siguienteEjercicio");

const repetirEjercicio =
    document.getElementById("repetirEjercicio");

const reproducirReferencia =
    document.getElementById("reproducirReferencia");

const repetirReferencia =
    document.getElementById("repetirReferencia");

const ejercicioCard =
    document.getElementById("exerciseCard");

const completionScreen =
    document.getElementById("completionScreen");


/* =========================================
   DATOS DE LA INTERFAZ
========================================= */

const numeroEjercicio =
    document.getElementById("numeroEjercicio");

const totalEjercicios =
    document.getElementById("totalEjercicios");

const progresoTexto =
    document.getElementById("progresoTexto");

const barraProgreso =
    document.getElementById("barraProgreso");

const tituloEjercicio =
    document.getElementById("tituloEjercicio");

const descripcionEjercicio =
    document.getElementById("descripcionEjercicio");

const referenceVisual =
    document.getElementById("referenceVisual");

const referenceTitle =
    document.getElementById("referenceTitle");

const referenceDescription =
    document.getElementById("referenceDescription");

const estadoEjercicio =
    document.getElementById("estadoEjercicio");

const contextTitle =
    document.getElementById("contextTitle");

const contextDescription =
    document.getElementById("contextDescription");

const contextIcon =
    document.getElementById("contextIcon");

const volver =
    document.getElementById("volver");

const volverCursos =
    document.getElementById("volverCursos");

const ejerciciosCompletados =
    document.getElementById("ejerciciosCompletados");

const porcentajeFinal =
    document.getElementById("porcentajeFinal");


/* =========================================
   USUARIO ACTIVO
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
            "Error leyendo usuario:",
            error
        );

        return null;
    }
}


/* =========================================
   GUARDAR USUARIO ACTIVO
========================================= */

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
            "Error guardando usuario:",
            error
        );
    }
}


/* =========================================
   RECUPERAR EJERCICIO
========================================= */

function recuperarEjercicio() {

    const usuario =
        obtenerUsuarioActivo();


    if (
        usuario &&
        usuario.progreso &&
        typeof usuario.progreso.practicaPresentacionesEjercicio ===
            "number"
    ) {

        return Math.min(
            Math.max(
                usuario.progreso.practicaPresentacionesEjercicio,
                0
            ),
            ejercicios.length - 1
        );
    }


    return 0;
}


/* =========================================
   GUARDAR PROGRESO
========================================= */

function guardarProgresoPractica(
    porcentaje,
    ejercicio
) {

    const usuario =
        obtenerUsuarioActivo();


    if (!usuario) {
        return;
    }


    if (!usuario.progreso) {
        usuario.progreso = {};
    }


    const progresoAnterior =
        Number(
            usuario.progreso.practicaPresentaciones
        ) || 0;


    usuario.progreso.practicaPresentaciones =
        Math.max(
            progresoAnterior,
            porcentaje
        );


    usuario.progreso.practicaPresentacionesEjercicio =
        ejercicio;


    guardarUsuarioActivo(
        usuario
    );
}


/* =========================================
   MOSTRAR EJERCICIO
========================================= */

function mostrarEjercicio(
    animar = false
) {

    const ejercicio =
        ejercicios[ejercicioActual];


    function actualizarContenido() {

        numeroEjercicio.textContent =
            ejercicioActual + 1;


        totalEjercicios.textContent =
            ejercicios.length;


        tituloEjercicio.textContent =
            ejercicio.titulo;


        descripcionEjercicio.textContent =
            ejercicio.descripcion;


        referenceVisual.textContent =
            ejercicio.icono;


        referenceTitle.textContent =
            ejercicio.titulo;


        referenceDescription.textContent =
            ejercicio.referencia;


        contextTitle.textContent =
            ejercicio.contexto;


        contextDescription.textContent =
            ejercicio.descripcion;


        contextIcon.textContent =
            ejercicio.icono;


        const porcentaje =
            Math.round(
                ((ejercicioActual + 1) /
                    ejercicios.length) *
                100
            );


        progresoTexto.textContent =
            `${porcentaje}%`;


        barraProgreso.style.width =
            `${porcentaje}%`;


        estadoEjercicio.textContent =
            "PREPARADO";

        estadoEjercicio.className =
            "exercise-status neutral";


        reconocimientoResultado(
            "neutral",
            "👋",
            "Listo para practicar",
            "Inicia la cámara y coloca tu mano frente a ella."
        );


        siguienteEjercicio.disabled =
            !intentoRegistrado;


        guardarProgresoPractica(
            porcentaje,
            ejercicioActual
        );


        reiniciarEstadoPractica();
    }


    if (!animar) {

        actualizarContenido();

        return;
    }


    ejercicioCard.classList.add(
        "changing"
    );


    setTimeout(() => {

        actualizarContenido();

        ejercicioCard.classList.remove(
            "changing"
        );

    }, 220);
}


/* =========================================
   REINICIAR ESTADO
========================================= */

function reiniciarEstadoPractica() {

    manosDetectadas =
        false;

    practicaIniciada =
        false;

    intentoRegistrado =
        false;

    siguienteEjercicio.disabled =
        true;


    estadoEjercicio.textContent =
        "PREPARADO";

    estadoEjercicio.className =
        "exercise-status neutral";
}


/* =========================================
   RESULTADO DE PRÁCTICA
========================================= */

function reconocimientoResultado(
    tipo,
    iconoResultado,
    tituloResultado,
    mensajeResultado
) {

    recognitionResult.className =
        `recognition-result ${tipo}-result`;


    resultIcon.textContent =
        iconoResultado;


    resultTitle.textContent =
        tituloResultado;


    resultMessage.textContent =
        mensajeResultado;
}


/* =========================================
   CAMBIAR ESTADO DE CÁMARA
========================================= */

function actualizarEstadoCamara(
    estado,
    mensaje
) {

    cameraStatusText.textContent =
        mensaje;


    cameraStatusDot.className =
        "camera-status-dot";


    if (estado === "active") {

        cameraStatusDot.classList.add(
            "active"
        );

    }


    if (estado === "detected") {

        cameraStatusDot.classList.add(
            "detected"
        );

    }
}


/* =========================================
   INICIAR CÁMARA
========================================= */

async function iniciarCamara() {

    try {

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {

            throw new Error(
                "Tu navegador no permite acceder a la cámara."
            );
        }


        actualizarEstadoCamara(
            "active",
            "Solicitando cámara..."
        );


        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: {
                    facingMode: "user",

                    width: {
                        ideal: 1280
                    },

                    height: {
                        ideal: 720
                    }
                },

                audio: false
            });


        streamActivo =
            stream;


        video.srcObject =
            stream;


        await video.play();


        cameraPlaceholder.classList.add(
            "hidden"
        );


        startCamera.disabled =
            true;


        stopCamera.disabled =
            false;


        practicaIniciada =
            true;


        actualizarEstadoCamara(
            "active",
            "Cámara activa"
        );


        reconocimientoResultado(
            "active",
            "👁️",
            "Cámara activa",
            "Coloca tu mano dentro del área marcada."
        );


        configurarCanvas();


        iniciarMediaPipe();


    } catch (error) {

        console.error(
            "No se pudo iniciar la cámara:",
            error
        );


        actualizarEstadoCamara(
            "inactive",
            "Cámara detenida"
        );


        reconocimientoResultado(
            "warning",
            "⚠️",
            "No se pudo abrir la cámara",
            obtenerMensajeErrorCamara(error)
        );
    }
}


/* =========================================
   MENSAJES DE ERROR DE CÁMARA
========================================= */

function obtenerMensajeErrorCamara(
    error
) {

    if (
        error &&
        error.name ===
            "NotAllowedError"
    ) {

        return "Debes permitir el acceso a la cámara para practicar.";
    }


    if (
        error &&
        error.name ===
            "NotFoundError"
    ) {

        return "No encontramos una cámara disponible en este dispositivo.";
    }


    if (
        error &&
        error.name ===
            "NotReadableError"
    ) {

        return "La cámara está siendo utilizada por otra aplicación.";
    }


    return (
        error?.message ||
        "No fue posible acceder a la cámara."
    );
}


/* =========================================
   DETENER CÁMARA
========================================= */

function detenerCamara() {

    if (streamActivo) {

        streamActivo
            .getTracks()
            .forEach(track => {
                track.stop();
            });

        streamActivo =
            null;
    }


    video.srcObject =
        null;


    if (cameraInstance) {

        try {

            cameraInstance.stop();

        } catch (error) {

            console.warn(
                "No se pudo detener MediaPipe:",
                error
            );
        }

        cameraInstance =
            null;
    }


    cameraPlaceholder.classList.remove(
        "hidden"
    );


    startCamera.disabled =
        false;


    stopCamera.disabled =
        true;


    actualizarEstadoCamara(
        "inactive",
        "Cámara detenida"
    );


    reconocimientoResultado(
        "neutral",
        "📷",
        "Cámara detenida",
        "Inicia la cámara cuando estés listo para practicar."
    );
}


/* =========================================
   CONFIGURAR CANVAS
========================================= */

function configurarCanvas() {

    const ancho =
        video.videoWidth ||
        640;


    const alto =
        video.videoHeight ||
        480;


    canvas.width =
        ancho;


    canvas.height =
        alto;
}


/* =========================================
   MEDIA PIPE
========================================= */

function iniciarMediaPipe() {

    if (
        typeof Hands === "undefined" ||
        typeof Camera === "undefined"
    ) {

        console.error(
            "MediaPipe no está disponible."
        );


        reconocimientoResultado(
            "warning",
            "⚠️",
            "Reconocimiento no disponible",
            "No se pudo cargar el sistema de detección de manos."
        );

        return;
    }


    const hands =
        new Hands({

            locateFile: file => {

                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

            }

        });


    hands.setOptions({

        maxNumHands: 1,

        modelComplexity: 1,

        minDetectionConfidence: 0.60,

        minTrackingConfidence: 0.60

    });


    hands.onResults(
        procesarResultados
    );


    cameraInstance =
        new Camera(
            video,
            {

                onFrame: async () => {

                    if (
                        video.readyState >= 2
                    ) {

                        await hands.send({
                            image: video
                        });
                    }

                },

                width: 1280,

                height: 720

            }
        );


    cameraInstance.start();
}


/* =========================================
   RESULTADOS DE MEDIAPIPE
========================================= */

function procesarResultados(
    results
) {

    configurarCanvas();


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const landmarks =
        results.multiHandLandmarks;


    if (
        !landmarks ||
        landmarks.length === 0
    ) {

        manosDetectadas =
            false;


        actualizarEstadoCamara(
            "active",
            "Cámara activa"
        );


        reconocimientoResultado(
            "active",
            "👋",
            "Busca tu posición",
            "Coloca tu mano dentro del área marcada."
        );


        return;
    }


    manosDetectadas =
        true;


    actualizarEstadoCamara(
        "detected",
        "Mano detectada"
    );


    landmarks.forEach(
        handLandmarks => {

            if (
                typeof drawConnectors ===
                "function"
            ) {

                drawConnectors(
                    ctx,
                    handLandmarks,
                    HAND_CONNECTIONS,
                    {
                        lineWidth: 3
                    }
                );

            }


            if (
                typeof drawLandmarks ===
                "function"
            ) {

                drawLandmarks(
                    ctx,
                    handLandmarks,
                    {
                        lineWidth: 1,

                        radius: 3
                    }
                );

            }

        }
    );


    reconocimientoResultado(
        "success",
        "✓",
        "Mano detectada",
        "Tu mano está dentro del área. Ya puedes registrar tu intento."
    );


    estadoEjercicio.textContent =
        "MANO DETECTADA";


    estadoEjercicio.className =
        "exercise-status success";


    siguienteEjercicio.disabled =
        !intentoRegistrado;
}


/* =========================================
   REGISTRAR INTENTO
========================================= */

function registrarIntento() {

    if (!practicaIniciada) {

        reconocimientoResultado(
            "warning",
            "📷",
            "Inicia la cámara",
            "Primero debes iniciar la cámara para practicar."
        );

        return;
    }


    if (!manosDetectadas) {

        reconocimientoResultado(
            "warning",
            "✋",
            "No detectamos tu mano",
            "Coloca tu mano dentro del área marcada e inténtalo de nuevo."
        );

        estadoEjercicio.textContent =
            "INTENTA DE NUEVO";

        estadoEjercicio.className =
            "exercise-status warning";

        return;
    }


    intentoRegistrado =
        true;


    siguienteEjercicio.disabled =
        false;


    estadoEjercicio.textContent =
        "INTENTO REGISTRADO";


    estadoEjercicio.className =
        "exercise-status success";


    reconocimientoResultado(
        "success",
        "✓",
        "¡Buen trabajo!",
        "Tu intento ha sido registrado. Puedes repetirlo o continuar."
    );
}


/* =========================================
   SIGUIENTE EJERCICIO
========================================= */

function avanzarEjercicio() {

    if (!intentoRegistrado) {

        registrarIntento();

        return;
    }


    if (
        ejercicioActual <
        ejercicios.length - 1
    ) {

        ejercicioActual++;

        detenerCamara();

        mostrarEjercicio(true);

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

        return;
    }


    finalizarPractica();
}


/* =========================================
   REPETIR EJERCICIO
========================================= */

function repetirEjercicioActual() {

    intentoRegistrado =
        false;


    manosDetectadas =
        false;


    siguienteEjercicio.disabled =
        true;


    estadoEjercicio.textContent =
        "PREPARADO";


    estadoEjercicio.className =
        "exercise-status neutral";


    reconocimientoResultado(
        "neutral",
        "🔄",
        "Ejercicio reiniciado",
        "Observa nuevamente la referencia y vuelve a intentarlo."
    );


    if (streamActivo) {

        reconocimientoResultado(
            "active",
            "📷",
            "Cámara lista",
            "Coloca tu mano dentro del área marcada."
        );

    }
}


/* =========================================
   REFERENCIA
========================================= */

function reproducirReferenciaActual() {

    reconocimientoResultado(
        "active",
        "👁️",
        "Observa la referencia",
        "Aquí conectaremos el video real de esta seña."
    );


    referenceVisual.classList.add(
        "reference-playing"
    );


    setTimeout(() => {

        referenceVisual.classList.remove(
            "reference-playing"
        );

    }, 900);
}


/* =========================================
   REINICIAR REFERENCIA
========================================= */

function repetirReferenciaActual() {

    reconocimientoResultado(
        "active",
        "↻",
        "Referencia reiniciada",
        "Puedes volver a observar el material antes de practicar."
    );
}


/* =========================================
   FINALIZAR PRÁCTICA
========================================= */

function finalizarPractica() {

    detenerCamara();


    const usuario =
        obtenerUsuarioActivo();


    if (usuario) {

        if (!usuario.progreso) {
            usuario.progreso = {};
        }


        usuario.progreso.practicaPresentaciones =
            100;


        usuario.progreso.practicaPresentacionesEjercicio =
            ejercicios.length - 1;


        guardarUsuarioActivo(
            usuario
        );
    }


    document.querySelector(
        ".practice-header"
    ).style.display =
        "none";


    document.querySelector(
        ".practice-progress"
    ).style.display =
        "none";


    document.querySelector(
        ".exercise-card"
    ).style.display =
        "none";


    ejerciciosCompletados.textContent =
        ejercicios.length;


    porcentajeFinal.textContent =
        "100%";


    completionScreen.classList.remove(
        "hidden"
    );
}


/* =========================================
   NAVEGACIÓN
========================================= */

function volverAtras() {

    detenerCamara();

    window.location.href =
        "presentaciones-cursos.html";
}


/* =========================================
   EVENTOS
========================================= */

startCamera.addEventListener(
    "click",
    iniciarCamara
);


stopCamera.addEventListener(
    "click",
    detenerCamara
);


repetirEjercicio.addEventListener(
    "click",
    repetirEjercicioActual
);


siguienteEjercicio.addEventListener(
    "click",
    avanzarEjercicio
);


reproducirReferencia.addEventListener(
    "click",
    reproducirReferenciaActual
);


repetirReferencia.addEventListener(
    "click",
    repetirReferenciaActual
);


volver.addEventListener(
    "click",
    volverAtras
);


volverCursos.addEventListener(
    "click",
    volverAtras
);


/* =========================================
   REGISTRAR EL PRIMER INTENTO
========================================= */

/*
    El botón "Siguiente" es el que usamos para
    avanzar, pero necesitamos un paso explícito
    para registrar la práctica.

    Para mantener la interfaz sencilla, hacemos
    que el primer clic en "Siguiente" registre el
    intento y el segundo avance.
*/


siguienteEjercicio.addEventListener(
    "click",
    function(event) {

        if (
            !intentoRegistrado
        ) {

            event.preventDefault();

            registrarIntento();

        }

    },
    true
);


/* =========================================
   INICIO
========================================= */

totalEjercicios.textContent =
    ejercicios.length;


mostrarEjercicio();


window.addEventListener(
    "beforeunload",
    detenerCamara
);