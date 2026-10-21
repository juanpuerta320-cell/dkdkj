const formulario = document.getElementById("formulario");
const precioInput = document.getElementById("precio");
const cantidadInput = document.getElementById("cantidad");
const mensaje = document.getElementById("mensaje");

const ejemploOperacion = document.getElementById("ejemploOperacion");
const ejemploTotal = document.getElementById("ejemploTotal");
const textoTotal = document.getElementById("textoTotal");

const resultadoFinal = document.getElementById("resultadoFinal");
const totalFinal = document.getElementById("totalFinal");
const detalleFinal = document.getElementById("detalleFinal");
const listaPasos = document.getElementById("listaPasos");

// Formatear números según la convención colombiana.
function formatoPesos(valor) {
    return new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 2
    }).format(valor);
}

function dinero(valor) {
    return "$" + formatoPesos(valor);
}

function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.classList.toggle("error", esError);
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const precio = Number(precioInput.value);
    const cantidad = Number(cantidadInput.value);

    if (precioInput.value.trim() === "" ||
        !Number.isFinite(precio) || precio < 0) {
        mostrarMensaje("Ingresa un precio válido, mayor o igual a cero.", true);
        precioInput.focus();
        return;
    }

    if (cantidadInput.value.trim() === "" ||
        !Number.isSafeInteger(cantidad) || cantidad < 1) {
        mostrarMensaje("La cantidad debe ser un número entero mayor que cero.", true);
        cantidadInput.focus();
        return;
    }

    const total = precio * cantidad;

    if (!Number.isFinite(total)) {
        mostrarMensaje("El resultado es demasiado grande.", true);
        return;
    }

    ejemploOperacion.textContent =
        `${formatoPesos(precio)} × ${formatoPesos(cantidad)} = ${formatoPesos(total)}`;
    ejemploTotal.textContent = dinero(total);

    textoTotal.textContent =
        `${formatoPesos(precio)} × ${formatoPesos(cantidad)} = ${formatoPesos(total)}`;
    totalFinal.textContent = dinero(total);
    detalleFinal.textContent =
        `${formatoPesos(cantidad)} unidad(es) a ${dinero(precio)} cada una`;

    resultadoFinal.hidden = false;

    const tarjetas = listaPasos.querySelectorAll(".tarjeta");
    if (tarjetas[0]) actualizarEstado(tarjetas[0], "CALCULADO");
    if (tarjetas[1]) actualizarEstado(tarjetas[1], "CALCULADO");
    if (tarjetas[2]) actualizarEstado(tarjetas[2], "PENDIENTE");

    mostrarMensaje("¡Compra calculada correctamente!");

    resultadoFinal.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});

function actualizarEstado(tarjeta, texto) {
    const estado = tarjeta.querySelector(".estado");
    if (!estado) return;

    estado.textContent = texto;
    estado.classList.remove("pendiente", "calculado", "completado");

    if (texto === "COMPLETADO") {
        estado.classList.add("completado");
    } else if (texto === "CALCULADO") {
        estado.classList.add("calculado");
    } else {
        estado.classList.add("pendiente");
    }
}

listaPasos.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button");
    if (!boton) return;

    const tarjeta = boton.closest(".tarjeta");
    if (!tarjeta) return;

    if (boton.classList.contains("editar")) {
        const titulo = tarjeta.querySelector("h3");
        const descripcion = tarjeta.querySelector(".informacion p");

        const nuevoTitulo = prompt("Escribe el nuevo título:", titulo.textContent);
        if (nuevoTitulo === null) return;

        if (nuevoTitulo.trim() === "") {
            alert("El título no puede estar vacío.");
            return;
        }

        const nuevaDescripcion = prompt(
            "Escribe la nueva descripción:",
            descripcion.textContent
        );
        if (nuevaDescripcion === null) return;

        titulo.textContent = nuevoTitulo.trim();

        if (nuevaDescripcion.trim() !== "") {
            descripcion.textContent = nuevaDescripcion.trim();
        }
    }

    if (boton.classList.contains("eliminar")) {
        const confirmar = confirm("¿Estás seguro de que deseas eliminar este paso?");
        if (confirmar) tarjeta.remove();
    }
});

listaPasos.addEventListener("change", function (evento) {
    if (!evento.target.matches('input[type="checkbox"]')) return;

    const tarjeta = evento.target.closest(".tarjeta");
    if (!tarjeta) return;

    if (evento.target.checked) {
        tarjeta.classList.add("terminada");
        actualizarEstado(tarjeta, "COMPLETADO");
    } else {
        tarjeta.classList.remove("terminada");
        actualizarEstado(tarjeta, "PENDIENTE");
    }
});

precioInput.addEventListener("input", limpiarMensaje);
cantidadInput.addEventListener("input", limpiarMensaje);

function limpiarMensaje() {
    mensaje.textContent = "";
    mensaje.classList.remove("error");
}
