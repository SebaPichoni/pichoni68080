const Producto = function(nombre, marca, precio, stock, id) {
  this.nombre = nombre;
  this.marca = marca;
  this.precio = precio;
  this.stock = stock;
  this.id = id;
};

let listaProductos = [];

function cargarDatosDeProductos() {
  fetch("https://fakestoreapi.com/products/category/electronics")
    .then(response => response.json())
    .then(data => {
      listaProductos = data.map(item => {
        return new Producto(
          item.title,
          "",
          item.price,
          Math.floor(Math.random() * 50) + 5,
          String(item.id)
        );
      });
      controlStock();
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
      const storedProductos = localStorage.getItem('productos');
      if (storedProductos) {
        listaProductos = JSON.parse(storedProductos);
        controlStock();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar productos',
          text: 'Hubo un problema al obtener los datos. Por favor, intentá recargar la página.'
        });
      }
    });
}

function controlStock() {
  const productosUl = document.getElementById('productos');
  productosUl.innerHTML = '';

  listaProductos.forEach(producto => {
    const li = document.createElement('li');
    li.textContent = `Nombre: ${producto.nombre}, Marca: ${producto.marca}, Precio: $${producto.precio.toFixed(2)}, Stock: ${producto.stock}, ID: ${producto.id}`;
    productosUl.appendChild(li);
  });

  console.table(listaProductos);
}

function agregarProducto() {
  const nombre = document.getElementById('nombreProducto').value;
  const marca = document.getElementById('marcaProducto').value;
  const precio = parseFloat(document.getElementById('precioProducto').value);
  const stock = parseInt(document.getElementById('stockProducto').value);

  if (isNaN(precio) || isNaN(stock) || nombre === '' || marca === '') {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Por favor, ingrese datos válidos.' });
    return;
  }

  const nuevoProductoParaAPI = {
    title: nombre,
    price: precio,
    description: `${marca} ${nombre}`,
    category: 'electronics'
  };

  fetch("https://fakestoreapi.com/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevoProductoParaAPI)
  })
  .then(response => response.json())
  .then(data => {
    listaProductos.push(new Producto(data.title, marca, data.price, stock, String(data.id)));
    localStorage.setItem('productos', JSON.stringify(listaProductos));
    controlStock();
    document.getElementById('formulario').reset();
    Swal.fire({ icon: 'success', title: 'Producto agregado', showConfirmButton: false, timer: 1500 });
  })
  .catch(error => {
    console.error("Error al agregar producto:", error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo agregar el producto.' });
  });
}

function modificarProducto(editProductoIndex) {
  Swal.fire({
    title: 'Modificar producto:',
    html: `
      <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${listaProductos[editProductoIndex].nombre}">
      <input id="swal-input2" class="swal2-input" placeholder="Marca" value="${listaProductos[editProductoIndex].marca}">
      <input id="swal-input3" class="swal2-input" placeholder="Precio" type="number" value="${listaProductos[editProductoIndex].precio}">
      <input id="swal-input4" class="swal2-input" placeholder="Stock" type="number" value="${listaProductos[editProductoIndex].stock}">
      <input id="swal-input5" class="swal2-input" placeholder="ID" value="${listaProductos[editProductoIndex].id}" readonly>
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
      const [nombre, marca, precio, stock, id] = result.value;
      const productoActualizadoParaAPI = {
        title: nombre,
        price: precio,
        description: `${marca} ${nombre}`,
        category: 'electronics'
      };

      fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productoActualizadoParaAPI)
      })
      .then(response => response.json())
      .then(data => {
        listaProductos[editProductoIndex].nombre = data.title;
        listaProductos[editProductoIndex].marca = marca;
        listaProductos[editProductoIndex].precio = data.price;
        listaProductos[editProductoIndex].stock = stock;
        localStorage.setItem('productos', JSON.stringify(listaProductos));
        controlStock();
        Swal.fire('Producto modificado.', '', 'success');
      })
      .catch(error => {
        console.error("Error al modificar producto:", error);
        Swal.fire('Error al modificar el producto.', '', 'error');
      });
    }
  });
}

function eliminarProducto(deleteProductoIndex) {
  Swal.fire({
    title: '¿Está seguro de eliminar este producto?',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      const idAEliminar = listaProductos[deleteProductoIndex].id;

      fetch(`https://fakestoreapi.com/products/${idAEliminar}`, {
        method: "DELETE"
      })
      .then(response => response.json())
      .then(data => {
        listaProductos.splice(deleteProductoIndex, 1);
        localStorage.setItem('productos', JSON.stringify(listaProductos));
        controlStock();
        Swal.fire('Producto eliminado.', '', 'success');
      })
      .catch(error => {
        console.error("Error al eliminar producto:", error);
        Swal.fire('Error al eliminar el producto.', '', 'error');
      });
    }
  });
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
      const idIngresado = result.value.toLowerCase();
      const productoIndex = listaProductos.findIndex(producto => producto.id.toLowerCase() === idIngresado);

      if (productoIndex !== -1) {
        Swal.fire({
          title: '¿Qué querés hacer?',
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
          mensaje += `Nombre: ${producto.nombre}, Marca: ${producto.marca}, Precio: $${producto.precio.toFixed(2)}, Stock: ${producto.stock}, ID: ${producto.id}\n`;
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

cargarDatosDeProductos();