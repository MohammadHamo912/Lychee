import React from 'react';
import '../ComponentsCss/ShopCard.css';
import PropTypes from 'prop-types';

const ShopCard = ({ shop, onViewShop }) => {
    // Destructure shop details
    const { id, name, logoUrl } = shop;

    return (
        <div className="shop-card">
            <img className="shop-card-logo" src={logoUrl} alt={`Logo of ${name}`} />
            <div className="shop-card-body">
                <h3 className="shop-card-title">{name}</h3>
                <button className="shop-card-button" onClick={() => onViewShop(shop)}>
                    Browse Shop
                </button>
            </div>
        </div>
    );
};

ShopCard.propTypes = {
    shop: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name: PropTypes.string.isRequired,
        logoUrl: PropTypes.string.isRequired,
    }).isRequired,
    onViewShop: PropTypes.func.isRequired,
};

export default ShopCard;
