/* eslint linebreak-style: ["error","windows"] */
/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */
/* eslint "no-alert": "off" */

const contentnode = document.getElementById('contents');

function ProductRow({ product }) {
  return (
    <tr>
      <td>{product.Name}</td>
      <td>
        $
        {product.Price}
      </td>
      <td>{product.Category}</td>
      <td><a href={product.Image} target="blank">View</a></td>
    </tr>
  );
}


class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.ProductAdd;
    const product = {
      Name: form.product.value,
      Price: form.price.value.slice(1),
      Category: form.category.value,
      Image: form.image.value,
    };
    const { createProduct } = this.props;
    createProduct(product);
    // clearing the form for next inout
    form.price.value = '$';
    form.product.value = '';
    form.image.value = '';
  }

  render() {
    return (
      <div>
        <form name="ProductAdd" onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="category">
              Category
              <select name="category">
                <option value="shirt">Shirts</option>
                <option value="jeans">Jeans</option>
                <option value="jacket">Jackets</option>
                <option value="sweater">Sweaters</option>
                <option value="accessories">Accessories</option>
              </select>
            </label>
            <br />
            <label htmlFor="price">
              Price Per Unit
              <input type="text" name="price" />
            </label>
            <br />
          </div>
          <div>
            <label htmlFor="product">
              Product
              <input type="text" name="product" />
            </label>
            <br />
            <label htmlFor="image">
              image
              <input type="text" name="image" />
            </label>
            <br />
          </div>
          <button type="submit">Add Product</button>
        </form>
      </div>

    );
  }
}

function ProductTable({ products }) {
  const productRows = products.map(product => <ProductRow key={product.id} product={product} />);
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {productRows}
      </tbody>
    </table>
  );
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
  }


  componentDidMount() {
    document.forms.ProductAdd.price.value = '$';
    this.loadData();
  }

  async loadData() {
    const query = `query{
            productList{
                id Name Price Image Category
            }
        }`;

    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    this.setState({ products: result.data.productList });
  }

  async createProduct(product) {
    const newProduct = product;
    // const newProducts = this.state.products.slice();
    // newProduct.id = this.state.products.length + 1;
    // newProducts.push(newProduct);
    // this.setState({ products: newProducts });
    const query = `mutation {
            productAdd(product:{
              Name: "${newProduct.Name}",
              Price: ${newProduct.Price},
              Image: "${newProduct.Image}",
              Category: ${newProduct.Category},
            }) {
              _id
            }
          }`;
    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    this.loadData();
  }

  render() {
    const { products } = this.state;
    return (
      <div>
        <h1>My Company Inventory</h1>
        <div>Showing all available products</div>
        <hr />
        <br />
        <ProductTable products={products} />
        <br />
        <div>Add a new product to inventory</div>
        <hr />
        <br />
        <ProductAdd createProduct={this.createProduct} />
      </div>
    );
  }
}

ReactDOM.render(<ProductList />, contentnode);
