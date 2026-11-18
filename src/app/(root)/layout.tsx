import type { ChildrenProps } from "@/typs";
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

const RootLayoutPAge = ({ children }: ChildrenProps) => {
    return (
       <>
       <Navbar></Navbar>
       {children}
       <Footer></Footer>
       </>
    );
};

export default RootLayoutPAge;