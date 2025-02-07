export interface DogType {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

export default function Dog({ dog }: { dog: DogType }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <img src={dog.img} alt={dog.name} width={160} height={160} className="object-cover rounded-full" />
      <h2 className="text-2xl font-bold">{dog.name}</h2>
      <p className="text-lg">Breed: {dog.breed}</p>
      <p className="text-lg">{dog.age} years old</p>
      <p className="text-lg">Zip Code: {dog.zip_code}</p>
    </div>
  )
}