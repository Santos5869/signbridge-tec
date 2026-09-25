/* ==========================================
   SIGNBRIDGE
   TRANSICIONES ENTRE PÁGINAS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /*
       ENTRADA
       La página comienza ligeramente desplazada
       y vuelve suavemente a su posición.
    */

    document.body.style.opacity = "0";
    document.body.style.transform = "translateY(10px)";

    requestAnimationFrame(() => {

        document.body.style.transition =
            "opacity 0.4s ease, transform 0.4s ease";

        document.body.style.opacity = "1";
        document.body.style.transform = "translateY(0)";

    });


    /*
       SALIDA
       Capturamos enlaces y botones que llevan
       a otra página.
    */

    const elementos = document.querySelectorAll(
        "a[href], button"
    );


    elementos.forEach(elemento => {

        elemento.addEventListener("click", function (evento) {

            let destino = null;


            /* ===============================
               ENLACES <a>
            =============================== */

            if (this.tagName === "A") {

                destino = this.getAttribute("href");

            }


            /* ===============================
               BOTONES
            =============================== */

            if (this.tagName === "BUTTON") {

                const onclick = this.getAttribute("onclick");

                if (onclick) {

                    const resultado =
                        onclick.match(
                            /(?:href\s*=\s*|location\.href\s*=\s*)['"]([^'"]+)['"]/
                        );

                    if (resultado) {
                        destino = resultado[1];
                    }

                }

            }


            /*
               No aplicar transición a:
               #, javascript, enlaces externos
            */

            if (
                !destino ||
                destino === "#" ||
                destino.startsWith("#") ||
                destino.startsWith("javascript:") ||
                destino.startsWith("http") ||
                destino.startsWith("mailto:")
            ) {
                return;
            }


            /*
               Evitar doble ejecución
            */

            if (
                document.body.classList.contains("page-exit")
            ) {
                return;
            }


            evento.preventDefault();


            /*
               ACTIVAR SALIDA
            */

            document.body.classList.add("page-exit");


            /*
               Esperar a que termine la animación
            */

            setTimeout(() => {

                window.location.href = destino;

            }, 350);

        });

    });

});