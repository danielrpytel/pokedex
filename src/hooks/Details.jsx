import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import HeaderName from '../components/details/HeaderName';
import PokemonImg from '../components/details/PokemonImg';
import PokemonOverview from '../components/details/PokemonOverview';

function Details() {
    const { name } = useParams();

    const [pokemonData, setPokemonData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPokemon() {
            await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then((pokemon) => {
                loadSpecies(pokemon.data);
            })    
        }

        async function loadSpecies(pokemon) {
            
            try {
                let pokeSpecies = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
                let pokeEvolution = await axios.get(pokeSpecies.data.evolution_chain.url);
    
                var flavor_text_sword = "";
                var flavor_text_shield = "";
    
                pokeSpecies.data.flavor_text_entries.forEach((item) => {
                    if (item.language.name !== "en") return false;
                    if (item.version.name === "sword") {
                      flavor_text_sword = item.flavor_text;
                    } else if (item.version.name === "shield") {
                      flavor_text_shield = item.flavor_text;
                    }
                  });
    
                var abilities = "";
    
                pokemon.abilities.forEach((item, index) => {
                    abilities += `${item.ability.name}${
                        pokemon.abilities.length === index + 1 ? "" : ", "
                    }`;
                });
    
                var pokemonObj = {
                    id: pokemon.id,
                    name: pokemon.name,
                    image: pokemon.sprites.other['official-artwork'].front_default,
                    types: pokemon.types,
                    flavor_text_sword,
                    flavor_text_shield,
                    height: pokemon.height,
                    weight: pokemon.weight,
                    abilities,
                    gender_rate: pokeSpecies.data.gender_rate,
                    capture_rate: pokeSpecies.data.capture_rate,
                    habitat: pokeSpecies.data.habitat?.name,
                    stats: pokemon.stats,
                    evolution: pokeEvolution.data.chain,
                  };
    
                setPokemonData(pokemonObj)
                setLoading(false);
            } catch (error) {
                console.log(error);
            }   
        }

        loadPokemon();
    }, []) 
    
    console.log("pokemon Data");
    console.log(pokemonData);

    return (
        <>
            { loading ? (
                <h1>Loading...</h1>
                ) : (
                <div className="flex flex-col">
                    <HeaderName 
                    name= {pokemonData.name.replace(/^./, (str) => str.toUpperCase())} 
                    id = {pokemonData.id.toString().padStart(4, "0")}
                    />
                        
                    <div className="flex flex-row">
                        <div className="w-1/2">
                            <PokemonImg 
                            name = {pokemonData.name}
                            height = {pokemonData.height}
                            image = {pokemonData.image}
                            />
                        </div>
                        <div className="w-1/2">
                            <PokemonOverview 
                             flavor_text_sword={pokemonData.flavor_text_sword}
                             flavor_text_shield={pokemonData.flavor_text_shield}
                             nameAlt={pokemonData.name}
                            />
                        </div>
                    </div> 
                </div>  
            )}         
        </>
        
    )
}

export default Details;




