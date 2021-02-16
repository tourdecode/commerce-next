import React from 'react'

import {useRouter} from 'next/router'

const product = () => {
    const route = useRouter()
    console.log(route);
    return (
        <div>
            Dynamic Page: {route.query.productId}
        </div>
    )
}

export default product
