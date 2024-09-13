import React from 'react';
import StarRatings from 'react-star-ratings';
import PropTypes from 'prop-types';

const StarRatingsComponent = ({
    rating,
    changeRating,
    numberOfStars = 5,
    starDimension = "30px",
    starSpacing = "5px",
    starRatedColor = "gold"
}) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <StarRatings
                rating={rating}
                starRatedColor={starRatedColor}
                changeRating={changeRating}
                numberOfStars={numberOfStars}
                name='rating'
                starDimension={starDimension}
                starSpacing={starSpacing}
            />
        </div>
    );
};

StarRatingsComponent.propTypes = {
    rating: PropTypes.number.isRequired,
    changeRating: PropTypes.func.isRequired,
    numberOfStars: PropTypes.number,
    starDimension: PropTypes.string,
    starSpacing: PropTypes.string,
    starRatedColor: PropTypes.string
};

export default StarRatingsComponent;
