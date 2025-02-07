'use client';

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { DogType } from "@/components/dashboard/Dog";
import BreedSelector from "@/components/dashboard/BreedSelector";
import DogList from "@/components/dashboard/DogList";

interface SearchResponse {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

interface SearchParams {
  breeds?: string[];
  size?: number;
  from?: string;
  sort?: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true
});

// Helper function to extract cursor value from next/prev URLs
const extractCursorFromUrl = (url: string | null) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url, process.env.NEXT_PUBLIC_API_BASE_URL);
    return urlObj.searchParams.get('from');
  } catch (e) {
    console.log('Failed to parse cursor from URL:', e);
    return url; // If parsing fails, return the original string
  }
};

export default function Home() {
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(25);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dogs', selectedBreed, pageSize, currentCursor, sortDirection],
    queryFn: async () => {
      // Prepare search parameters
      const params: SearchParams = {
        size: pageSize,
        sort: `breed:${sortDirection}`
      };

      if (selectedBreed) {
        params.breeds = [selectedBreed];
      }

      if (currentCursor) {
        params.from = currentCursor;
      }

      // Get search results
      const searchResponse = await api.get<SearchResponse>('/dogs/search', {
        params,
        paramsSerializer: {
          encode: (param: string) => param // Prevent double encoding
        }
      });

      // Get dog details
      const dogsResponse = await api.post<DogType[]>('/dogs', searchResponse.data.resultIds);

      // Return combined data with parsed cursors
      return {
        dogs: dogsResponse.data,
        total: searchResponse.data.total,
        next: extractCursorFromUrl(searchResponse.data.next),
        prev: extractCursorFromUrl(searchResponse.data.prev)
      };
    }
  });

  const handleNextPage = () => {
    if (data?.next) {
      setCurrentCursor(data.next);
    }
  };

  const handlePrevPage = () => {
    if (data?.prev) {
      setCurrentCursor(data.prev);
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentCursor(null);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (error) {
    return <div>Error loading dogs. Please try again.</div>;
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full flex flex-col gap-4 sm:flex-row sm:justify-between items-center">
        <BreedSelector setSelectedBreed={setSelectedBreed} />

        <div className="flex gap-4 items-center">
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="p-2 border rounded text-black"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>

          <button
            onClick={toggleSortDirection}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Sort {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <DogList dogs={data?.dogs || []} selectedDogs={selectedDogs} setSelectedDogs={setSelectedDogs}/>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePrevPage}
              disabled={!data?.prev}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {data?.total && (
              <span className="flex items-center">
                Showing {data.dogs.length} of {data.total} results
              </span>
            )}

            <button
              onClick={handleNextPage}
              disabled={!data?.next}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}