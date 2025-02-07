'use client';
import { useState } from 'react';
import Dog, { DogType } from './Dog';
import axios from 'axios';
import { useToast } from '@/context/ToastContext';
import Button from '../atoms/Button';

interface DogListProps {
  dogs: DogType[];
  selectedDogs: string[];
  setSelectedDogs: (dogs: string[]) => void;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true
});


interface Match {
  match: string;
}

export default function DogList({ dogs, selectedDogs, setSelectedDogs }: DogListProps) {
  const [dogMatch, setDogMatch] = useState<DogType | null>(null);
  const { triggerToast } = useToast();

  const findMatch = async () => {
    try {
      const { data } = await api.post<Match>('/dogs/match', selectedDogs);
      setDogMatch(dogs.find(dog => dog.id === data.match) || null);
      triggerToast({
        title: "Match Found",
        description: "Match successfully found",
      });
    } catch (error) {
      console.error('Failed to find match', error);
      triggerToast({
        title: "Failed to find match",
        description: "Please select and try again",
      })
    }
  }

  const closeModal = () => {
    setDogMatch(null);
    setSelectedDogs([]);
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center">Select your favorites then find your match!</h1>
      <Button
        className="bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded"
        onClick={findMatch}
      >
        Find Your Match!
      </Button>

      {/* Modal */}
      {dogMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 text-black">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Perfect Match! 🎉</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <Dog dog={dogMatch} />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeModal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {dogs.map(dog => (
          <div
            key={dog.id}
            className={`group hover:cursor-pointer rounded-lg transition-all p-2 text-black ${selectedDogs.includes(dog.id)
              ? 'shadow-lg border-4 border-green-500 bg-green-100'
              : 'hover:shadow-lg border-4 border-blue-300 bg-blue-50'
              }`}
            onClick={() => {
              if (selectedDogs.includes(dog.id)) {
                setSelectedDogs(selectedDogs.filter(id => id !== dog.id));
              } else {
                setSelectedDogs([...selectedDogs, dog.id]);
              }
            }}
          >
            <Dog dog={dog} />
          </div>
        ))}
      </div>
    </>
  );
}