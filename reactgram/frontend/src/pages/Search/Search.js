import React from 'react'

//hooks
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage'
import { useQuery } from '../../hooks/useQuery'

//components
import LikeContainer from '../../components/LikeContainer'
import PhotoItem from '../../components/PhotoItem'
import { Link } from 'react-router-dom'

//redux

const Search = () => {
    return (
        <div>Search</div>
    )
}

export default Search