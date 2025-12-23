import React from 'react';
import { Header } from './header';
import { Footer } from './footer';

const Layout = ({ children, showFooter = true }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#ffd700] selection:text-black">
            <Header />
            <main className="pt-24 min-h-[calc(100vh-80px)]">
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

export default Layout;
