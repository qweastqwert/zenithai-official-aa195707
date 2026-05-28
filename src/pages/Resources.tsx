import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ResourceCard from '@/components/ResourceCard';
import { resources, categories } from '@/data/resources';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isMobile } = useDeviceDetection();
  
  const filteredResources = resources.filter((resource) => {
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const titleMatch = resource.title.toLowerCase().includes(query);
    const descriptionMatch = resource.description.toLowerCase().includes(query);
    const tagMatch = resource.tags.some(tag => tag.toLowerCase().includes(query));
    
    return categoryMatch && (titleMatch || descriptionMatch || tagMatch);
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery !== '';
  
  return (
    <>
      <SEO
        title="Mental Wellness Resources — Zenith AI"
        description="Browse a curated library of mental wellness articles on anxiety, sleep, mindfulness, stress, and self-care."
        path="/resources"
      />
      <Header />
      <main className="min-h-screen pt-20 pb-16 px-3 sm:px-4 bg-sunrise-warm">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 text-foreground">
              Wellness Resources
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Articles and guides to support your mental wellness journey
            </p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md py-3 -mx-3 px-3 sm:-mx-4 sm:px-4 mb-4 border-b border-border/50">
            <div className="flex gap-2">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  className="pl-9 pr-8 h-10 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              {isMobile ? (
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0 relative">
                      <Filter className="h-4 w-4" />
                      {selectedCategory !== 'all' && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto max-h-[60vh]">
                    <SheetHeader>
                      <SheetTitle>Filter by Category</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {categories.map((category) => (
                        <Button
                          key={category.value}
                          variant={selectedCategory === category.value ? 'default' : 'outline'}
                          className="justify-start h-11"
                          onClick={() => {
                            setSelectedCategory(category.value);
                            setIsFilterOpen(false);
                          }}
                        >
                          {category.label}
                        </Button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              ) : null}
            </div>

            {/* Desktop Category Pills */}
            {!isMobile && (
              <ScrollArea className="w-full mt-3">
                <div className="flex gap-2 pb-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? 'default' : 'outline'}
                      size="sm"
                      className="flex-shrink-0 h-8"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs text-muted-foreground">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {categories.find(c => c.value === selectedCategory)?.label}
                    <button 
                      onClick={() => setSelectedCategory('all')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <button 
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
          
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredResources.length} {filteredResources.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>

          {/* Resource Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResourcesPage;
