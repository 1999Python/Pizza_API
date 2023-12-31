document.addEventListener("alpine:init", () => {

    Alpine.data('pizzaCart', () => {

        return {

            title: "Pizza Cart API",
            pizzas: [],
            username: '1999Python',
            cartID: 'K8KTy7qwZM',
            cartPizzas: [],
            cartTotal: 0.00,
            payAmount: 0,
            message: '',

            getCart() {
                const getCartUrl = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartID}/get`
                return axios.get(getCartUrl)
                .then(result =>{
                    this.cartID = result.data.cart_code;
                })
            },
            addPizza(pizzaID) {

                return axios.post("https://pizza-api.projectcodex.net/api/pizza-cart/add", {
                    "cart_code": this.cartID,
                    "pizza_id": pizzaID
                })
            },
            removePizza(pizzaID) {

                return axios.post(" https://pizza-api.projectcodex.net/api/pizza-cart/remove", {
                    "cart_code": this.cartID,
                    "pizza_id": pizzaID
                })
            },

            pay(amount) {
                return axios.post("https://pizza-api.projectcodex.net/api/pizza-cart/pay", {
                    "cart_code": this.cartID,
                    amount
                })

            },

            showCartData() {

                this.getCart().then(result => {
                    const cartData = result.data;
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                });
            },


            init() {
                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        this.pizzas = result.data.pizzas
                    });

                this.getCart().then(result => {

                    const cartData = result.data;

                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total;

                })
                if (!this.cartID) {
                    this.createCart()
                        .then(() => {
                           
                            this.showCartData();
                        })
                }
            },

            addPizzasToCart(pizzaID) {

                this.addPizza(pizzaID)
                    .then(() => {
                        this.showCartData();
                    })
            },

            removePizzaFromCart(pizzaID) {
                this.removePizza(pizzaID)
                    .then(() => {
                        this.showCartData();
                    })
            },
            payForCart() {
                this
                    .pay(this.paymentAmount)
                    .then(result => {

                        if (result.data.status == 'failure') {
                            this.message = result.data.message;
                            setTimeout(() => this.message = '', 3000);

                        } else {
                            this.message = 'Payment recieved!';

                            setTimeout(() => {
                                this.message = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0.00;
                                this.cartID = '';
                                this.createCart ();
                            }, 3000);
                        }

                    })
            },


        }
    });
});