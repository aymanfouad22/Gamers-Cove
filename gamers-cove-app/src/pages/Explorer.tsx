import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Explorer() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Game Explorer</h1>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search games by title, genre, or platform..."
            className="pl-9 w-full"
          />
        </div>
      </div>
      
      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Puzzle'].map((genre) => (
              <div 
                key={genre}
                className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
              >
                <span className="font-medium">{genre}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Rated</h2>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card p-4 rounded-lg border flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium">Game Title {i}</h3>
                  <p className="text-sm text-muted-foreground">Genre • Platform</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-xs text-muted-foreground ml-1">(0)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
