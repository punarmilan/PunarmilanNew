import React from 'react'
import BasicSearch from './basicSearch/BasicSearch'
import SearchNav from './SearchNav'
import AdvancedSearch from './AdvSearch/AdvancedSearch'

function Search() {
    return (
        <div>
            <SearchNav />
            <BasicSearch />
        </div>
    )
}

export default Search