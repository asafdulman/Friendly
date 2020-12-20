import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Input, InputLabel, Select } from '@material-ui/core';

import { TagsFilter } from './TagsFilter'
import { setFilter, loadPets } from '../store/actions/petActions.js'
import { FilterSearch } from './FilterSearch';
import { CategoryList } from './CategoryList';
// import SearchIcon from '@material-ui/icons/Search';

class _PetFilter extends Component {

    state = {
        parent: '',
        filterBy: {
            type: '',
            gender: '',
            breed: '',
            size: '',
            txt: '',
            distance: {
                lat: 0,
                lon: 0,
                range: 0
            }
        },
        isModalShown: false,
        tags: []

    }

    async componentDidMount() {
        await navigator.geolocation.getCurrentPosition(
            this.getUserPosition,
            function (error) {
                console.error("Error Code = " + error.code + " - " + error.message);
            }
        );
    }

    getUserPosition = async (position) => {
        const distance = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            range: 0
        }
        await this.setState({ filterBy: { ...this.state.filterBy, distance: distance } });
    }

    onFilterChange = async (obj) => {
        await this.props.setFilter({ ...this.props.filterBy, ...obj }, () => this.loadPets())
    }

    onSetCategory = async (_type) => {
        await this.setState({
            filterBy: {
                ...this.state.filterBy,
                type: _type
            }
        })
        this.onFilterChange({ 'type': _type })
    }

    handleInput = async ({ target }) => {
        const field = target.name;
        const value = (target.type === 'number') ? +target.value : target.value
        await this.setState(prevState => {
            if (field === 'range') {
                return {
                    ...prevState,
                    filterBy: {
                        ...prevState.filterBy,
                        distance: {
                            ...prevState.filterBy.distance,
                            [field]: value
                        }
                    }
                }
            } else {
                return {
                    ...prevState,
                    filterBy: {
                        ...prevState.filterBy,
                        [field]: value
                    }
                }
            }
        });
        this.onFilterChange(this.state.filterBy);
    }

    render() {
        return (
            <div className="filter-container flex column align-center">

                <section className="search-container flex space-around">
                    <FilterSearch parent="main" onInputChange={this.onInputChange} />
                </section>
                <section className="category-container">
                    <CategoryList onCategoryChange={this.onSetCategory} />
                </section>
                <section>
                    <InputLabel htmlFor='Distance(km)'>Distance(km)</InputLabel>
                    <Select
                        native
                        onChange={this.handleInput}
                        inputProps={{
                            name: 'range',
                            type: "number"
                        }}
                    >
                        <option aria-label="None" value="" />
                        <option value="20">20km</option>
                        <option value="50">50km</option>
                        <option value="100">100km</option>
                        <option value="200">200km</option>
                    </Select>
                </section>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        filterBy: state.petReducer.filterBy
    }
}

const mapDispatchToProps = {
    setFilter,
    loadPets
}


export const PetFilter = connect(mapStateToProps, mapDispatchToProps)(_PetFilter)
