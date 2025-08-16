
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResourceCard from '@/components/ResourceCard';
import { resources, categories } from '@/data/resources';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredResources = resources.filter((resource) => {
    // Filter by category
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;
    
    // Filter by search query
    const query = searchQuery.toLowerCase();
    const titleMatch = resource.title.toLowerCase().includes(query);
    const descriptionMatch = resource.description.toLowerCase().includes(query);
    
    return categoryMatch && (titleMatch || descriptionMatch);
  });
  
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Wellness Resources</h1>
            <p className="text-xl text-gray-600">
              Curated articles and guides to support your mental wellness journey
            </p>
          </div>
          
          <div className="mb-8">
            <div className="max-w-md mx-auto mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <TabsTrigger key={category.value} value={category.value}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No resources found</h3>
              <p className="text-gray-600">Try changing your filters or search term</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResourcesPage;
