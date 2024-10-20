import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes/paths";
// import CartProvider from '../src/context/CartContext.jsx';
// import Cart from '../src/pages/cart/Cart.jsx';

function App() {
  return (
    
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children &&
                route.children.map((child, childIndex) => (
                  <Route
                    key={childIndex}
                    path={child.path}
                    element={child.element}
                  />
                ))}
            </Route>
          ))}
          <Route/>
        </Routes>
      </Router>
    
  );
}

export default App;
