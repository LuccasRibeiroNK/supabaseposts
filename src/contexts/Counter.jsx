import React from "react";
import PropTypes from "prop-types";

export const CounterContext = React.createContext();

const Counter = ({ children }) => {
  const [user, setUser] = React.useState({});
  return (
    <CounterContext.Provider value={{ user, setUser }}>
      {children}
    </CounterContext.Provider>
  );
};

Counter.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Counter;
