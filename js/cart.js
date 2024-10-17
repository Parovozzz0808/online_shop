const cart = function () {
    const cartBtn = document.querySelector('.button-cart');
    const cart = document.getElementById('modal-cart');
    const goodsContainer = document.querySelector('.long-goods-list');
    const cartTable = document.querySelector('.cart-table__goods');
    const cartTotal = document.querySelector('.card-table__total');
    const modalForm = document.querySelector('.modal-form');


    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        
        const newCart = cart.filter(good => {
            return good.id !== id
        })

        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const plusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))

        const newCart = cart.map(good => {
                if (good.id === id) {
                    good.count++
                }    
                return good  
            })
            localStorage.setItem('cart', JSON.stringify(newCart))
            renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }     

    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))

        const newCart = cart.map(good => {
            if(good.count > 0) {
                if (good.id === id) {
                    good.count--
                } 
            } 
            return good  
        })

        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'))
        const clickedGood = goods.find(good => good.id === id)
        const cart = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []; 

        if(cart.some(good => good.id === clickedGood.id)) {
            cart.map(good => {
                if (good.id === clickedGood.id) {
                    good.count++
                }
                return good  
            })
        } else {
            clickedGood.count = 1
            cart.push(clickedGood)
        }

        localStorage.setItem('cart', JSON.stringify(cart))
    }

    const renderCartGoods = (goods) => {
        cartTable.innerHTML = ''
        
        goods.forEach(good => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${good.name}</td>
                <td>${good.price}$</td>
                <td><button class="cart-btn-minus"">-</button></td>
                <td>${good.count}</td>
                <td><button class=" cart-btn-plus"">+</button></td>
                <td>${+good.price * +good.count}$</td>
                <td><button class="cart-btn-delete"">x</button></td>
            `
            cartTable.append(tr)

            tr.addEventListener('click', (e) => {
                if(e.target.classList.contains('cart-btn-minus')) {
                    minusCartItem(good.id)
                } else if (e.target.classList.contains('cart-btn-plus')) {
                    plusCartItem(good.id)
                } else if (e.target.classList.contains('cart-btn-delete'))              
                    deleteCartItem(good.id)
            })

            cartTotal.innerHTML = `${goods.reduce((total, good) => {
                return total + +(good.price*good.count) 
            }, 0)}$`
        });

    }

    const sendForm = () => {
        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];
        
        const userName = modalForm[0].value;
        const userPhone = modalForm[1].value;
        
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cartArray,
                name: userName,
                phone: userPhone
            })
        }).then(() => {
            cart.style.display = '';
        }).then(() => {
            localStorage.removeItem('cart')
        })
    }

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault()
        sendForm()
        modalForm[0].value = '';
        modalForm[1].value = '';
        cartTotal.innerHTML = '';
    })

    cartBtn.addEventListener('click', function() {
        const cartArray = localStorage.getItem('cart') ? 
            JSON.parse(localStorage.getItem('cart')) : []
        
        renderCartGoods(cartArray)
        
        cart.style.display = 'flex';
    })

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.overlay') || (e.target.closest('.modal') && !e.target.classList.contains('modal-close'))) {
            return
        }
        cart.style.display = '';
    })

    if(goodsContainer) {
        goodsContainer.addEventListener('click', (e) => {
            if(e.target.closest('.add-to-cart')) {
                const buttonToCart = e.target.closest('.add-to-cart')
                const goodId = buttonToCart.dataset.id
                addToCart(goodId)
            }
        })
    }
};

cart();