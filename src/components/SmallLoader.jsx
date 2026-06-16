import React from 'react'
import { ClipLoader } from 'react-spinners'

function SmallLoader({ loading, Element }) {
    return (
        <>
            {loading ?
                <ClipLoader size={30} color='black' /> :
                {Element}
            }
        </>
    )
}

export default SmallLoader