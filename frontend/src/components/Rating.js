function Rating(props) {
    const { rating, numReviews , caption} = props;
    return (
        <div className="rating">
            <span>
            {/*  //i for icon  fas fa-star for star icon
            // iske liye index.html me https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/all.min.css link add ki h*/}
                <i className={rating >=1? "fas fa-star" : rating >= 0.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
                <i className={rating >=2? "fas fa-star" : rating >= 1.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
                <i className={rating >=3? "fas fa-star" : rating >= 2.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
                <i className={rating >=4? "fas fa-star" : rating >= 3.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
                <i className={rating >=5? "fas fa-star" : rating >= 4.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>  
            </span>
          {
            caption ?
            <span>{caption}</span>
            :
            <span>{numReviews} reviews</span>
          }
            </div>
    );
}
export default Rating;