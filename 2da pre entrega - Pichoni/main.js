const Producto = function(nombre, precio, stock, id) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.id = id;
};

let producto1 = new Producto("Placa de Video", 1300000, 5, "VGA200900");
let producto2 = new Producto("Monitor Samsung", 175000, 2, "SAM170654");
let producto3 = new Producto("Teclado Logitech", 80000, 20, "LOG13965");
let producto4 = new Producto("Mouse Ryzer", 120000, 30, "RZ100983");
let producto5 = new Producto("Auricular Logitech", 240000, 15, "200900");

const lista = [producto1, producto2, producto3, producto4, producto5];

function controlStock() {
    let opcion = prompt("¿Qué desea hacer? 1) Buscar productos 2) Agregar un nuevo producto");

    switch (opcion) {
        case "1":
            filtrarProductos(lista);
            break;
        case "2":
            agregarProducto(lista);
            break;
        default:
            alert("No elegiste ninguna de las opciones");
    }
}

function filtrarProductos() {
    let palabraClave = prompt("Ingrese el producto que busca:").trim().toUpperCase();
    let resultado = lista.filter(producto => producto.nombre.toUpperCase().includes(palabraClave));

    if (resultado.length > 0) {
        console.table(resultado);
    } 
    else {
        alert("No se encontraron coincidencias.");
    }
}

function agregarProducto() {
    let nombre = prompt("Ingrese el nombre del producto:").trim();
    let precio = parseFloat(prompt("Ingrese el precio del producto:"));
    let stock = parseInt(prompt("Ingrese el stock del producto:"));
    let id = prompt("Ingrese el ID del producto:");

    if (isNaN(precio) || isNaN(stock) || nombre === "" || id === "") {
        alert("Por favor, ingrese datos válidos.");
        return;
    }

    let productoNuevo = new Producto(nombre, precio, stock, id);
    lista.push(productoNuevo);
    console.table(lista);
    
}
controlStock();