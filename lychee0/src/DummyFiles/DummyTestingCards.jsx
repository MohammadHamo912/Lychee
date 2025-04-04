import React from "react";
import TestingItemCard from "./TestingItemCard";
import TestingProductCard from "./TestingReusableCard";
import dummyProducts from "../Data/dummyProducts";
const DummyTestingCards = () => {
  return (
    <div
      style={{
        padding: "150px 400px",
      }}
    >
      <div style={{ gap: "150px", display: "flex", border: "1px solid black" }}>
        <div style={{ border: "1px solid red" }}>
          <TestingItemCard item={dummyProducts[4]} />
        </div>
        <div style={{ border: "1px solid red" }}>
          <TestingProductCard product={dummyProducts[0]} />
        </div>
      </div>{" "}
    </div>
  );
};
export default DummyTestingCards;
