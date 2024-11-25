import React, { useState, useEffect, useRef } from 'react';
import { Download, Copy, RefreshCw, Quote } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

const backgrounds = [
  'https://images.unsplash.com/photo-1668385900286-c6b7943f8567?fm=jpg&q=60&w=3000',
  'https://img.freepik.com/premium-photo/copy-space-motivational-quotes-empty-space-background_991638-2527.jpg',
  'https://t4.ftcdn.net/jpg/05/56/84/37/360_F_556843786_CFAv2Zjmxi4w1NCnfQ8PHCiDgmBxregg.jpg',
  'https://t4.ftcdn.net/jpg/04/95/69/23/360_F_495692340_rLRD3Q1IL6fvK64ZfVrDqTWNaTRb0C9g.jpg',
  'https://img.freepik.com/premium-photo/copy-space-quote-empty-paper-background_991638-2224.jpg'
];

const categories = [
  'happiness', 'love', 'inspiration', 'life', 'success', 'wisdom', 
  'motivation', 'friendship', 'faith', 'hope', 'courage', 'peace'
];

function App() {
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [category, setCategory] = useState('happiness');
  const [background, setBackground] = useState(backgrounds[0]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/quotes?category=${category}`,
        {
          headers: {
            'X-Api-Key': 'N1mxWuTUjC+BAxTK94Bb2w==bmCAxjI8pJy1bhzM'
          }
        }
      );
      const data = await response.json();
      if (data[0]) {
        setQuote(data[0]);
        setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, [category]);

  const downloadImage = async () => {
    if (quoteRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(quoteRef.current);
        const link = document.createElement('a');
        link.download = 'quote.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const copyImageToClipboard = async () => {
    if (quoteRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(quoteRef.current);
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying image:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      {/* 3D Header */}
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 transform hover:scale-105 transition-transform duration-300 cursor-default"
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.1), 0 0 40px rgba(255,255,255,0.1)',
              transform: 'perspective(500px) rotateX(10deg)'
            }}>
          <Quote className="inline-block w-12 h-12 mr-4 transform -rotate-6" />
          Quote Creator
        </h1>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <select
            className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all hover:bg-white/20"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-800">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          
          <button
            onClick={fetchQuote}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'New Quote'}
          </button>
        </div>

        <div
          ref={quoteRef}
          className="relative overflow-hidden rounded-xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
          style={{
            aspectRatio: '16/9',
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-sm" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center">
            <p className="text-3xl md:text-4xl font-serif leading-relaxed mb-6 max-w-2xl" 
               style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              "{quote.quote}"
            </p>
            <p className="text-xl md:text-2xl font-light" 
               style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              - {quote.author}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={copyImageToClipboard}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all transform hover:scale-105 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
            }`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy as Image'}
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;