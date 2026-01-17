// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";

interface Pokemon {
  name: string;
  sprites: { front_default: string };
}

interface Quote {
  content: string;
  author: string;
}

interface Weather {
  temperature: number;
  windspeed: number;
}

const HomePage: React.FC = () => {
  const [pokemonName, setPokemonName] = useState("ditto");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  const [city, setCity] = useState("São Paulo");
  const [weather, setWeather] = useState<Weather | null>(null);

  const [quote, setQuote] = useState<Quote | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar Pokémon
  const fetchPokemon = async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!res.ok) throw new Error("Pokémon não encontrado!");
      const data: Pokemon = await res.json();
      setPokemon(data);
    } catch (err: any) {
      setError(err.message);
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar Clima (Open-Meteo precisa lat/lon)
  const fetchWeather = async (cityName: string) => {
    try {
      // Coordenadas de algumas cidades comuns
      const coords: Record<string, [number, number]> = {
        "são paulo": [-23.55, -46.63],
        "rio de janeiro": [-22.91, -43.17],
        "berlim": [52.52, 13.41],
        "nova york": [40.71, -74.01],
        "londres": [51.51, -0.13],
      };

      const cityKey = cityName.toLowerCase();
      const [lat, lon] = coords[cityKey] || coords["são paulo"];

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      if (!res.ok) throw new Error("Erro ao buscar clima");
      const data = await res.json();
      setWeather(data.current_weather);
    } catch (err: any) {
      setError(err.message);
      setWeather(null);
    }
  };

  // Função para buscar citação
  const fetchQuote = async () => {
    try {
      const res = await fetch("https://api.quotable.io/random");
      if (!res.ok) throw new Error("Erro ao buscar citação");
      const data: Quote = await res.json();
      setQuote(data);
    } catch (err: any) {
      setError(err.message);
      setQuote(null);
    }
  };

  // Carrega dados iniciais
  useEffect(() => {
    fetchPokemon(pokemonName);
    fetchWeather(city);
    fetchQuote();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center p-4 text-white space-y-8">
      <h1 className="text-5xl font-extrabold animate-pulse text-center mt-6">✨ Hub Interativo de APIs ✨</h1>

      {error && <p className="text-red-300 font-bold">{error}</p>}

      {/* Pokémon */}
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 flex flex-col items-center shadow-lg animate-fadeIn w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">🎮 Pokémon</h2>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Digite o nome do Pokémon"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            className="p-2 rounded-l-md text-black w-full"
          />
          <button
            onClick={() => fetchPokemon(pokemonName)}
            className="bg-purple-700 px-4 rounded-r-md hover:bg-purple-900 transition"
          >
            Buscar
          </button>
        </div>
        {loading && <p className="animate-bounce">Carregando...</p>}
        {pokemon && (
          <>
            <h3 className="text-xl font-bold mb-2">{pokemon.name.toUpperCase()}</h3>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32 mb-2 animate-bounce" />
          </>
        )}
      </div>

      {/* Clima */}
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 flex flex-col items-center shadow-lg animate-fadeIn w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">🌤️ Clima</h2>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Digite a cidade (ex: São Paulo)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 rounded-l-md text-black w-full"
          />
          <button
            onClick={() => fetchWeather(city)}
            className="bg-indigo-700 px-4 rounded-r-md hover:bg-indigo-900 transition"
          >
            Buscar
          </button>
        </div>
        {weather && (
          <>
            <p className="text-lg">Temperatura: {weather.temperature}°C</p>
            <p className="text-lg">Vento: {weather.windspeed} km/h</p>
          </>
        )}
      </div>

      {/* Citação */}
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 flex flex-col items-center shadow-lg animate-fadeIn w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">💡 Citação Aleatória</h2>
        {quote && (
          <>
            <p className="italic text-lg mb-2">"{quote.content}"</p>
            <p className="font-semibold mb-4">- {quote.author}</p>
          </>
        )}
        <button
          onClick={fetchQuote}
          className="bg-pink-700 px-6 py-2 rounded-md hover:bg-pink-900 transition"
        >
          Nova Citação
        </button>
      </div>
    </div>
  );
};

export default HomePage;
