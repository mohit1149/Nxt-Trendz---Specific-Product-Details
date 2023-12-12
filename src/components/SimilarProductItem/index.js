// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachListProductDetails} = props
  const {imageUrl, price, rating, title, brand} = eachListProductDetails

  return (
    <li className="list-item">
      <img
        className="similar-product-card-image"
        src={imageUrl}
        alt="similar product"
      />
      <p className="similar-span-available">{title}</p>
      <p className="span-availables">by {brand}</p>
      <div className="small-containers">
        <p className="price-paragraph">Rs {price}/-</p>
        <div className="star-container">
          <p className="star-paragraph">{rating}</p>
          <img
            className="star-image"
            alt="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
