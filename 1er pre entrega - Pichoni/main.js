
function controlStock() {
    let stock = 0;
    let continuar = true;

do {
    let producto = prompt("Ingrese el nombre del producto que desea agregar al stock:");    
    if (producto === null || producto.trim() === ""){
        alert("No se ha ingresado ningun producto!"); 
        break;
    }

    let idproducto = prompt("Ingrese el ID del producto:");
        if (idproducto === null || idproducto.trim() === "") {
            alert("No se ha ingresado ningún ID!");
            break;
        }

    if (producto.toLowerCase() === "placa de video") {
        stock++;
        alert("Se agrego una placa de video al stock! Stock actual: " + stock);
    } else {
        alert("Agregaste un nuevo producto al stock!");
    }

    let respuesta = prompt("¿Quieres ingresar otro producto? (si o no)");
    if (respuesta === null || respuesta.toLowerCase() !== "si") {
        continuar = false;
    }
    } 

while (continuar);

    alert("Stock de placas de video: " + stock);
}

controlStock();