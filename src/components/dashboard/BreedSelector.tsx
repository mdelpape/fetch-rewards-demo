'use client';

import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

interface BreedSelectorProps {
  setSelectedBreed: Dispatch<SetStateAction<string | null>>;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true
});


export default function BreedSelector({ setSelectedBreed }: BreedSelectorProps) {

  const getBreeds = async () => {
    const { data } = await api.get("/dogs/breeds",
      { withCredentials: true }
    );
    return data;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["getBreeds"],
    queryFn: getBreeds,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <select className="p-2 border border-gray-300 rounded-md text-black" name="breed" id="breed"
      onChange={(e) => setSelectedBreed(e.target.value)}
    >
      <option value="">Select</option>
      {data.map((breed: string) => (
      <option key={breed} value={breed}>
        {breed}
      </option>
      ))}
    </select>
  );
}