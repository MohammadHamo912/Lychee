import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/reviews';

export const getReviews = async (type, targetId) => {
    const res = await axios.get(`${BASE_URL}/${type}/${targetId}`);
    return res.data;
};

export const addReview = async (review) => {
    await axios.post(`${BASE_URL}/add`, review);
};

export const getUserReviews = async (userId) => {
    const res = await axios.get(`${BASE_URL}/user/${userId}`);
    return res.data;
};
export const deleteReview = async (reviewId) => {
    await axios.delete(`http://localhost:8081/api/reviews/${reviewId}`);
};

