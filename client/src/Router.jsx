import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Home from "./Home";
// Make sure to create this component

const Router = ({ children }) => {
    return (
        <BrowserRouter>
            {children}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;