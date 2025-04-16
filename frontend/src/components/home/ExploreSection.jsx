import { useEffect, useRef } from "react";
import { useSpring, useMotionValue } from "framer-motion";

const Counter = ({ end = 1000, caption }) => {
  const count = useMotionValue(0);
  const spring = useSpring(count, { duration: 2 });
  const ref = useRef();

  useEffect(() => {
    count.set(end); // Triggers spring to animate
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
    return () => unsubscribe();
  }, [end]);

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <div
        ref={ref}
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#4ade80",
          minHeight: "2.5rem",
        }}
      >
        0
      </div>
      <div style={{ marginTop: "0.5rem", fontSize: "1rem", color: "#aaa" }}>
        {caption}
      </div>
    </div>
  );
};


const ExploreSection = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        padding: "4rem 2rem",
        backgroundColor: "#0f172a",
        color: "white",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left Side: Heading */}
      <div style={{ flex: "1 1 400px", paddingRight: "2rem", minWidth: "300px" }} className="overflow-hidden">
        <h1 style={{ fontSize: "2.5rem", lineHeight: "1.2" }}>
          Explore millions of offerings tailored to your business needs
        </h1>
      </div>

      {/* Right Side: Counters */}
      <div
        style={{
          flex: "1 1 400px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          minWidth: "300px",
          marginTop: "2rem",
        }}
      >
        <Counter end={1000} caption="Products Available" />
        <Counter end={500} caption="Verified Sellers" />
        <Counter end={1200} caption="Daily Orders" />
        <Counter end={300} caption="Cities Served" />
      </div>
    </div>
  );
};

export default ExploreSection;
