import React from 'react';
import { Outlet } from 'react-router-dom';
import GuideNavbar from '../components/guide/GuideNavbar';

const GuideLayout = () => {
    return (
        <div className="min-h-screen bg-surface flex flex-col">
            <main className="flex-1 pb-32">
                <Outlet />
            </main>
            <GuideNavbar />
        </div>
    );
};

export default GuideLayout;
