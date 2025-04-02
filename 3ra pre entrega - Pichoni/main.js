const Producto = function(nombre, marca, precio, stock, id) {
    this.nombre = nombre;
    this.marca = marca;
    this.precio = precio;
    this.stock = stock;
    this.id = id;
};
let listaProductos = JSON.parse(localStorage.getItem('productos')) || [
    new Producto("Placa de Video", "Nvidia", 1300000, 5, "VGA200900"),
    new Producto("Monitor Samsung", "Samsung", 175000, 2, "SAM170654"),
    new Producto("Teclado Logitech", "Logitech", 80000, 20, "LOG13965"),
    new Producto("Mouse Ryzer", "Ryzer", 120000, 30, "RZ100983"),
    new Producto("Auricular Logitech", "Logitech", 240000, 15, "200900")
];
function controlStock() {
    const productosUl = document.getElementById('productos');
    productosUl.innerHTML = '';

    listaProductos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = `Nombre: ${producto.nombre}, Marca: ${producto.marca}, Precio: ${producto.precio}, Stock: ${producto.stock}, ID: ${producto.id}`;
        productosUl.appendChild(li);
    });
    console.table(listaProductos);
}
function agregarProducto() {
    const nombre = document.getElementById('nombreProducto').value;
    const marca = document.getElementById('marcaProducto').value;
    const precio = parseFloat(document.getElementById('precioProducto').value);
    const stock = parseInt(document.getElementById('stockProducto').value);
    const id = document.getElementById('idProducto').value;

    if (isNaN(precio) || isNaN(stock) || nombre === '' || marca === '' || id === '') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese datos válidos.'
        });
        return;
    }
    const productoNuevo = new Producto(nombre, marca, precio, stock, id);
    listaProductos.push(productoNuevo);
    localStorage.setItem('productos', JSON.stringify(listaProductos));

    controlStock();
    document.getElementById('formulario').reset();
    Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        showConfirmButton: false,
        timer: 1500
    });
    console.table(listaProductos);  
}
function modificarEliminarProducto() {
    Swal.fire({
        title: 'Ingrese el ID del producto:',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Buscar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const id = result.value;
            const productoIndex = listaProductos.findIndex(producto => producto.id === id);
            if (productoIndex !== -1) {
                Swal.fire({
                    title: '¿Qué desea hacer?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Modificar',
                    denyButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        modificarProducto(productoIndex);
                    } else if (result.isDenied) {
                        eliminarProducto(productoIndex);
                    }
                });
            } else {
                Swal.fire('Producto no encontrado.');
            }
        }
    });
    console.table(listaProductos);
}
function modificarProducto(editProducto) {
    Swal.fire({
        title: 'Modificar producto:',
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${listaProductos[editProducto].nombre}">
            <input id="swal-input2" class="swal2-input" placeholder="Marca" value="${listaProductos[editProducto].marca}">
            <input id="swal-input3" class="swal2-input" placeholder="Precio" type="number" value="${listaProductos[editProducto].precio}">
            <input id="swal-input4" class="swal2-input" placeholder="Stock" type="number" value="${listaProductos[editProducto].stock}">
            <input id="swal-input5" class="swal2-input" placeholder="ID" value="${listaProductos[editProducto].id}">
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                parseFloat(document.getElementById('swal-input3').value),
                parseInt(document.getElementById('swal-input4').value),
                document.getElementById('swal-input5').value
            ];
        }
    }).then((result) => {
        if (result.isConfirmed) {
            listaProductos[editProducto].nombre = result.value[0];
            listaProductos[editProducto].marca = result.value[1];
            listaProductos[editProducto].precio = result.value[2];
            listaProductos[editProducto].stock = result.value[3];
            listaProductos[editProducto].id = result.value[4];

            localStorage.setItem('productos', JSON.stringify(listaProductos));
            controlStock();
            Swal.fire('Producto modificado.', '', 'success');
        }
    });
    console.table(listaProductos);
}
function eliminarProducto(deleteProducto) {
    Swal.fire({
        title: '¿Está seguro de eliminar este producto?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            listaProductos.splice(deleteProducto, 1);
            localStorage.setItem('productos', JSON.stringify(listaProductos));
            controlStock();
            Swal.fire('Producto eliminado.', '', 'success');
        }
    });
    console.table(listaProductos);
}
function buscarProducto() {
    Swal.fire({
        title: 'Ingrese el nombre del producto:',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Buscar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const nombre = result.value.toLowerCase();
            const resultados = listaProductos.filter(producto => producto.nombre.toLowerCase().includes(nombre));

            if (resultados.length > 0) {
                let mensaje = 'Productos encontrados:\n\n';
                resultados.forEach(producto => {
                    mensaje += `Nombre: ${producto.nombre}, Marca: ${producto.marca}, Precio: ${producto.precio}, Stock: ${producto.stock}, ID: ${producto.id}\n`;
                });
                Swal.fire('Resultados de la búsqueda', mensaje, 'success');
            } else {
                Swal.fire('No se encontraron productos con ese nombre.', '', 'info');
            }
        }
    });
    console.table(listaProductos);
}

document.getElementById('botonAgregar').addEventListener('click', agregarProducto);
document.getElementById('editarOeliminar').addEventListener('click', modificarEliminarProducto);
document.getElementById('buscarProducto').addEventListener('click', buscarProducto);

controlStock();