// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetailsData: {},
    apiStatus: apiStatusConstants.initial,
    currentValue: 1,
    similarDetailsData: [],
  }

  componentDidMount() {
    this.getProductDetailsData()
  }

  getProductDetailsData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: Math.floor(data.rating),
        availability: data.availability,
      }
      const similarUpdatedData = data.similar_products.map(
        eachSimilarProduct => ({
          id: eachSimilarProduct.id,
          imageUrl: eachSimilarProduct.image_url,
          title: eachSimilarProduct.title,
          style: eachSimilarProduct.style,
          price: eachSimilarProduct.price,
          description: eachSimilarProduct.description,
          brand: eachSimilarProduct.brand,
          totalReviews: eachSimilarProduct.total_reviews,
          rating: eachSimilarProduct.rating,
          availability: eachSimilarProduct.availability,
        }),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetailsData: updatedData,
        similarDetailsData: similarUpdatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickIncrease = () => {
    this.setState(prevState => ({
      currentValue: prevState.currentValue + 1,
    }))
  }

  onClickDecrease = () => {
    const {currentValue} = this.state
    if (currentValue > 1) {
      this.setState(prevState => ({
        currentValue: prevState.currentValue - 1,
      }))
    }
  }

  renderProductsItemDetails = () => {
    const {productDetailsData, currentValue, similarDetailsData} = this.state
    const {
      title,
      imageUrl,
      rating,
      availability,
      brand,
      totalReviews,
      price,
      description,
    } = productDetailsData

    return (
      <>
        <div className="product-detail-bg-container">
          <img className="product-big-pic" src={imageUrl} alt="product" />
          <div className="product-detail-right-container">
            <h1 className="blog-details-title">{title}</h1>
            <p className="price-paragraph">Rs {price}/-</p>
            <div className="small-container">
              <div className="star-container">
                <p className="star-paragraph">{rating}</p>
                <img
                  className="star-image"
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </div>
              <p className="review-paragraph">{totalReviews} Reviews</p>
            </div>

            <p className="span-availables">{description}</p>
            <p className="available-paragraph">Available: {availability}</p>
            <p className="available-paragraph">Brand: {brand}</p>
            <hr className="horizontal-line" />
            <div className="button-container">
              <button
                className="increase-button"
                type="button"
                onClick={this.onClickIncrease}
                data-testid="plus"
              >
                <BsPlusSquare />.
              </button>
              <p className="current-value-paragraph">{currentValue}</p>
              <button
                className="decrease-button"
                type="button"
                onClick={this.onClickDecrease}
                data-testid="minus"
              >
                <BsDashSquare />.
              </button>
            </div>
            <Link to="/cart">
              <button className="add-to-button" type="button">
                ADD TO CART
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-bottom-container">
          <h1 className="similar-product-heading">Similar Products</h1>
          <ul className="unOrder-similar-product-list">
            {similarDetailsData.map(eachListProduct => (
              <SimilarProductItem
                key={eachListProduct.id}
                eachListProductDetails={eachListProduct}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductsFailureView = () => (
    <div className="products-error-view-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button className="continue-shopping-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderAllProductsItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsItemDetails()
      case apiStatusConstants.failure:
        return this.renderProductsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="blog-container">
        <Header />
        {this.renderAllProductsItemDetails()}
      </div>
    )
  }
}

export default ProductItemDetails
