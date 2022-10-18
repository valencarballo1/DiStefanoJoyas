
const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};


document.addEventListener("DOMContentLoaded", () =>{
    fetchData()
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        pintarCarrito()
    }
})

cards.addEventListener("click", e =>{
    addCarrito(e)
})

items.addEventListener("click", e => {
    btnAccion(e);
})

const fetchData = async () =>{
    try{
        const res = await fetch ("DiStefanoJoyas/data.json");
        const data = await res.json();
        const resultado = data.filter(tipoData => {
            if (tipoData.tipo == "DIJES"){
                return true;
            }
        })
        mostrarProducto(resultado);

    } catch (error){
        console.log(error)
    }
}


const mostrarProducto = data => {
    data.forEach(producto => {
        templateCard.querySelector("h6").textContent = producto.name;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.img);
        templateCard.querySelector("#buttonComprar").dataset.id = producto.id;

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = e =>{
    if (e.target.classList.contains("btn-dark")){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation();
}

const setCarrito = objeto =>{
    const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        name: objeto.querySelector("h6").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1,
        
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad +1;
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
}



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
    cantidadCarro()
}

const pintarFooter = () =>{
    footer.innerHTML = "";
    if (Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById("vaciar-carrito");
    btnVaciar.addEventListener("click", () =>{
        carrito = {};
        pintarCarrito()
    })

    const btnFinalizar = document.getElementById("finalizar-carrito");
    btnFinalizar.addEventListener("click", () =>{
        Total = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);
        if (Total > 0){
            Swal.fire(
                'Compra finalizada!',
                'El monto total es de: $' + Total,
                'success',
                enviarMensajeWpp()
            )
            carrito = {};
            pintarCarrito();
            localStorage.setItem('carrito', JSON.stringify(carrito))
            // window.location.assign(`http://127.0.0.1:5500/index.html`)
        ;            
        } else{
            Swal.fire({
                icon: 'error',
                title: 'Algo salio mal',
                text: 'No seleccionaste ningun producto!',
              })
        }
        pintarCarrito()
    })
}

const btnAccion = e =>{
    if (e.target.classList.contains("btn-info")){
        carrito[e.target.dataset.id];
        const producto = carrito[e.target.dataset.id];
        producto.cantidad +=1;
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    };

    if (e.target.classList.contains("btn-danger")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad -=1;
        if (producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()

}

const cantidadCarro = () =>{
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    document.querySelector(".button-checkout").innerHTML = `${nCantidad}`
}

enviarMensajeWpp = () =>{
    // let mensaje = JSON.parse(carrito);
    // let mensaje = JSON.stringify(carrito[3], null, 2);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);
    window.location.assign(`//api.whatsapp.com/send?phone=5491169960309&text=${JSON.stringify(carrito)}%20, El precio total es de:%20 ${nPrecio}`)
}
