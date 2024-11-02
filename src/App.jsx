// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho Toastify
import { routes } from "./routes/paths";

function App() {
  return (
    <div>
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

      {/* Thêm ToastContainer để quản lý thông báo */}
      <ToastContainer 
        position="top-right" // Vị trí hiển thị toast
        autoClose={5000}     // Thời gian tự đóng (5 giây)
        hideProgressBar={false} // Hiển thị thanh tiến trình
        newestOnTop={false}  // Đặt thông báo mới nhất ở trên cùng
        closeOnClick         // Đóng toast khi người dùng click
        pauseOnHover         // Tạm dừng khi di chuột qua toast
        draggable            // Cho phép kéo toast
      />
    </div>
  );
}

export default App;
