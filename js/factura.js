let productos = [];
const url = "api/productos.json";

// Variante de función getJSONData. Estaban utilizando fetch en crudo, por eso
//animé a reutilizar código.
let obtener = (url) => {
  var resultado = {};
  return fetch(url)
    .then((respuesta) => {
      if (respuesta.ok) {
        return respuesta.json();
      } else {
        throw Error(respuesta.statusText);
      }
    })
    .then((respuesta) => {
      resultado.status = "ok";
      resultado.data = respuesta;

      return resultado;
    })
    .catch((error) => {
      resultado.status = "error";
      resultado.data = error;

      return resultado;
    });
};
//Función que carga los productos a la lista desplegable
function cargarProductos(listaProductos) {
  let producto = document.getElementById("producto");
  for (let elemento of listaProductos) {
    producto.innerHTML += `<option value= ${elemento.producto} -  ${elemento.precio}>${elemento.producto} -  ${elemento.precio} </option>`;
  }
}
function recalcular() {
  let cantidades = document.getElementsByClassName("cant");
  let precios = document.getElementsByClassName("precio");
  let resultados = document.getElementsByClassName("res");
  var total = 0;
  console.log("Total es: " + typeof total);
  for (let i = 0; i < precios.length; i++) {
    total += parseFloat(
      parseFloat(cantidades[i].value) * parseFloat(precios[i].innerHTML)
    );

    resultados[i].innerHTML = parseFloat(
      parseFloat(cantidades[i].value) * parseFloat(precios[i].innerHTML)
    ).toFixed(2);
    console.log("Peero el programa dice que total ahora es: " + typeof total);
  }
  console.log("Total ahora es:" + typeof total);
  document.getElementById("total").innerHTML = "$ " + total.toFixed(2);
}
function agregarALista() {
  let cant = parseInt(document.getElementById("cantidad").value);
  let lista = document.getElementById("lista"); //tomo el tbody
  let index = document.getElementById("producto").selectedIndex; //tomo el índice
  //del producto seleccionado.
  lista.innerHTML += `<tr><td class = "articulo">${
    productos[index].producto
  } </td><td>$ <span class="precio">${
    productos[index].precio
  }</span></td><td><input type="number" class="form-control cant" value="${cant}" onchange="recalcular();" ></td><td>$ <span class="res">${(
    cant * productos[index].precio
  ).toFixed(
    2
  )}</span></td><td><img src="/img/borrar.png" width="20"><span></td></tr>`;
  recalcular();
}

function imprimirTicket() {
  let doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(60, 20, 'Ferretería "267"');
  doc.line(10, 25, 200, 25);

  let productos = document.getElementsByClassName("articulo");
  let cantidades = document.getElementsByClassName("cant");
  let precios = document.getElementsByClassName("precio");
  let resultados = document.getElementsByClassName("res");
  let total = document.getElementById("total");

  console.log(productos[0].innerText);
  console.log(cantidades[0].value);
  console.log(precios[0].innerText);
  console.log(resultados[0].innerText);

  doc.setFontSize(12);
  doc.text(20, 35, "Articulo");
    doc.text(140, 35, "Cant");
    doc.text(160, 35, "Precio");
    doc.text(180, 35, "Total");
    doc.line(10,40,200,40);

  doc.setFontSize(10);
  let height = 55;
  for(let i =0; i < productos.length; i++){
    doc.text(20, height, productos[i].innerText);
    doc.text(140, height, cantidades[i].value);
    doc.text(160, height, precios[i].innerText);
    doc.text(180, height, resultados[i].innerText);
    doc.line(10,height+5,200,height+5);
    height = height + 15;
  }

  doc.text(20, height, "Total: " + total.innerText);

  /*Completar */

  doc.save(cliente + ".pdf");
}

document.addEventListener("DOMContentLoaded", () => {
  obtener(url).then((resultado) => {
    //Agrego los productos a la lista
    if (resultado.status === "ok") {
      console.log(resultado.data);
      productos = resultado.data;
      cargarProductos(productos);
      console.log(productos);
    }
  });
  let btnAgregar = document.getElementById("agregar");
  btnAgregar.addEventListener("click", () => {
    agregarALista();
    //alert( document.getElementById('producto').selectedIndex);
  });

  let btnImprimir = document.getElementById("imp");
  btnImprimir.addEventListener("click", () => {
    imprimirTicket();
  });
});
