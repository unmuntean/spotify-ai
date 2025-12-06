
import React, { useState } from 'react';
import { Button } from './Button';
import { Key, ExternalLink, Check } from 'lucide-react';

interface TokenGateProps {
  onTokenSubmit: (token: string) => void;
}

export const TokenGate: React.FC<TokenGateProps> = ({ onTokenSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onTokenSubmit(input.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-spotify-black p-4">
      <div className="max-w-md w-full bg-spotify-dark border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-spotify-base/10 rounded-full flex items-center justify-center">
            <Key className="text-spotify-base" size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">Authentication Required</h2>
        <p className="text-spotify-grey text-center mb-8 text-sm">
          To provide real functionality without a backend server, this app connects directly to Spotify. Please provide a temporary Access Token.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Spotify Access Token
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="BQB..."
              className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-spotify-base focus:ring-1 focus:ring-spotify-base transition-colors font-mono text-sm"
            />
          </div>

          <Button 
            type="submit" 
            disabled={!input} 
            className="w-full justify-center"
          >
            Connect
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5">
          <h4 className="text-sm font-semibold text-white mb-2">How to get a token?</h4>
          <ol className="text-xs text-spotify-grey space-y-2 list-decimal list-inside">
            <li>Go to Spotify's <a href="https://developer.spotify.com/console/get-recommendations/" target="_blank" rel="noreferrer" className="text-spotify-base hover:underline inline-flex items-center">Developer Console <ExternalLink size={10} className="ml-1" /></a>.</li>
            <li>Click <strong className="text-white">Get Token</strong>.</li>
            <li>Select scopes (e.g., <code className="bg-white/10 px-1 rounded">playlist-read-private</code>).</li>
            <li>Click <strong className="text-white">Request Token</strong>.</li>
            <li>Copy the generated <code>OAuth Token</code> string and paste it above.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
