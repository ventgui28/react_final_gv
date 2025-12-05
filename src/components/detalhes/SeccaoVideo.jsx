import { PlayCircle } from 'lucide-react';

const SeccaoVideo = ({ urlYoutube }) => {
  const obterIdYoutube = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = obterIdYoutube(urlYoutube);

  if (!videoId) return null;

  return (
    <div className="mb-16 print:hidden">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
        <PlayCircle className="mr-4 text-orange-600" size={32} />
        Preparação em Vídeo
      </h2>
      <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-gray-100 dark:border-gray-700 transform hover:scale-[1.01] transition-transform duration-500">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default SeccaoVideo;