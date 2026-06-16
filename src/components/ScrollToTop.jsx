import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const ScrollToTop = () => {
    const pathName = useLocation()
    
    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [pathName])
}