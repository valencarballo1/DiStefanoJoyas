const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();

const pintarCarrito = () =>{
    console.log(carrito)
    items.innerHTML = "";
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector("th").textContent = producto.id,
        templateCarrito.querySelectorAll("td")[0].textContent = producto.name,
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad,
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id,
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id,
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);
    

    pintarFooter()

    

    localStorage.setItem("carrito", JSON.stringify(carrito))
}