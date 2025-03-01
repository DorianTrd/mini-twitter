// components/SearchBar.tsx
import React from "react";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

//Barre de recherche des titres et nom d'utilisateurs
const SearchBar: React.FC<SearchBarProps> = ({searchQuery, setSearchQuery}) => {
    return (
        <div className="mb-6">
            <input
                type="text"
                placeholder="Rechercher par titre ou nom d'auteur"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
            />
        </div>
    );
};

export default SearchBar;
