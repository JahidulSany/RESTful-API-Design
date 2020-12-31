const express = require('express');
const app = express();

const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const products = [
    {
        id: '1',
        name: 'Mango',
        price: 123
    },
    {
        id: '2',
        name: 'Banana',
        price: 12
    }
];

// Show all products
app.get('/api/products/', (req, res) => {
    return res.json(products);
});

// Show a specific product
app.get('/api/products/:id', (req, res) => {
    const {id} = req.params; // const id = req.params.id Object Destructuing
    const product = products.find(prod => prod.id === id);
    if(!product) {
        return res.status(404).json({
            error: 'No product found with this ID'
        });
    }
    return res.json(product);
});


// Middleware
app.use(express.json());

// Insert a product
app.post('/api/products', (req, res) => {

    // Error Handling with Joi
    const {error} = validation(req.body);
    if (error) {
       return res.status(400).json({
           message: error.details[0].message 
       })
    };

    const product = {
        id: uuidv4(),
        name: req.body.name,
        price: req.body.price
    }
    products.push(product);
    return res.json(product);
})

// Update a specific product using PUT method
app.put('/api/products/:id', (req, res) => {

    const { error } = validation(req.body);
    if(error){
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    const index = products.findIndex(prod => prod.id === req.params.id);

    if(index === -1){
        return res.status(404).json({
            message: 'Product is not found with this ID'
        });
    }

    products[index].name = req.body.name;
    products[index].price = req.body.price;

    return res.json({
        product: products[index]
    });

});


// Update a specific product using PATCH method
app.patch('/api/products/:id', (req, res) => {

    // If product exists
    const index = products.findIndex(prod => prod.id === req.params.id);
    if(index === -1){
        return res.status(404).json({
            message: 'Product is not found with this ID'
        });
    }

    let updatedProduct = {
        ...products[index],
        ...req.body
    }

    products[index] = updatedProduct;
  
    return res.json(updatedProduct);
});

// DELETE a specific product
app.delete('/api/products/:id', (req, res) => {

    // If product exists
    const product = products.find(prod => prod.id === req.params.id);
    if(!product){
        return res.status(404).json({
            message: 'Product is not found with this ID'
        });
    }

    const index = products.findIndex(prod => prod.id === req.params.id);

    products.splice(index, 1);
  
    return res.json(product);
});

// DELETE all products
app.delete('/api/products', (req, res) => {
    products.splice(0);
    return res.json(products);
});


// Valodation FUNCTION
function validation(body){
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        price: Joi.number().required()
    });

    return schema.validate(body);
}


app.listen(3000, () => console.log('Server is running at port 3000'));