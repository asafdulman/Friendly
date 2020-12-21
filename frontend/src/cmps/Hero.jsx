import React, { Component } from 'react'
import { FilterSearch } from './FilterSearch'
import { Parallax } from 'react-parallax';
export class Hero extends Component {

    render() {
        return (
            <Parallax
                className='hero-container'
                bgImage={require('../assets/img/hero1.jpg')}
                bgImageAlt="the cat"
                strength={800}
            >
                <div className="hero-container full">
                    <div className="hero-content">
                        <h1 className="hero-heading-up"><span className="span">Friendly.</span> Adopt a <span className="span">pet</span> </h1>
                        <h1 className="hero-heading">Discover your next best friend</h1>
                        <FilterSearch parent='hero' />
                    </div>
                </div>
            </Parallax>
        )
    }
}
