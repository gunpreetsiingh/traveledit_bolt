import { Masonry } from "@/components/ui/masonry";

const data = [
  { id: 1, image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400', height: 400, originalData: { title: 'Santorini Sunset', location: 'Greece' } },
  { id: 2, image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400', height: 300, originalData: { title: 'Kyoto Temple', location: 'Japan' } },
  { id: 3, image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=400', height: 300, originalData: { title: 'Patagonia', location: 'Chile' } },
  { id: 4, image: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=400', height: 300, originalData: { title: 'Tuscany', location: 'Italy' } },
  { id: 5, image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400', height: 300, originalData: { title: 'Maldives', location: 'Maldives' } },
  { id: 6, image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=400', height: 300, originalData: { title: 'Morocco', location: 'Morocco' } },
  { id: 7, image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', height: 200, originalData: { title: 'Bangkok', location: 'Thailand' } },
  { id: 8, image: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=400', height: 300, originalData: { title: 'Iceland', location: 'Iceland' } },
  { id: 9, image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400', height: 200, originalData: { title: 'Bali', location: 'Indonesia' } },
  { id: 10, image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400', height: 400, originalData: { title: 'Swiss Alps', location: 'Switzerland' } },
  { id: 11, image: 'https://images.pexels.com/photos/1123982/pexels-photo-1123982.jpeg?auto=compress&cs=tinysrgb&w=400', height: 250, originalData: { title: 'Napa Valley', location: 'USA' } },
  { id: 12, image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=400', height: 350, originalData: { title: 'Safari', location: 'Tanzania' } },
];

const DemoOne = () => {
  const renderItem = (item: any) => (
    <div 
      className="w-full h-full overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 transition duration-300 ease hover:scale-105"
      style={{
        backgroundImage: `url(${item.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white font-semibold">{item.title}</h3>
        <p className="text-white/80 text-sm">{item.location}</p>
      </div>
    </div>
  );

  return (
    <div className="flex w-full h-screen justify-center items-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-screen-xl mx-auto h-[80vh] overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-900 p-4">
        <Masonry data={data} renderItem={renderItem} />
      </div>
    </div>
  );
};

export { DemoOne };